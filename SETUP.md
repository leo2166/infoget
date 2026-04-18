# INFOGET — Guía de Configuración y Despliegue

Sistema de registro de pacientes construido con Next.js 16, PostgreSQL (Prisma) y NextAuth.js.

---

## Requisitos previos

- Node.js 18+
- Base de Datos PostgreSQL
- Cuenta Google (para Google Cloud Console - Auth)
- Cuenta Vercel (para el despliegue)

---

## 1. Configurar Google Cloud Console (Para Login del Admin)

### 1.1 Crear proyecto y habilitar credenciales OAuth

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuevo proyecto (ej. `infoget-app`)
3. En el menú lateral: **APIs y Servicios → Credenciales → Crear credenciales → ID de cliente OAuth 2.0**
4. Tipo: **Aplicación web**
5. Origen autorizado: `http://localhost:3000` (desarrollo) y tu URL de Vercel (producción)
6. URI de redireccionamiento:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://tu-app.vercel.app/api/auth/callback/google`
7. Copia el **Client ID** y **Client Secret**

---

## 2. Configurar la Base de Datos

1. Asegúrate de tener una instancia de PostgreSQL lista.
2. La URL de conexión debe seguir el formato: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

---

## 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz (o completa el `.env.local`):

```env
# Base de Datos (Prisma)
DATABASE_URL="postgresql://usuario:password@localhost:5432/infoget_db"

# NextAuth (OAuth Google para admin)
NEXTAUTH_SECRET=genera-con-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123

# Email del administrador autorizado
ADMIN_EMAIL=tu-correo@gmail.com
```

Para generar `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## 4. Instalación local

```bash
# Clonar/entrar al directorio
cd C:\Users\Lucidio\Proyectos\Infoget

# Instalar dependencias
npm install

# Generar cliente de Prisma y ejecutar migraciones (si es necesario)
npx prisma generate
npx prisma db push

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 5. Estructura de rutas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/registro` | Formulario de registro de pacientes | Público |
| `/admin/login` | Página de inicio de sesión | Público |
| `/admin` | Panel de gestión | Solo admin autenticado |
| `/api/registro` | POST: guardar nuevo registro | Público |
| `/api/pacientes` | GET/PUT/DELETE: gestión | Solo admin |
| `/api/auth/[...]` | Handler NextAuth | Automático |

---

## 6. Despliegue en Vercel

1. Instala Vercel CLI: `npm i -g vercel`
2. En el directorio del proyecto: `vercel`
3. Configura las variables de entorno en **Vercel Dashboard → Settings → Environment Variables**:
   - Agrega todas las variables del `.env`
4. Actualiza las URIs autorizadas en Google Cloud Console con la URL de Vercel
5. Cambia `NEXTAUTH_URL` en Vercel a tu URL de producción

---

## 7. Solución de problemas

### Login admin no funciona
- Verifica que `ADMIN_EMAIL` sea exactamente el mismo correo con el que inicias sesión en Google
- Revisa que las URIs de redireccionamiento en Google Console incluyan `/api/auth/callback/google`
- Asegúrate de que `NEXTAUTH_SECRET` esté correctamente configurado en producción.

### Error de Base de Datos
- Verifica que `DATABASE_URL` sea accesible desde tu entorno de ejecución.
- Ejecuta `npx prisma generate` después de instalar dependencias.
