from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from utils.jwt_utils import create_access_token, decode_access_token
import jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


fake_users_db = {}


@router.post("/signup")
async def signup(data: SignupRequest):
    if data.email in fake_users_db:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    fake_users_db[data.email] = {"password": data.password}
    return {"message": "Usuario creado", "email": data.email}


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    user = fake_users_db.get(data.email)
    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = create_access_token({"sub": data.email})
    return TokenResponse(access_token=token)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_access_token(token)
        email: str | None = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = fake_users_db.get(email)
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return {"email": email}


@router.get("/verify-token")
async def read_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}