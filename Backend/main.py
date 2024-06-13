import logging
from database import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Base
from routers import admin, auth, transactions, users

app = FastAPI()

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

origins = ["localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/api/health")
async def health_check():
    return {"message": "Backend connected!"}


app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(admin.router)
app.include_router(users.router)
