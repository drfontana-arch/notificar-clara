# NotificAR Clara

Sistema de traducción automática de notificaciones judiciales a lenguaje claro, mediante inteligencia artificial y asistente virtual de video.

## ¿Qué hace?

Permite que cualquier ciudadano/a que recibe una notificación judicial en la Provincia de Buenos Aires pueda escanear un código QR e inmediatamente obtener:

- Una explicación en lenguaje claro de qué le está comunicando la justicia
- Las acciones concretas que debe tomar y los plazos
- Respuestas a preguntas frecuentes
- Contacto directo por WhatsApp con el órgano emisor o su abogado/a

## Stack técnico

- **Framework**: Next.js 14 (App Router)
- **IA**: Anthropic Claude (Haiku) via API
- **Base de datos**: Supabase (PostgreSQL)
- **QR**: librería `qrcode`
- **Deploy**: Vercel (frontend + API routes)

## Instalación local

1. Clonar el repositorio
2. Copiar `.env.local.example` a `.env.local` y completar las claves
3. Instalar dependencias: `npm install`
4. Ejecutar en desarrollo: `npm run dev`
5. Abrir `http://localhost:3000`

## Variables de entorno necesarias

Ver `.env.local.example`

## Estructura del proyecto

```
src/
  app/
    page.jsx              → Panel del operador judicial
    n/[id]/page.jsx       → Página ciudadana (lo que ve al escanear el QR)
    api/
      procesar/route.js   → Procesa notificación con IA y genera QR
      notificacion/route.js → Consulta datos y responde preguntas libres
  lib/
    anthropic.js          → Cliente y funciones de IA
    supabase.js           → Cliente de base de datos
    prompts/index.js      → Prompts especializados por tipo de acto procesal
```

## Base de datos (Supabase)

Crear la siguiente tabla en Supabase:

```sql
create table notificaciones (
  id uuid primary key,
  texto_original text not null,
  tipo_acto text not null,
  datos_procesados jsonb not null,
  creado_en timestamptz default now()
);
```

---

Proyecto de acceso a la justicia — Congreso de Habla Hispana, La Plata, octubre 2026.
