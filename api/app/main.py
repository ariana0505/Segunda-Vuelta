from fastapi import FastAPI

from app.auth import router

app = FastAPI(title="Segunda Vuelta API")
app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
