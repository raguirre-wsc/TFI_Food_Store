from datetime import datetime, timedelta, timezone
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import select
from app.core.base_repository import BaseRepository
from .models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session):
        super().__init__(session, Pedido)

    def list_by_usuario(self, usuario_id=None, skip=0, limit=20, estado=None):
        filters = []
        if usuario_id is not None:
            filters.append(Pedido.usuario_id == usuario_id)
        if estado is not None:
            filters.append(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(Pedido).where(*filters)).one()
        items = self.session.exec(select(Pedido).options(selectinload(Pedido.items)).where(*filters)
                                  .order_by(Pedido.id.desc()).offset(skip).limit(limit)).all()
        return total, items

    def count_by_estado(self):
        return dict(self.session.exec(select(Pedido.estado, func.count()).group_by(Pedido.estado)).all())

    def count_today(self):
        # Se usa el día UTC en todos los motores y se documenta esta decisión.
        start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        return self.session.exec(select(func.count()).select_from(Pedido).where(
            Pedido.created_at >= start, Pedido.created_at < start + timedelta(days=1))).one()

    def delivered_income(self):
        return self.session.exec(select(func.coalesce(func.sum(Pedido.total), 0.0)).where(
            Pedido.estado == "ENTREGADO")).one()
