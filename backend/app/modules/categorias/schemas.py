from typing import Annotated
from pydantic import StringConstraints, model_validator
from sqlmodel import SQLModel

NombreCategoria = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)]


class CategoriaCreate(SQLModel):
    nombre: NombreCategoria
    descripcion: str | None = None


class CategoriaUpdate(SQLModel):
    nombre: NombreCategoria | None = None
    descripcion: str | None = None

    @model_validator(mode="after")
    def no_null_name(self):
        if "nombre" in self.model_fields_set and self.nombre is None:
            raise ValueError("nombre no admite null")
        return self


class CategoriaRead(CategoriaCreate):
    id: int
    activo: bool
