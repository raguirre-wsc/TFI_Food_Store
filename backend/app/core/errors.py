from collections.abc import Callable
from typing import TypeVar
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError


class DomainError(Exception):
    status_code = 400


class NotFound(DomainError):
    status_code = 404


class Conflict(DomainError):
    status_code = 409


class Forbidden(DomainError):
    status_code = 403


R = TypeVar("R")


def http_result(operation: Callable[[], R]) -> R:
    """Traducción en la capa HTTP; los servicios desconocen FastAPI."""
    try:
        return operation()
    except DomainError as error:
        raise HTTPException(error.status_code, str(error)) from error
    except IntegrityError as error:
        # La restricción única protege también dos altas concurrentes.
        raise HTTPException(409, "Conflicto de integridad o registro duplicado") from error
