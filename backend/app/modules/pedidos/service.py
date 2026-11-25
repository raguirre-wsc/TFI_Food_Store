from decimal import Decimal
from app.core.errors import DomainError, NotFound, Forbidden
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic
from .models import Pedido, DetallePedido, utc_now
from .schemas import PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from .unit_of_work import PedidoUnitOfWork


class PedidoNoEncontrado(NotFound):
    pass


class PedidoAjeno(Forbidden):
    pass


class StockInsuficiente(DomainError):
    pass


class ProductoNoDisponible(DomainError):
    pass


class ProductoRepetido(DomainError):
    pass


class TransicionInvalida(DomainError):
    pass


TRANSICIONES = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


def dinero(value):
    # Conserva la precisión publicada; el UML exige persistir montos float.
    return float(Decimal(str(value)))


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def _obtener(self, uow, id: int, lock=False):
        pedido = uow.pedidos.get_by_id(id, lock=lock)
        if pedido is None:
            raise PedidoNoEncontrado("Pedido inexistente")
        return pedido

    def _permiso(self, pedido, actor: UserPublic):
        if actor.role != "admin" and pedido.usuario_id != actor.id:
            raise PedidoAjeno("El pedido pertenece a otro usuario")

    def crear(self, data: PedidoCreate, actor: UserPublic):
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido("Un producto no puede repetirse en el pedido")
            pedido = Pedido(usuario_id=actor.id, **data.model_dump(exclude={"items"}))
            uow.pedidos.add(pedido)
            # Orden estable de bloqueos para evitar interbloqueos entre carritos.
            for item in sorted(data.items, key=lambda item: item.producto_id):
                producto = uow.productos.get_by_id(item.producto_id, lock=True)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(f"Producto {item.producto_id} inexistente")
                if not producto.disponible:
                    raise ProductoNoDisponible(f"{producto.nombre} no está disponible")
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(f"Stock insuficiente de {producto.nombre}. Disponible: {producto.stock}")
                producto.stock -= item.cantidad
                precio = dinero(producto.precio_base)
                subtotal = dinero(Decimal(str(precio)) * item.cantidad)
                pedido.items.append(DetallePedido(producto_id=producto.id, cantidad=item.cantidad,
                    nombre_producto=producto.nombre, precio_unitario=precio, subtotal=subtotal))
                pedido.total = dinero(Decimal(str(pedido.total)) + Decimal(str(subtotal)))
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(self, actor: UserPublic, **filters):
        with self.uow as uow:
            total, pedidos = uow.pedidos.list_by_usuario(
                usuario_id=None if actor.role == "admin" else actor.id, **filters)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(p) for p in pedidos])

    def obtener(self, id: int, actor: UserPublic):
        with self.uow as uow:
            pedido = self._obtener(uow, id)
            self._permiso(pedido, actor)
            return PedidoRead.model_validate(pedido)

    def _transicion(self, uow, pedido, estado: str):
        if estado not in TRANSICIONES[pedido.estado]:
            raise TransicionInvalida(f"No se puede pasar de {pedido.estado} a {estado}")
        if estado == "CANCELADO":
            for item in sorted(pedido.items, key=lambda item: item.producto_id):
                # También se devuelve stock a productos dados de baja.
                producto = uow.productos.get_by_id(item.producto_id, lock=True)
                producto.stock += item.cantidad
        pedido.estado = estado
        pedido.updated_at = utc_now()

    def cambiar_estado(self, id: int, estado: str):
        with self.uow as uow:
            pedido = self._obtener(uow, id, lock=True)
            self._transicion(uow, pedido, estado)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, id: int, actor: UserPublic):
        with self.uow as uow:
            pedido = self._obtener(uow, id, lock=True)
            self._permiso(pedido, actor)
            if actor.role != "admin" and pedido.estado != "PENDIENTE":
                raise TransicionInvalida("Solo puede cancelar sus pedidos pendientes")
            self._transicion(uow, pedido, "CANCELADO")
            return PedidoRead.model_validate(pedido)

    def resumen(self):
        with self.uow as uow:
            counts = uow.pedidos.count_by_estado()
            return ResumenPedidos(pendientes=counts.get("PENDIENTE", 0),
                en_preparacion=counts.get("EN_PREPARACION", 0), entregados=counts.get("ENTREGADO", 0),
                cancelados=counts.get("CANCELADO", 0), pedidos_hoy=uow.pedidos.count_today(),
                ingresos_entregados=dinero(uow.pedidos.delivered_income()))
