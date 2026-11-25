from fastapi import APIRouter, Depends, Query
from app.core.deps import get_current_active_user, require_role
from app.core.errors import http_result
from .schemas import PedidoCreate, PedidoRead, PedidosPaginados, CambioEstado, ResumenPedidos, EstadoPedido
from .service import PedidoService
from .unit_of_work import PedidoUnitOfWork

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service():
    return PedidoService(PedidoUnitOfWork())


@router.post("", response_model=PedidoRead, status_code=201)
def crear(data: PedidoCreate, actor=Depends(get_current_active_user), service=Depends(get_pedido_service)):
    return http_result(lambda: service.crear(data, actor))


@router.get("", response_model=PedidosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100),
           estado: EstadoPedido | None = None, actor=Depends(get_current_active_user), service=Depends(get_pedido_service)):
    return http_result(lambda: service.listar(actor, skip=skip, limit=limit, estado=estado))


@router.get("/resumen", response_model=ResumenPedidos)
def resumen(actor=Depends(require_role(["admin"])), service=Depends(get_pedido_service)):
    return http_result(service.resumen)


@router.get("/{id}", response_model=PedidoRead)
def obtener(id: int, actor=Depends(get_current_active_user), service=Depends(get_pedido_service)):
    return http_result(lambda: service.obtener(id, actor))


@router.patch("/{id}/estado", response_model=PedidoRead)
def cambiar_estado(id: int, data: CambioEstado, actor=Depends(require_role(["admin"])), service=Depends(get_pedido_service)):
    return http_result(lambda: service.cambiar_estado(id, data.estado))


@router.patch("/{id}/cancelar", response_model=PedidoRead)
def cancelar(id: int, actor=Depends(get_current_active_user), service=Depends(get_pedido_service)):
    return http_result(lambda: service.cancelar(id, actor))
