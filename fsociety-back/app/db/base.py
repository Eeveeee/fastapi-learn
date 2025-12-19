from sqlalchemy.orm import DeclarativeBase


# Base class for ORM models.
# All your tables (models) should inherit from Base.
class Base(DeclarativeBase):
    pass
