from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import select
from app.core.base_repository import BaseRepository
from .models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session):
        super().__init__(session, Producto)

    def search(self, skip=0, limit=20, search=None, categoria_id=None, disponible=None):
        filters = [Producto.activo == True]
        if search:
            filters.append(Producto.nombre.icontains(search, autoescape=True))
        if categoria_id is not None:
            filters.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            filters.append(Producto.disponible == disponible)
        total = self.session.exec(select(func.count()).select_from(Producto).where(*filters)).one()
        items = self.session.exec(select(Producto).options(selectinload(Producto.categoria)).where(*filters)
                                  .order_by(Producto.id).offset(skip).limit(limit)).all()
        return total, items
