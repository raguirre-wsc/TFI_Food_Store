from typing import Annotated
from pydantic import EmailStr, StringConstraints, field_validator
from sqlmodel import SQLModel, Field


class UserCreate(SQLModel):
    username: Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_.-]+$")]
    full_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)]
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def bcrypt_limit(cls, value):
        if len(value.encode("utf-8")) > 72:
            raise ValueError("La contraseña no debe exceder 72 bytes UTF-8")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value):
        return str(value).lower()
