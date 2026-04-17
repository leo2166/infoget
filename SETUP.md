# INFOGET — Guía de Configuración y Despliegue

Sistema de registro de pacientes construido con Next.js 14, Google Sheets API y NextAuth.js.

---

## Requisitos previos

- Node.js 18+
- Cuenta Google (para Google Cloud Console)
- Cuenta Vercel (para el despliegue)

---

## 1. Configurar Google Cloud Console

### 1.1 Crear proyecto y habilitar APIs

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuevo proyecto (ej. `infoget-app`)
3. En el menú lateral: **APIs y Servicios → Biblioteca**
4. Busca y habilita:
   - **Google Sheets API**
   - **Google Drive API** (necesaria para permisos)

### 1.2 Crear Service Account (para leer/escribir en Sheets)

1. **APIs y Servicios → Credenciales → Crear credenciales → Cuenta de servicio**
2. Nombre: `infoget-sheets-sa`
3. Haz clic en la cuenta creada → pestaña **Claves** → **Agregar clave → JSON**
4. Se descargará un archivo `.json` con este contenido:

```json
{
  "client_email": "infoget-sheets-sa@tu-proyecto.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

### 1.3 Crear credenciales OAuth (para el login del admin)

1. **APIs y Servicios → Credenciales → Crear credenciales → ID de cliente OAuth 2.0**
2. Tipo: **Aplicación web**
3. Origen autorizado: `http://localhost:3000` (desarrollo) y tu URL de Vercel (producción)
4. URI de redireccionamiento:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://tu-app.vercel.app/api/auth/callback/google`
5. Copia el **Client ID** y **Client Secret**

---

## 2. Configurar Google Sheets

1. Crea una nueva hoja de cálculo en Google Sheets
2. Cópiala la URL: `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`
3. Extrae el `GOOGLE_SHEETS_ID` de la URL
4. Renombra la primera pestaña (hoja) como: **Pacientes**
5. En la fila 1, añade estos encabezados exactamente:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Cédula | Nombre | Fecha Nacimiento | Edad | Teléfono | Email | Dirección | Especialidad | Cirugía Pendiente | Diagnóstico | Observaciones | Fecha Registro |

6. **Compartir la hoja** con el email del Service Account (del paso 1.2) con rol **Editor**

---

## 3. Configurar variables de entorno

Copia y completa el archivo `.env.local`:

```env
# Google Sheets (Service Account)
GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
GOOGLE_SERVICE_ACCOUNT_EMAIL=infoget-sheets-sa@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"

# NextAuth (OAuth Google para admin)
NEXTAUTH_SECRET=genera-con-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123

# Email del administrador autorizado
ADMIN_EMAIL=tu-correo@gmail.com
```

> **Importante sobre `GOOGLE_PRIVATE_KEY`**: Los saltos de línea `\n` deben estar dentro de comillas dobles. En Vercel, pegar la clave tal cual del archivo JSON descargado.

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
   - Agrega todas las variables del `.env.local`
   - Para `GOOGLE_PRIVATE_KEY`, pega el contenido incluyendo `-----BEGIN PRIVATE KEY-----`
4. Actualiza las URIs autorizadas en Google Cloud Console con la URL de Vercel
5. Cambia `NEXTAUTH_URL` en Vercel a tu URL de producción

---

## 7. Solución de problemas

### Error: "Faltan credenciales de Google Service Account"
- Verifica que `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY` estén configuradas
- Asegúrate de que los `\n` estén presentes en la clave privada

### Error: "No se encontró la pestaña Pacientes"
- La hoja de cálculo debe tener una pestaña llamada exactamente **Pacientes** (con mayúscula)

### Error 403 en Google Sheets API
- El Service Account no tiene acceso a la hoja. Comparte la hoja con el email del SA como Editor.

### Login admin no funciona
- Verifica que `ADMIN_EMAIL` sea exactamente el mismo correo con el que inicias sesión en Google
- Revisa que las URIs de redireccionamiento en Google Console incluyan `/api/auth/callback/google`
