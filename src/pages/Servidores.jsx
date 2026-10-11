// Página de Servidores de Red Local
import { Globe, Wifi } from 'lucide-react';
import ServidoresManager from '../components/servidores/ServidoresManager.jsx';

export default function Servidores() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabecera de la página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-600/20 rounded-xl border border-cyan-600/30">
              <Globe size={28} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Servidores y Chatboxes en Red Local
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Accede desde cualquier dispositivo de tu red (móvil, tablet, portátil) a Ollama, SillyTavern, etc.
              </p>
            </div>
          </div>

          {/* Botón Registrar Servidor */}
          <button
            onClick={() => {
              // Disparar evento para abrir el formulario en el manager
              const event = new CustomEvent('open-server-form');
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-5 py-2.5 transition-colors shrink-0 self-start sm:self-auto"
          >
            <Wifi size={20} />
            <span>Registrar Servidor</span>
          </button>
        </div>

        {/* Info sobre servidores soportados */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🤖 Ollama</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">💬 SillyTavern</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🦎 KoboldCpp</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">📝 Text-Generation-WebUI</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🎨 SD Server (--listen)</span>
          </div>
        </div>

        {/* Gestor de servidores */}
        <ServidoresManager />
      </div>
    </div>
  );
}
