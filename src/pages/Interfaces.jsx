import { Plus, Monitor } from 'lucide-react';
import InterfacesManager from '../components/interfaces/InterfacesManager.jsx';

export default function Interfaces() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"><Monitor className="w-6 h-6 text-white" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Interfaces Locales Disponibles</h1>
            <p className="text-sm text-slate-400 mt-1">Gestiona accesos directos a tus UIs instaladas localmente en tu equipo</p>
          </div>
        </div>
        <button onClick={() => { const event = new CustomEvent('open-interface-form'); window.dispatchEvent(event); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 shrink-0 self-start sm:self-auto"><Plus size={18} /><span>Añadir Interfaz</span></button>
      </div>
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 mb-8 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🎨 AUTOMATIC1111</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🔗 ComfyUI</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">⚒️ Forge</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🖼️ Fooocus</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🚀 SD.Next</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🔧 Otras</span>
        </div>
      </div>
      <InterfacesManager />
    </div>
  );
}
