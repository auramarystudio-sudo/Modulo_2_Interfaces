# 🚀 AI Local Manager - Módulo 2

Gestor completo de herramientas de IA locales con estilo **Glassmorphism Dark Pro v3.0**

## 📋 Descripción

Aplicación web para gestionar interfaces de generación de imágenes y servidores de IA en red local. Incluye tres módulos principales:

1. **Interfaces UI** - Gestiona AUTOMATIC1111, ComfyUI, Forge, Fooocus, SD.Next
2. **Servidores de Red** - Gestiona Ollama, SillyTavern, KoboldCpp, Text-Generation-WebUI
3. **Sesiones** - Guarda combinaciones de servicios para activar con un clic

## ✨ Funcionalidades Implementadas (13/13)

### 🎯 Alto Impacto
- ✅ **Health Check en tiempo real** - Indicadores verde/rojo con latencia (auto-refresh cada 30s)
- ✅ **QR Code para acceso móvil** - Genera QR para escanear con el teléfono
- ✅ **Sesiones/Presets** - Guarda y activa combinaciones de servicios
- ✅ **Integración Ollama API** - Consulta modelos disponibles en vivo (`GET /api/tags`)

### 🎨 UX/UI
- ✅ **Vista Lista vs Grid** - Toggle para cambiar entre vistas
- ✅ **Búsqueda y filtros** - Por nombre, estado, tipo, favoritos
- ✅ **Drag & Drop** - Reordena tarjetas arrastrando
- ✅ **Favoritos ⭐** - Marca elementos prioritarios (aparecen primero)

### 🛠️ Automatización
- ✅ **Copiar Comando** - Botón para copiar comandos de lanzamiento al portapapeles
- ✅ **Importar/Exportar JSON** - Backup y portabilidad de configuración
- ✅ **Templates predefinidos** - Creación rápida con plantillas (A1111, Ollama, etc.)

### 📊 Analítica
- ✅ **Dashboard de uso** - Contador de "veces usado" + "última vez"
- ✅ **Widget de estado global** - Resumen en Home con barras de progreso

## 🎨 Estilo: Glassmorphism Dark Pro v3.0

### Características
- **Glassmorphism:** `backdrop-blur-sm` + `bg-slate-900/50` + bordes semi-transparentes
- **Gradientes:** `from-cyan-500 to-purple-600` en iconos y botones premium
- **Bordes con opacidad:** `border-slate-800/50` (no sólidos)
- **Sombras profundas:** `shadow-xl` en cards, `shadow-2xl` en modales
- **Tipografía jerárquica:** Títulos `text-xl font-bold`, labels `text-xs font-medium`
- **Transiciones suaves:** `transition` en todos los elementos interactivos

### Paleta de Colores
- **Primarios:** Cyan (#06b6d4), Purple (#a855f7), Pink (#ec4899)
- **Secundarios:** Green, Yellow, Blue, Red, Amber, Indigo, Rose, Lime, Teal, Violet
- **Neutros:** Slate-950 a Slate-100

## 🗄️ Esquemas de PocketBase

### Colección: `interfaces_ui`
```json
{
  "nombre": "text (required)",
  "tipo": "select [automatic1111, comfyui, forge, fooocus, sdnext, otra] (required)",
  "url_local": "url (required)",
  "puerto": "number (required)",
  "comando_lanzamiento": "text",
  "descripcion": "text",
  "estado": "select [activo, inactivo, mantenimiento]",
  "favorito": "bool",
  "veces_usado": "number",
  "ultimo_uso": "date"
}
```

### Colección: `servidores_red`
```json
{
  "nombre": "text (required)",
  "tipo_servidor": "select [chatbox_ui, api_backend, sd_server] (required)",
  "ip_red": "text (required)",
  "puerto": "number (required)",
  "url_acceso": "url (required)",
  "descripcion": "text",
  "modelos_disponibles": "text",
  "estado": "select [activo, inactivo]",
  "favorito": "bool",
  "veces_usado": "number",
  "ultimo_uso": "date"
}
```

### Colección: `sesiones`
```json
{
  "nombre": "text (required)",
  "descripcion": "text",
  "interfaces_ids": "text (JSON array)",
  "servidores_ids": "text (JSON array)"
}
```

**📦 Archivo de importación:** `public/pocketbase-schema.json`

## 🚀 Instalación y Uso

### 1. Configurar PocketBase
```bash
# Descargar PocketBase desde https://pocketbase.io
./pocketbase serve
```

### 2. Importar esquemas
- Ir a: `http://127.0.0.1:8090/_/`
- Settings → Collections → Import collections
- Subir: `public/pocketbase-schema.json`

### 3. Configurar URL (opcional)
Crear archivo `.env` en la raíz:
```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

### 6. Build para producción
```bash
npm run build
```

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── common/
│   │   ├── CommonComponents.jsx      # HealthIndicator, QRModal, SearchBar, ViewToggle, StarButton, LastUsed
│   │   ├── TemplateSelector.jsx      # Templates predefinidos
│   │   └── ImportExport.jsx          # Importar/Exportar JSON
│   ├── interfaces/
│   │   ├── InterfacesManager.jsx     # Gestor con búsqueda, filtros, drag&drop
│   │   ├── InterfaceCard.jsx         # Tarjeta con health, QR, favoritos
│   │   └── InterfaceForm.jsx         # Formulario modal
│   ├── servidores/
│   │   ├── ServidoresManager.jsx     # Gestor con búsqueda, filtros, drag&drop
│   │   ├── ServerCard.jsx            # Tarjeta con Ollama API, health, QR
│   │   └── ServerForm.jsx            # Formulario modal
│   ├── sesiones/
│   │   └── SessionManager.jsx        # Gestor de sesiones/presets
│   └── Layout.jsx                    # Layout con navegación
├── pages/
│   ├── Home.jsx                      # Dashboard con widget de estado global
│   ├── Interfaces.jsx                # Página de interfaces
│   ├── Servidores.jsx                # Página de servidores
│   └── Sesiones.jsx                  # Página de sesiones
├── lib/
│   └── pocketbase.js                 # Configuración PocketBase
├── App.tsx                           # Router principal
└── main.tsx                          # Entry point
```

## 🎯 Funcionalidades Detalladas

### Health Check en Tiempo Real
- **Componente:** `HealthIndicator`
- **Frecuencia:** Cada 30 segundos
- **Indicadores:**
  - 🟢 Verde pulsante = En línea (muestra latencia en ms)
  - 🔴 Rojo = Desconectado
  - 🟡 Amarillo pulsante = Verificando

### QR Code Móvil
- **Librería:** `qrcode.react`
- **Uso:** Botón "📱 QR" en cada tarjeta
- **Modal:** Muestra QR + URL + botón copiar
- **Tamaño:** 200x200px, nivel de corrección M

### Integración Ollama API
- **Endpoint:** `GET /api/tags`
- **Detección automática:** Por nombre, puerto 11434, o URL
- **Fallback:** Si falla, usa modelos estáticos del campo `modelos_disponibles`
- **Badge:** "Live" cuando los datos son de la API real

### Sesiones/Presets
- **Crear:** Selecciona interfaces + servidores
- **Activar:** Abre todos los servicios de golpe
- **Editar:** Modifica combinación
- **Eliminar:** Con confirmación

### Búsqueda y Filtros
- **Búsqueda:** Por nombre, tipo, descripción, IP
- **Filtros dinámicos:** Con contadores en tiempo real
  - Favoritos, Activos, Inactivos, Mantenimiento
  - Por tipo: API Backend, Chatbox UI, SD Server
- **Combinables:** Búsqueda + filtro simultáneo

### Drag & Drop
- **Reordenar:** Arrastra tarjetas en vista grid
- **Persistencia visual:** Orden se mantiene en sesión
- **Feedback:** Opacidad 50% al arrastrar

### Importar/Exportar
- **Exportar:** Descarga JSON con todos los items
- **Importar:** Lee JSON y crea registros en PocketBase
- **Formato:**
  ```json
  {
    "version": "1.0",
    "type": "interfaces|servidores",
    "exportedAt": "2026-01-15T...",
    "items": [...]
  }
  ```

### Templates Predefinidos
- **Interfaces:** A1111, ComfyUI, Forge, Fooocus, SD.Next
- **Servidores:** Ollama, SillyTavern, KoboldCpp, Text-Gen, SD Server
- **Uso:** Botón "Usar plantilla" al crear nuevo
- **Pre-rellena:** Todos los campos automáticamente

### Analítica de Uso
- **Contador:** `veces_usado` se incrementa al abrir
- **Última vez:** `ultimo_uso` con timestamp
- **Visualización:** "X usos" + "Hace Xmin/h/d"
- **Ordenamiento:** Favoritos primero, luego por uso

### Widget de Estado Global (Home)
- **Interfaces:** X/Y activas con barra de progreso
- **Servidores:** X/Y respondiendo con barra de progreso
- **Sesiones:** Total de presets guardados
- **Auto-refresh:** Al cargar la página

## 🔧 Configuración Avanzada

### Cambiar frecuencia de Health Check
Editar `src/components/common/CommonComponents.jsx`:
```javascript
intervalRef.current = setInterval(checkHealth, 30000); // Cambiar 30000 (30s)
```

### Personalizar Templates
Editar `src/components/common/TemplateSelector.jsx`:
```javascript
export const INTERFACE_TEMPLATES = [
  // Añadir/modificar templates aquí
];
```

### Cambiar colores del tema
Editar los componentes y reemplazar:
- `cyan-500` → Tu color primario
- `purple-500` → Tu color secundario
- `amber-500` → Tu color de acento

## 📱 Responsive Design

### Breakpoints
- **Móvil:** Default (< 640px)
- **Tablet:** `sm:` (≥ 640px), `md:` (≥ 768px)
- **Desktop:** `lg:` (≥ 1024px), `xl:` (≥ 1280px)

### Adaptaciones
- **Navegación:** Iconos en móvil, iconos + texto en desktop
- **Grid:** 1 columna (móvil) → 2 (tablet) → 3-4 (desktop)
- **Modales:** `max-w-lg` con padding adaptativo
- **Botones:** Texto oculto en móvil con `hidden sm:inline`

## 🐛 Solución de Problemas

### "No se pudo conectar con PocketBase"
- Verifica que PocketBase esté corriendo: `./pocketbase serve`
- Comprueba la URL en `.env` o `src/lib/pocketbase.js`
- Revisa la consola del navegador para errores CORS

### Health Check siempre muestra "offline"
- Algunas URLs pueden bloquear CORS
- El health check usa `mode: 'no-cors'` para evitar problemas
- Si el servidor responde, se marca como "online" aunque no pueda leer la respuesta

### QR Code no se genera
- Verifica que la URL sea válida
- Comprueba que `qrcode.react` esté instalado: `npm list qrcode.react`

### Ollama API no carga modelos
- Verifica que Ollama esté corriendo: `ollama serve`
- Comprueba que el puerto sea 11434
- Revisa la consola para errores de red

## 📚 Dependencias

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "pocketbase": "^0.20.0",
  "lucide-react": "^0.294.0",
  "qrcode.react": "^4.0.0"
}
```

## 🎓 Recursos

- **PocketBase Docs:** https://pocketbase.io/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/icons/
- **QR Code React:** https://www.npmjs.com/package/qrcode.react
- **Glassmorphism:** https://glassmorphism.com/

## 📝 Licencia

MIT License - Usa libremente en tus proyectos.

## 🤝 Contribuciones

Ideas para futuras versiones:
- [ ] Integración con WebSocket para health check en tiempo real
- [ ] Backend para ejecutar comandos de lanzamiento
- [ ] Gráficos de uso con Recharts
- [ ] Temas personalizables (claro/oscuro/colores)
- [ ] Notificaciones push cuando un servidor se cae
- [ ] Sincronización entre dispositivos

---

**Desarrollado con ❤️ usando React + Vite + Tailwind CSS + PocketBase**
