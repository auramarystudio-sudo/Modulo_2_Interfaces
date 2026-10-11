// Página de inicio - Dashboard principal
import { Monitor, Globe, Server, Cpu, Zap, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-600/20 border border-cyan-600/30 rounded-full px-4 py-1.5 mb-4">
            <Zap size={16} className="text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">AI Local Manager</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Gestiona tus Herramientas de IA Local
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Centraliza el acceso a interfaces de generación de imágenes, modelos de lenguaje
            y servidores de red local desde un solo panel.
          </p>
        </div>

        {/* Tarjetas de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Módulo Interfaces UI */}
          <Link
            to="/interfaces"
            className="group bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-600/50 hover:shadow-lg hover:shadow-cyan-900/20 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan-600/20 rounded-xl border border-cyan-600/30 group-hover:bg-cyan-600/30 transition-colors">
                <Monitor size={28} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Interfaces UI Locales
                </h2>
                <p className="text-sm text-slate-400">
                  AUTOMATIC1111, ComfyUI, Forge, Fooocus...
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Gestiona accesos directos a las interfaces web de generación de imágenes
              instaladas en tu equipo. Abre, edita y lanza con un solo clic.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">🎨 A1111</span>
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">🔗 ComfyUI</span>
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">⚒️ Forge</span>
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">🖼️ Fooocus</span>
            </div>
          </Link>

          {/* Módulo Servidores de Red */}
          <Link
            to="/servidores"
            className="group bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-600/50 hover:shadow-lg hover:shadow-cyan-900/20 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-600/30 group-hover:bg-purple-600/30 transition-colors">
                <Globe size={28} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Servidores de Red Local
                </h2>
                <p className="text-sm text-slate-400">
                  Ollama, SillyTavern, KoboldCpp...
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Accede desde cualquier dispositivo de tu red local a tus servidores
              de LLMs, chatboxes y servicios de IA.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">🤖 Ollama</span>
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">💬 SillyTavern</span>
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">🦎 KoboldCpp</span>
              <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">🎨 SD Server</span>
            </div>
          </Link>
        </div>

        {/* Información de configuración */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Network size={20} className="text-cyan-400" />
              Configuración de PocketBase
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Esta aplicación se conecta a una instancia de PocketBase para almacenar
              la configuración de tus interfaces y servidores.
            </p>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-slate-300 font-mono">
                URL por defecto: <span className="text-cyan-400">http://127.0.0.1:8090</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Configura la variable de entorno <code className="text-cyan-400">VITE_POCKETBASE_URL</code> para cambiar la URL del servidor.
              </p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Colecciones necesarias:</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li className="flex items-center gap-2">
                  <Server size={14} className="text-cyan-400" />
                  <code className="text-cyan-400">interfaces_ui</code> - Interfaces de generación de imágenes
                </li>
                <li className="flex items-center gap-2">
                  <Cpu size={14} className="text-purple-400" />
                  <code className="text-purple-400">servidores_red</code> - Servidores de red local
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
