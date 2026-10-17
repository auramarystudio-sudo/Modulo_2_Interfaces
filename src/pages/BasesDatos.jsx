import { Plus, Database } from 'lucide-react';
import DatabasesManager from '../components/bases-datos/DatabasesManager.jsx';

export default function BasesDatos() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Bases de Datos Locales</h1>
            <p className="text-sm text-slate-400 mt-1">Gestiona conexiones a PostgreSQL, MySQL, MongoDB y más</p>
          </div>
        </div>
        <button
          onClick={() => {
            const event = new CustomEvent('open-database-form');
            window.dispatchEvent(event);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-sm font-medium transition shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 shrink-0 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Nueva Base de Datos</span>
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 mb-8 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🐘 PostgreSQL</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🐬 MySQL</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🍃 MongoDB</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🔴 Redis</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">📦 SQLite</span>
        </div>
      </div>

      <DatabasesManager />
    </div>
  );
}
