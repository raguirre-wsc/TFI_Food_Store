from app.core.errors import NotFound, Conflict
from .models import Categoria
from .schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead
from .unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(NotFound):
    pass


class NombreDuplicado(Conflict):
    pass


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def _obtener(self, uow, id: int, lock=False):
        categoria = uow.categorias.get_by_id(id, lock=lock)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada("Categoría inexistente")
        return categoria

    def listar(self):
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.list_active()]

    def obtener(self, id: int):
        with self.uow as uow:
            return CategoriaRead.model_validate(self._obtener(uow, id))

    def crear(self, data: CategoriaCreate):
        with self.uow as uow:
            if uow.categorias.get_by_nombre(data.nombre):
                raise NombreDuplicado("Ya existe una categoría con ese nombre")
            categoria = uow.categorias.add(Categoria(**data.model_dump()))
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, id: int, data: CategoriaUpdate):
        with self.uow as uow:
            categoria = self._obtener(uow, id, lock=True)
            if data.nombre is not None:
                duplicada = uow.categorias.get_by_nombre(data.nombre)
                if duplicada is not None and duplicada.id != id:
                    raise NombreDuplicado("Ya existe una categoría con ese nombre")
            categoria.sqlmodel_update(data.model_dump(exclude_unset=True))
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, id: int):
        with self.uow as uow:
            self._obtener(uow, id, lock=True).activo = False
