from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    port: int = 4000
    node_env: str = "development"
    cors_origin: str = "http://localhost:3000"
    use_mock_db: bool = True
    firebase_project_id: str | None = None
    google_application_credentials: str | None = None

    @property
    def is_production(self) -> bool:
        return self.node_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
