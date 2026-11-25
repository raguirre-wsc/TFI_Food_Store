# TFI Food Store

**Rodrigo Aguirre · Programación IV · UTN**

Aplicación de pedidos de comida con backend FastAPI + SQLModel, PostgreSQL y frontend React + TypeScript.

## Enlaces de entrega

- Repositorio público de GitHub: [https://github.com/raguirre-wsc/TFI_Food_Store](https://github.com/raguirre-wsc/TFI_Food_Store).
- Video público de demostración de 10 a 15 minutos: **pendiente de grabar e incorporar la URL real**.

Ambos enlaces son obligatorios según la consigna y deben completarse antes de entregar.

## Requisitos

- Python **3.11 a 3.13**.
- Node.js **20.19 o superior** y pnpm **10.34.9**.
- PostgreSQL **15 o superior**. Se incluye `compose.yaml` para iniciar PostgreSQL 16.6 con Docker.
- Docker Desktop en ejecución si se usa Compose.
- Puertos disponibles: **5434** para la base de datos, **8000** para la API y **5173** para el frontend.

Si pnpm no está instalado, reemplazar cada comando `pnpm` por `npx --yes pnpm@10.34.9`.

## Instalación y ejecución del backend

Desde la raíz del proyecto, en PowerShell:

```powershell
docker compose up -d --wait
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Editar `backend/.env` y reemplazar `SECRET_KEY` por una clave propia de al menos 32 caracteres. Se puede generar una desde la carpeta `backend`:

```powershell
.\.venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(48))"
```

La conexión de `.env.example` coincide con la base de `compose.yaml`. Luego, desde `backend`:

```powershell
.\.venv\Scripts\python.exe -m app.db.seed
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

La API queda disponible en **http://localhost:8000**. Documentación interactiva en **http://localhost:8000/docs** y **http://localhost:8000/redoc**. Los endpoints tienen el prefijo `/api/v1`.

El comando `python -m app.db.seed` también puede ejecutarse con el entorno virtual activado. No se ejecuta automáticamente al iniciar la API.

## Instalación y ejecución del frontend

Abrir una segunda terminal desde la raíz del proyecto:

```powershell
cd frontend
Copy-Item .env.example .env
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

Abrir **http://localhost:5173**. `pnpm build` verifica los tipos de TypeScript y genera la compilación de producción.

Usar **localhost** tanto en la URL del navegador como en `VITE_API_URL`. No alternar con `127.0.0.1`, porque la cookie de sesión pertenece a un host. El proceso del backend puede escuchar en 127.0.0.1 y accederse mediante la URL localhost.

Para probar cliente y administrador simultáneamente, usar perfiles separados o una ventana normal y otra privada. Las pestañas del mismo perfil comparten la cookie de sesión.

## Variables de entorno

Copiar ambos archivos `.env.example` a `.env` antes de ejecutar.

| Archivo | Variable | Descripción y valor de ejemplo |
|---|---|---|
| backend/.env | DATABASE_URL | Conexión PostgreSQL: `postgresql://foodstore:foodstore@localhost:5434/foodstore_tfi` |
| backend/.env | SECRET_KEY | Clave para firmar JWT; reemplazar por una propia de al menos 32 caracteres. |
| backend/.env | ALGORITHM | Algoritmo de firma: `HS256`. |
| backend/.env | ACCESS_TOKEN_EXPIRE_MINUTES | Duración del token y la cookie, en minutos: `30`. |
| backend/.env | FRONTEND_ORIGIN | Origen permitido en CORS y usado para las imágenes del seed: `http://localhost:5173`. |
| backend/.env | COOKIE_SECURE | `false` para HTTP local; `true` si se utiliza HTTPS. |
| frontend/.env | VITE_API_URL | Dirección base de la API: `http://localhost:8000/api/v1`. |

Los archivos `.env` reales no forman parte de la entrega. Las credenciales de Compose son para desarrollo local.

## Usuario administrador y datos del seed

- Usuario: **admin**
- Contraseña: **Admin1234!**
- Rol: **admin**

El seed carga tres categorías y ocho productos. Al repetirlo restaura los valores iniciales, incluidos precios, disponibilidad y stock de **25 unidades** por producto de ejemplo, sin duplicar esos registros. También restaura los datos y la contraseña inicial del administrador.

Conserva los pedidos y los registros ajenos al conjunto inicial. Reconoce los registros por username o nombre; si se renombra uno inicial, puede volver a crear el nombre original. No ejecutar el seed entre una compra y su cancelación al demostrar la restitución de stock.

Las imágenes de los productos están incluidas en `frontend/public/images`.

## Alternativa de desarrollo con SQLite

Para ejecutar sin Docker, cambiar `DATABASE_URL` por `sqlite:///./foodstore.db` en `backend/.env`. Después ejecutar el seed y Uvicorn con los mismos comandos. PostgreSQL es la configuración principal del proyecto.

En Linux/macOS, usar `python3`, `.venv/bin/python` y `cp` en lugar de sus equivalentes de Windows. Ejecutar los comandos del backend desde su carpeta para que lea el archivo `.env` correspondiente.
