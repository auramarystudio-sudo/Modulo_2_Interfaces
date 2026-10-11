// Página de Interfaces UI Locales
import { useState } from 'react';
import { Plus, Monitor } from 'lucide-react';
import InterfacesManager from '../components/interfaces/InterfacesManager.jsx';

export default function Interfaces() {
  // Estado para controlar el modal desde la página
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabecera de la página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-600/20 rounded-xl border border-cyan-600/30">
              <Monitor size={28} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Interfaces Locales Disponibles
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Gestiona accesos directos a tus UIs instaladas localmente en tu equipo
              </p>
            </div>
          </div>

          {/* Botón Añadir Interfaz */}
          <button
            onClick={() => {
              // Disparar evento para abrir el formulario en el manager
              const event = new CustomEvent('open-interface-form');
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-5 py-2.5 transition-colors shrink-0 self-start sm:self-auto"
          >
            <Plus size={20} />
            <span>Añadir Interfaz</span>
          </button>
        </div>

        {/* Info sobre interfaces soportadas */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🎨 AUTOMATIC1111</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🔗 ComfyUI</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">⚒️ Forge</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🖼️ Fooocus</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🚀 SD.Next</span>
            <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-3 py-1">🔧 Otras</span>
          </div>
        </div>

        {/* Gestor de interfaces */}
        <InterfacesManager />
      </div>
    </div>
  );
}
