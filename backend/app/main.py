from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import create_all_tables
from app.modules.auth.router import router as auth
from app.modules.usuarios.router import router as usuarios
from app.modules.categorias.router import router as categorias
from app.modules.productos.router import router as productos
from app.modules.pedidos.router import router as pedidos


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all_tables()
    yield


app = FastAPI(title="Food Store", version="1.0.0", lifespan=lifespan,
    description="Sistema de pedidos de comida. Autenticación mediante cookie HttpOnly access_token.")
app.add_middleware(CORSMiddleware, allow_origins=[settings.FRONTEND_ORIGIN],
                   allow_credentials=True, allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
                   allow_headers=["Content-Type", "Accept"])
for router in (auth, usuarios, categorias, productos, pedidos):
    app.include_router(router, prefix="/api/v1")
