from app.db.base_class import Base  # noqa: F401
from app.models.refresh_token import RefreshToken  # noqa: F401

# TODO: check if this is rly required since i dont like warning ignore
# импортируем модели, чтобы они зарегистрировались в Base.metadata
from app.models.user import User  # noqa: F401

__all__ = ["Base"]
