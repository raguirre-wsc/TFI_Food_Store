from app.core.database import session_factory
from sqlalchemy import text


class UnitOfWork:
    def __init__(self, factory=session_factory):
        self.factory = factory

    def __enter__(self):
        self.session = self.factory()
        # SQLite no implementa FOR UPDATE. En desarrollo se serializan las UoW
        # desde el inicio para conservar la atomicidad ante compras concurrentes.
        if self.session.get_bind().dialect.name == "sqlite":
            self.session.execute(text("BEGIN IMMEDIATE"))
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        try:
            if exc_type is not None:
                self.session.rollback()
            else:
                try:
                    self.session.commit()
                except Exception:
                    self.session.rollback()
                    raise
        finally:
            self.session.close()
        return False
