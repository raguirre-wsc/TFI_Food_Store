from fastapi import APIRouter, Depends, Query, Response
from app.core.deps import require_role
from app.core.errors import http_result
from .schemas import ProductoCreate, ProductoUpdate, ProductoStockUpdate, ProductoRead, ProductosPaginados
from .service import ProductoService
from .unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["Productos"])
admin = Depends(require_role(["admin"]))


def get_producto_service():
    return ProductoService(ProductoUnitOfWork())


@router.get("", response_model=ProductosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100),
           search: str | None = None, categoria_id: int | None = Query(None, gt=0),
           disponible: bool | None = None, service=Depends(get_producto_service)):
    return http_result(lambda: service.listar(skip=skip, limit=limit, search=search,
                        categoria_id=categoria_id, disponible=disponible))


@router.get("/{id}", response_model=ProductoRead)
def obtener(id: int, service=Depends(get_producto_service)):
    return http_result(lambda: service.obtener(id))


@router.post("", response_model=ProductoRead, status_code=201, dependencies=[admin])
def crear(data: ProductoCreate, service=Depends(get_producto_service)):
    return http_result(lambda: service.crear(data))


@router.put("/{id}", response_model=ProductoRead, dependencies=[admin])
def actualizar(id: int, data: ProductoUpdate, service=Depends(get_producto_service)):
    return http_result(lambda: service.actualizar(id, data))


@router.patch("/{id}/stock", response_model=ProductoRead, dependencies=[admin])
def stock(id: int, data: ProductoStockUpdate, service=Depends(get_producto_service)):
    return http_result(lambda: service.actualizar(id, data))


@router.delete("/{id}", status_code=204, dependencies=[admin])
def eliminar(id: int, service=Depends(get_producto_service)):
    http_result(lambda: service.eliminar(id))
    return Response(status_code=204)
