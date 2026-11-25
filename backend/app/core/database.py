from sqlalchemy import event
from sqlmodel import Session, SQLModel, create_engine
from .config import settings

is_sqlite = settings.DATABASE_URL.startswith("sqlite")
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30} if is_sqlite else {},
    pool_pre_ping=True,
)

if is_sqlite:
    @event.listens_for(engine, "connect")
    def sqlite_foreign_keys(connection, _):
        connection.execute("PRAGMA foreign_keys=ON")


def create_all_tables():
    # Registrar todas las tablas y relaciones antes de crear el esquema.
    from app.modules.usuarios.models import Usuario  # noqa: F401
    from app.modules.categorias.models import Categoria  # noqa: F401
    from app.modules.productos.models import Producto  # noqa: F401
    from app.modules.pedidos.models import Pedido, DetallePedido  # noqa: F401
    SQLModel.metadata.create_all(engine)


def session_factory():
    return Session(engine, expire_on_commit=False)
