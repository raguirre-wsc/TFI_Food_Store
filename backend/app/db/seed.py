from sqlalchemy import delete, text
from app.core.database import create_all_tables
from app.core.config import settings
from app.core.security import get_password_hash
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.pedidos.models import Pedido, DetallePedido


def seed():
    """Borra todos los datos de la app y carga el estado inicial en una transacción."""
    create_all_tables()
    with UsuarioUnitOfWork() as uow:
        if uow.session.get_bind().dialect.name == "postgresql":
            uow.session.execute(text(
                "TRUNCATE TABLE detallepedido, pedido, producto, categoria, usuario RESTART IDENTITY"
            ))
        else:
            # Respetar las claves foráneas. SQLite reinicia sus IDs al vaciar las tablas.
            for model in (DetallePedido, Pedido, Producto, Categoria, Usuario):
                uow.session.execute(delete(model))

        valores_admin = dict(full_name="Administrador Food Store", email="admin@foodstore.com",
                             role="admin", disabled=False)
        uow.usuarios.add(Usuario(username="admin", **valores_admin,
                                hashed_password=get_password_hash("Admin1234!")))

        categorias = {}
        for nombre, descripcion in [("Hamburguesas", "Clásicos a la plancha, preparados en el momento."),
                ("Pizzas", "Masa artesanal y buenos ingredientes."), ("Acompañamientos", "El complemento para tu pedido.")]:
            categoria = Categoria(nombre=nombre, descripcion=descripcion)
            uow.session.add(categoria)
            categorias[nombre] = categoria
        uow.session.flush()
        # Fotografías incluidas en el frontend: URLs HTTP, sin depender de terceros al ejecutar.
        datos = [
            ("Clásica de la casa", "Carne, cheddar, lechuga y nuestra salsa.", 8500, "Hamburguesas", "photo-1568901346375-23c9450c58cd"),
            ("Doble cheddar", "Doble carne, doble cheddar y cebolla.", 11000, "Hamburguesas", "photo-1561758033-d89a9ad46330"),
            ("Veggie", "Medallón de vegetales, rúcula y tomate.", 9000, "Hamburguesas", "photo-1520072959219-c595dc870360"),
            ("Muzzarella", "Salsa de tomate, muzzarella y aceitunas.", 12500, "Pizzas", "photo-1513104890138-7c749659a591"),
            ("Napolitana", "Muzzarella, tomate fresco, ajo y orégano.", 14000, "Pizzas", "photo-1579751626657-72bc17010498"),
            ("Especial de jamón", "Muzzarella, jamón y morrones asados.", 15000, "Pizzas", "photo-1571407970349-bc81e7e96d47"),
            ("Papas de la casa", "Papas doradas con sal y especias.", 4500, "Acompañamientos", "photo-1573080496219-bb080dd4f877"),
            ("Aros de cebolla", "Crujientes aros con salsa para acompañar.", 5000, "Acompañamientos", "photo-1639024471283-03518883512d"),
        ]
        archivos = ["clasica", "doble", "veggie", "muzzarella", "napolitana", "especial", "papas", "aros"]
        for (nombre, descripcion, precio, categoria, _foto), archivo in zip(datos, archivos):
            valores = dict(descripcion=descripcion, precio_base=precio,
                           categoria_id=categorias[categoria].id, stock=25,
                           disponible=True, activo=True,
                           imagen_url=f"{settings.FRONTEND_ORIGIN}/images/{archivo}.jpg")
            uow.session.add(Producto(nombre=nombre, **valores))
    print("Seed completo: base vaciada y estado inicial creado; admin / Admin1234!, "
          "3 categorías activas y 8 productos disponibles con stock de 25 unidades.")


if __name__ == "__main__":
    seed()
