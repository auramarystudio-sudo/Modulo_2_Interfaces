import { Zap, Monitor, Globe, Terminal, X } from 'lucide-react';

export const LANZADOR_TEMPLATES = [
  { id: 'pocketbase', nombre: 'PocketBase', tipo: 'pocketbase', comando: './pocketbase serve --http=0.0.0.0:8090', directorio: '/opt/pocketbase', puerto: 8090, url_acceso: 'http://localhost:8090', descripcion: 'Backend open-source con SQLite, auth y admin UI' },
  { id: 'docker-pb', nombre: 'PocketBase Docker', tipo: 'docker', comando: 'docker run -d --name pocketbase -p 8090:8090 -v /data/pb:/pb/pb_data ghcr.io/pocketbase/pocketbase:latest', directorio: '', puerto: 8090, url_acceso: 'http://localhost:8090', descripcion: 'PocketBase en contenedor Docker' },
  { id: 'docker-ollama', nombre: 'Ollama Docker', tipo: 'docker', comando: 'docker run -d --name ollama -p 11434:11434 -v ollama_data:/root/.ollama ollama/ollama:latest', directorio: '', puerto: 11434, url_acceso: 'http://localhost:11434', descripcion: 'Ollama en Docker para LLMs' },
  { id: 'docker-openwebui', nombre: 'Open WebUI', tipo: 'docker', comando: 'docker run -d --name open-webui -p 3000:8080 --add-host=host.docker.internal:host-gateway ghcr.io/open-webui/open-webui:main', directorio: '', puerto: 3000, url_acceso: 'http://localhost:3000', descripcion: 'Interfaz web para Ollama' },
  { id: 'npm-dev', nombre: 'NPM Dev Server', tipo: 'npm', comando: 'npm run dev', directorio: '~/proyectos/mi-app', puerto: 5173, url_acceso: 'http://localhost:5173', descripcion: 'Servidor de desarrollo Vite/React' },
  { id: 'npm-build', nombre: 'NPM Build + Serve', tipo: 'npm', comando: 'npm run build && npm run preview', directorio: '~/proyectos/mi-app', puerto: 4173, url_acceso: 'http://localhost:4173', descripcion: 'Build de producción con preview' },
  { id: 'python-fastapi', nombre: 'FastAPI', tipo: 'python', comando: 'uvicorn main:app --reload --host 0.0.0.0 --port 8000', directorio: '~/proyectos/api-python', puerto: 8000, url_acceso: 'http://localhost:8000', descripcion: 'API REST con FastAPI y hot-reload' },
  { id: 'python-flask', nombre: 'Flask', tipo: 'python', comando: 'flask --app app run --host 0.0.0.0 --port 5000 --debug', directorio: '~/proyectos/flask-app', puerto: 5000, url_acceso: 'http://localhost:5000', descripcion: 'Servidor Flask con modo debug' },
  { id: 'docker-redis', nombre: 'Redis', tipo: 'docker', comando: 'docker run -d --name redis -p 6379:6379 redis:latest', directorio: '', puerto: 6379, url_acceso: '', descripcion: 'Base de datos en memoria Redis' },
  { id: 'docker-postgres', nombre: 'PostgreSQL', tipo: 'docker', comando: 'docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=secret -v pgdata:/var/lib/postgresql/data postgres:15', directorio: '', puerto: 5432, url_acceso: '', descripcion: 'Base de datos PostgreSQL' },
];

export const INTERFACE_TEMPLATES = [
  { id: 'a1111', nombre: 'AUTOMATIC1111', tipo: 'automatic1111', url_local: 'http://127.0.0.1:7860', puerto: 7860, comando_lanzamiento: 'webui-user.bat --xformers --api', descripcion: 'Interfaz web estándar para Stable Diffusion', icono: '🎨' },
  { id: 'comfyui', nombre: 'ComfyUI', tipo: 'comfyui', url_local: 'http://127.0.0.1:8188', puerto: 8188, comando_lanzamiento: 'python main.py --listen', descripcion: 'Interfaz basada en nodos para Stable Diffusion', icono: '🔗' },
  { id: 'forge', nombre: 'Forge WebUI', tipo: 'forge', url_local: 'http://127.0.0.1:7860', puerto: 7860, comando_lanzamiento: 'webui.bat --api', descripcion: 'Fork optimizado de AUTOMATIC1111', icono: '⚒️' },
  { id: 'fooocus', nombre: 'Fooocus', tipo: 'fooocus', url_local: 'http://127.0.0.1:7865', puerto: 7865, comando_lanzamiento: 'python entry_with_update.py', descripcion: 'Interfaz simplificada basada en SDXL', icono: '🖼️' },
  { id: 'sdnext', nombre: 'SD.Next', tipo: 'sdnext', url_local: 'http://127.0.0.1:7860', puerto: 7860, comando_lanzamiento: 'webui.sh --api', descripcion: 'Fork con soporte multi-backend', icono: '🚀' },
];

export const SERVER_TEMPLATES = [
  { id: 'ollama', nombre: 'Ollama Local', tipo_servidor: 'api_backend', ip_red: '127.0.0.1', puerto: 11434, url_acceso: 'http://127.0.0.1:11434', descripcion: 'API local para modelos de lenguaje', modelos_disponibles: 'llama3.1:latest\nmistral:latest\ncodellama:7b' },
  { id: 'sillytavern', nombre: 'SillyTavern', tipo_servidor: 'chatbox_ui', ip_red: '127.0.0.1', puerto: 8000, url_acceso: 'http://127.0.0.1:8000', descripcion: 'Chatbox UI para roleplay y chat con LLMs', modelos_disponibles: '' },
  { id: 'koboldcpp', nombre: 'KoboldCpp', tipo_servidor: 'api_backend', ip_red: '127.0.0.1', puerto: 5001, url_acceso: 'http://127.0.0.1:5001', descripcion: 'Backend GGUF para modelos cuantizados', modelos_disponibles: '' },
  { id: 'textgen', nombre: 'Text-Generation-WebUI', tipo_servidor: 'api_backend', ip_red: '127.0.0.1', puerto: 5000, url_acceso: 'http://127.0.0.1:5000', descripcion: 'UI de oobabooga para LLMs', modelos_disponibles: '' },
  { id: 'sdserver', nombre: 'SD Server (Listen)', tipo_servidor: 'sd_server', ip_red: '192.168.1.100', puerto: 7860, url_acceso: 'http://192.168.1.100:7860', descripcion: 'AUTOMATIC1111 con --listen para acceso en red', modelos_disponibles: '' },
];

export default function TemplateSelector({ type, onSelect, onClose }) {
  const templates = type === 'interface' ? INTERFACE_TEMPLATES : type === 'lanzador' ? LANZADOR_TEMPLATES : SERVER_TEMPLATES;
  const Icon = type === 'interface' ? Monitor : type === 'lanzador' ? Terminal : Globe;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border border-cyan-700/50 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Plantillas Rápidas</h2>
              <p className="text-xs text-slate-500">Selecciona una plantilla para pre-rellenar el formulario</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="text-left bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-start gap-3">
                  {template.icono ? (
                    <span className="text-2xl">{template.icono}</span>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                      <Icon size={18} className="text-cyan-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition">{template.nombre}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{template.descripcion}</p>
                    <p className="text-xs text-cyan-400 font-mono mt-1.5">{template.url_local || template.url_acceso}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => onSelect(null)}
            className="w-full mt-4 p-4 border-2 border-dashed border-slate-700/50 rounded-xl text-sm text-slate-400 hover:text-white hover:border-slate-600 transition"
          >
            Crear desde cero (formulario vacío)
          </button>
        </div>
      </div>
    </div>
  );
}
