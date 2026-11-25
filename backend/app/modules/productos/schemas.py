from typing import Annotated
from pydantic import StringConstraints, field_validator, model_validator, TypeAdapter, HttpUrl, Field
from sqlmodel import SQLModel
from app.modules.categorias.schemas import CategoriaRead

NombreProducto = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)]
Precio = Annotated[float, Field(ge=0, allow_inf_nan=False)]
Stock = Annotated[int, Field(ge=0, strict=True)]


class ProductoCreate(SQLModel):
    nombre: NombreProducto
    descripcion: str | None = None
    precio_base: Precio
    imagen_url: str | None = None
    stock: Stock = 0
    disponible: bool = True
    categoria_id: int = Field(gt=0)

    @field_validator("imagen_url")
    @classmethod
    def valid_url(cls, value):
        if value is not None:
            TypeAdapter(HttpUrl).validate_python(value)
        return value


class ProductoUpdate(SQLModel):
    nombre: NombreProducto | None = None
    descripcion: str | None = None
    precio_base: Precio | None = None
    imagen_url: str | None = None
    stock: Stock | None = None
    disponible: bool | None = None
    categoria_id: int | None = Field(default=None, gt=0)

    _valid_url = field_validator("imagen_url")(ProductoCreate.valid_url.__func__)

    @model_validator(mode="after")
    def no_null_required(self):
        for name in ("nombre", "precio_base", "stock", "disponible", "categoria_id"):
            if name in self.model_fields_set and getattr(self, name) is None:
                raise ValueError(f"{name} no admite null")
        return self


class ProductoStockUpdate(SQLModel):
    stock: Stock | None = None
    disponible: bool | None = None

    @model_validator(mode="after")
    def valid_patch(self):
        if not self.model_fields_set or any(getattr(self, key) is None for key in self.model_fields_set):
            raise ValueError("Enviar stock y/o disponible con valores no nulos")
        return self


class ProductoRead(ProductoCreate):
    id: int
    activo: bool
    categoria: CategoriaRead


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
