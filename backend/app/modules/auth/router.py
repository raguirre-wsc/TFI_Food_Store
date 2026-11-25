from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.deps import get_current_active_user
from app.core.errors import http_result
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from .service import AuthService
from .schemas import UserCreate

router = APIRouter(prefix="/auth", tags=["Autenticación"])


def get_auth_service():
    return AuthService(UsuarioUnitOfWork())


@router.post("/register", response_model=UserPublic, status_code=201)
def register(data: UserCreate, service=Depends(get_auth_service)):
    return http_result(lambda: service.registrar(data))


@router.post("/token")
def login(response: Response, form: OAuth2PasswordRequestForm = Depends(), service=Depends(get_auth_service)):
    token = http_result(lambda: service.autenticar(form.username, form.password))
    response.set_cookie("access_token", token, httponly=True, secure=settings.COOKIE_SECURE,
                        samesite="lax", path="/", max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return {"message": "Login exitoso"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/", httponly=True,
                           secure=settings.COOKIE_SECURE, samesite="lax")
    return {"message": "Sesión cerrada"}


@router.get("/me", response_model=UserPublic)
def me(user: UserPublic = Depends(get_current_active_user)):
    return user
