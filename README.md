# 💰 Finanzas en Pareja

App web de finanzas personales simple, clara y fácil de usar, pensada para usarla en pareja o de forma individual.

## 🚀 Tecnologías

- **Frontend**: React 18 + Vite
- **Estilos**: CSS puro (sin frameworks)
- **Base de datos**: Supabase
- **Hosting**: Netlify Ready
- **Routing**: React Router DOM

## ✨ Funcionalidades

- ✅ Registrar ingresos mensuales de 2 personas
- ✅ Registrar gastos fijos y variables
- ✅ **Copiar automáticamente gastos e ingresos fijos cada mes** 🔄
- ✅ Clasificar gastos por categorías personalizadas
- ✅ Ver resumen mensual (ingresos, gastos, saldo)
- ✅ Marcar gastos como pagados o pendientes
- ✅ Gestionar deudas y cuotas
- ✅ Panel de estadísticas con visualizaciones
- ✅ Datos persistentes en la nube
- ✅ Diseño responsive (mobile & desktop)
- ✅ **3 temas visuales**: Común, Dark Mode, Modo Peñarol 🎨
- ✅ **Exportar PDF** mensual con todos los movimientos 📄
- ✅ **Vista de hogar compartido** para ver finanzas de ambas personas juntas 🏠

### 🔄 Gastos e Ingresos Recurrentes

Cuando cambias de mes en las páginas de Gastos o Ingresos:
- Si el mes anterior tenía gastos/ingresos marcados como **"Fijo"** (ej: alquiler, sueldo)
- Y el mes actual está vacío
- Aparecerá un **banner inteligente** preguntando si querés copiarlos automáticamente
- Con un solo clic, todos los gastos/ingresos fijos se copian al nuevo mes (sin marcar como "pagado")
- Te ahorra tiempo y asegura que no olvides registrar gastos recurrentes

**Nota**: Para usar esta funcionalidad con ingresos, ejecutá la migración `MIGRACION_TIPO_INGRESOS.md`

## 📁 Estructura del Proyecto

```
finanzas-app/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── Layout/      # Layout principal y navegación
│   │   ├── Dashboard/   # Resumen mensual
│   │   ├── Ingresos/    # Formulario y lista de ingresos
│   │   ├── Gastos/      # Formulario y lista de gastos
│   │   ├── Deudas/      # Formulario y lista de deudas
│   │   └── common/      # Componentes reutilizables
│   ├── pages/           # Páginas de la app
│   │   ├── HomePage.jsx
│   │   ├── IngresosPage.jsx
│   │   ├── GastosPage.jsx
│   │   ├── DeudasPage.jsx
│   │   └── EstadisticasPage.jsx
│   ├── services/        # Servicios (Supabase)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilidades y helpers
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── .env.example         # Ejemplo de variables de entorno
├── netlify.toml         # Configuración de Netlify
├── package.json
└── vite.config.js
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### 2.1. Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

#### 2.2. Crear las tablas en Supabase

En el panel de Supabase, ve a `SQL Editor` y ejecuta este código:

```sql
-- Tabla de Ingresos
CREATE TABLE ingresos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  persona TEXT NOT NULL,
  monto NUMERIC NOT NULL,
  descripcion TEXT,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de Gastos
CREATE TABLE gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descripcion TEXT NOT NULL,
  monto NUMERIC NOT NULL,
  categoria TEXT NOT NULL,
  tipo TEXT NOT NULL,
  pagado BOOLEAN DEFAULT FALSE,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de Deudas
CREATE TABLE deudas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descripcion TEXT NOT NULL,
  monto_total NUMERIC NOT NULL,
  monto_pagado NUMERIC DEFAULT 0,
  cuotas_total INTEGER,
  cuotas_pagadas INTEGER DEFAULT 0,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE deudas ENABLE ROW LEVEL SECURITY;

-- Crear políticas para acceso público (para desarrollo)
CREATE POLICY "Permitir todo en ingresos" ON ingresos FOR ALL USING (true);
CREATE POLICY "Permitir todo en gastos" ON gastos FOR ALL USING (true);
CREATE POLICY "Permitir todo en deudas" ON deudas FOR ALL USING (true);
```

#### 2.3. Obtener las credenciales

1. En Supabase, ve a `Settings` → `API`
2. Copia la `URL` y la `anon/public key`

#### 2.4. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` y pega tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 3. Ejecutar localmente

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

## 📦 Compilar para producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

## 🌐 Desplegar en Netlify

### Opción 1: Despliegue manual

1. Ejecuta `npm run build`
2. Ve a [https://app.netlify.com](https://app.netlify.com)
3. Arrastra la carpeta `dist/` al área de despliegue

### Opción 2: Despliegue automático con Git

1. Sube tu proyecto a GitHub
2. En Netlify, haz clic en "Import from Git"
3. Conecta tu repositorio
4. Configura:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Agrega las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Haz clic en "Deploy"

### Opción 3: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login en Netlify
netlify login

# Inicializar
netlify init

# Desplegar
netlify deploy --prod
```

## 🎨 Personalización

### Cambiar colores

Edita las variables CSS en `src/index.css`:

```css
:root {
  --color-primary: #4f46e5;
  --color-secondary: #10b981;
  --color-danger: #ef4444;
  /* ... más colores */
}
```

### Agregar categorías

Edita el array en `src/utils/helpers.js`:

```javascript
export const CATEGORIAS_GASTOS = [
  'Tu Categoría',
  'Otra Categoría',
  // ...
]
```

## 📱 Uso de la App

### Dashboard
- Vista general de ingresos, gastos y saldo del mes
- Selector de mes y año
- Estadísticas rápidas

### Ingresos
- Registra ingresos de Persona 1 o Persona 2
- Agrega descripción (Sueldo, Freelance, etc.)
- Ve totales por persona

### Gastos
- Registra gastos con descripción y monto
- Clasifica por categoría y tipo (Fijo/Variable)
- Marca como pagado o pendiente
- Organizado automáticamente por categorías

### Deudas
- Registra deudas con monto total y cuotas
- Actualiza el progreso haciendo clic en los valores
- Marca como completada automáticamente
- Visualiza porcentaje de pago

### Estadísticas
- Gráficos de barras por categoría
- Distribución por tipo de gasto
- Top 5 gastos del mes
- Resumen general

## 🔒 Seguridad

**Importante**: Las políticas actuales de Supabase permiten acceso público. Para producción, considera:

1. Implementar autenticación de usuarios
2. Modificar las políticas RLS para que cada usuario vea solo sus datos
3. Agregar validación en el backend

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que las variables de entorno estén configuradas
- Revisa la consola del navegador para errores
- Confirma que las tablas existan en Supabase

### Error al desplegar en Netlify
- Asegúrate de agregar las variables de entorno en Netlify
- Verifica que el build command sea `npm run build`
- Confirma que publish directory sea `dist`

## 📄 Licencia

MIT - Libre para usar y modificar

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de mejorar esta app.

---

Hecho con ❤️ para gestionar finanzas en pareja
