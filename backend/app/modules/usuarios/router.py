from fastapi import APIRouter, Depends
from app.core.deps import require_role
from app.core.errors import http_result
from .schemas import UserPublic
from .service import UsuarioService
from .unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios"])


def get_usuario_service():
    return UsuarioService(UsuarioUnitOfWork())


@router.get("", response_model=list[UserPublic])
def listar(actor=Depends(require_role(["admin"])), service=Depends(get_usuario_service)):
    return http_result(service.listar)


@router.post("/{id}/activar", response_model=UserPublic)
def activar(id: int, actor=Depends(require_role(["admin"])), service=Depends(get_usuario_service)):
    return http_result(lambda: service.cambiar_activo(id, True, actor.id))


@router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar(id: int, actor=Depends(require_role(["admin"])), service=Depends(get_usuario_service)):
    return http_result(lambda: service.cambiar_activo(id, False, actor.id))
