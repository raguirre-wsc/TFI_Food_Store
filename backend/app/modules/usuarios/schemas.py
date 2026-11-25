from datetime import datetime
from typing import Literal
from pydantic import EmailStr
from sqlmodel import SQLModel


class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: EmailStr
    role: Literal["user", "admin"]
    disabled: bool
    created_at: datetime
