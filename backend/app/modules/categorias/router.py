from fastapi import APIRouter, Depends, Response
from app.core.deps import require_role
from app.core.errors import http_result
from .schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead
from .service import CategoriaService
from .unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["Categorías"])
admin = Depends(require_role(["admin"]))


def get_categoria_service():
    return CategoriaService(CategoriaUnitOfWork())


@router.get("", response_model=list[CategoriaRead])
def listar(service=Depends(get_categoria_service)):
    return http_result(service.listar)


@router.get("/{id}", response_model=CategoriaRead)
def obtener(id: int, service=Depends(get_categoria_service)):
    return http_result(lambda: service.obtener(id))


@router.post("", response_model=CategoriaRead, status_code=201, dependencies=[admin])
def crear(data: CategoriaCreate, service=Depends(get_categoria_service)):
    return http_result(lambda: service.crear(data))


@router.put("/{id}", response_model=CategoriaRead, dependencies=[admin])
def actualizar(id: int, data: CategoriaUpdate, service=Depends(get_categoria_service)):
    return http_result(lambda: service.actualizar(id, data))


@router.delete("/{id}", status_code=204, dependencies=[admin])
def eliminar(id: int, service=Depends(get_categoria_service)):
    http_result(lambda: service.eliminar(id))
    return Response(status_code=204)
