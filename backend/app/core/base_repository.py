from typing import Generic, TypeVar
from sqlmodel import SQLModel, Session, select

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: type[T]):
        self.session, self.model = session, model

    def get_by_id(self, id: int, *, lock: bool = False) -> T | None:
        query = select(self.model).where(self.model.id == id)
        if lock:
            query = query.with_for_update().execution_options(populate_existing=True)
        return self.session.exec(query).first()

    def get_all(self) -> list[T]:
        return list(self.session.exec(select(self.model).order_by(self.model.id)).all())

    def add(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()  # Genera IDs, sin confirmar la transacción.
        return entity

    def delete(self, entity: T) -> None:
        self.session.delete(entity)
