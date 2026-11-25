from fastapi import Cookie, Depends, HTTPException
from .security import decode_access_token
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


def get_current_user(access_token: str | None = Cookie(default=None)) -> UserPublic:
    username = decode_access_token(access_token) if access_token else None
    if username is None:
        raise HTTPException(401, "Sesión inválida o vencida")
    with UsuarioUnitOfWork() as uow:
        user = uow.usuarios.get_by_username(username)
        if user is None:
            raise HTTPException(401, "Sesión inválida o vencida")
        return UserPublic.model_validate(user)


def get_current_active_user(user: UserPublic = Depends(get_current_user)) -> UserPublic:
    if user.disabled:
        raise HTTPException(400, "Cuenta de usuario desactivada")
    return user


def require_role(roles: list[str]):
    def dependency(user: UserPublic = Depends(get_current_active_user)):
        if user.role not in roles:
            raise HTTPException(403, "No tiene permisos para realizar esta acción")
        return user
    return dependency
