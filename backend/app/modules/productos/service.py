from app.core.errors import NotFound
from app.modules.categorias.service import CategoriaNoEncontrada
from .models import Producto
from .schemas import ProductoCreate, ProductoUpdate, ProductoStockUpdate, ProductoRead, ProductosPaginados
from .unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(NotFound):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    def _obtener(self, uow, id: int, lock=False):
        producto = uow.productos.get_by_id(id, lock=lock)
        if producto is None or not producto.activo:
            raise ProductoNoEncontrado("Producto inexistente")
        return producto

    def _categoria(self, uow, id: int):
        categoria = uow.categorias.get_by_id(id)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada("Categoría inexistente")
        return categoria

    def listar(self, **filters):
        with self.uow as uow:
            total, productos = uow.productos.search(**filters)
            return ProductosPaginados(total=total, items=[ProductoRead.model_validate(p) for p in productos])

    def obtener(self, id: int):
        with self.uow as uow:
            return ProductoRead.model_validate(self._obtener(uow, id))

    def crear(self, data: ProductoCreate):
        with self.uow as uow:
            categoria = self._categoria(uow, data.categoria_id)
            producto = uow.productos.add(Producto(**data.model_dump(), categoria=categoria))
            return ProductoRead.model_validate(producto)

    def actualizar(self, id: int, data: ProductoUpdate | ProductoStockUpdate):
        with self.uow as uow:
            producto = self._obtener(uow, id, lock=True)
            changes = data.model_dump(exclude_unset=True)
            if "categoria_id" in changes:
                producto.categoria = self._categoria(uow, changes["categoria_id"])
            producto.sqlmodel_update(changes)
            return ProductoRead.model_validate(producto)

    def eliminar(self, id: int):
        with self.uow as uow:
            self._obtener(uow, id, lock=True).activo = False
