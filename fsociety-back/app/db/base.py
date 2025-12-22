from app.db.base_class import Base

# импортируем модели, чтобы они зарегистрировались в Base.metadata
from app.models.user import User  # noqa: F401

__all__ = ["Base"]
