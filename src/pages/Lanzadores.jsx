import { Plus, Terminal } from 'lucide-react';
import LanzadoresManager from '../components/lanzadores/LanzadoresManager.jsx';

export default function Lanzadores() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Lanzadores de Servicios</h1>
            <p className="text-sm text-slate-400 mt-1">Gestiona Docker, PocketBase, aplicaciones NPM y otros servidores</p>
          </div>
        </div>
        <button
          onClick={() => {
            const event = new CustomEvent('open-lanzador-form');
            window.dispatchEvent(event);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white text-sm font-medium transition shadow-lg shadow-green-500/20 hover:shadow-green-500/30 shrink-0 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Nuevo Lanzador</span>
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 mb-8 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🐳 Docker</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">📦 NPM</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🗄️ PocketBase</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🐍 Python</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">⚙️ Custom</span>
        </div>
      </div>

      <LanzadoresManager />
    </div>
  );
}
