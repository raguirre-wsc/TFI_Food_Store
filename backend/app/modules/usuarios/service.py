from app.core.errors import NotFound, DomainError
from .schemas import UserPublic
from .unit_of_work import UsuarioUnitOfWork


class UsuarioNoEncontrado(NotFound):
    pass


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def listar(self):
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.get_all()]

    def cambiar_activo(self, id: int, activo: bool, actor_id: int):
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(id, lock=True)
            if usuario is None:
                raise UsuarioNoEncontrado("Usuario inexistente")
            if id == actor_id and not activo:
                raise DomainError("No puede desactivarse a sí mismo")
            usuario.disabled = not activo
            return UserPublic.model_validate(usuario)
