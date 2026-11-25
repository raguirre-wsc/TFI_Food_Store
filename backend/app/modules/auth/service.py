from fastapi import HTTPException
from app.core.errors import Conflict
from app.core.security import get_password_hash, verify_password, create_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from .schemas import UserCreate


class UsuarioDuplicado(Conflict):
    pass


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def registrar(self, data: UserCreate):
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username) or uow.usuarios.get_by_email(str(data.email)):
                raise UsuarioDuplicado("El usuario o el email ya está registrado")
            user = uow.usuarios.add(Usuario(**data.model_dump(exclude={"password"}),
                hashed_password=get_password_hash(data.password), role="user"))
            return UserPublic.model_validate(user)

    def autenticar(self, username: str, password: str):
        with self.uow as uow:
            user = uow.usuarios.get_by_username(username)
            # bcrypt recibe hasta 72 bytes; nunca truncar silenciosamente.
            if user is None or len(password.encode("utf-8")) > 72 or not verify_password(password, user.hashed_password):
                raise HTTPException(401, "Usuario o contraseña incorrectos")
            if user.disabled:
                raise HTTPException(400, "Cuenta de usuario desactivada")
            return create_access_token(user.username)
