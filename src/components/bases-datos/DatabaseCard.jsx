import { Edit, Trash2, Database, Server, Key, Link as LinkIcon } from 'lucide-react';
import { StarButton } from '../common/CommonComponents.jsx';
import pb from '../../lib/pocketbase.js';

const ICONOS_TIPO = {
  sqlite: { icon: '📦', color: 'from-blue-500 to-sky-600' },
  postgresql: { icon: '🐘', color: 'from-indigo-500 to-blue-600' },
  mysql: { icon: '🐬', color: 'from-blue-600 to-cyan-700' },
  mongodb: { icon: '🍃', color: 'from-green-500 to-emerald-600' },
  redis: { icon: '🔴', color: 'from-red-500 to-rose-600' },
  other: { icon: '💾', color: 'from-slate-500 to-gray-600' },
};

const BADGE_ESTADO = {
  detenido: { bg: 'bg-slate-950/50', text: 'text-slate-300', border: 'border-slate-700/30', label: 'Detenido' },
  corriendo: { bg: 'bg-green-950/50', text: 'text-green-300', border: 'border-green-700/30', label: 'Corriendo' },
  error: { bg: 'bg-red-950/50', text: 'text-red-300', border: 'border-red-700/30', label: 'Error' },
};

export default function DatabaseCard({ database, onEdit, onDelete, view = 'grid', onRefresh }) {
  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${database.nombre}"?`)) {
      onDelete(database.id);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await pb.collection('bases_datos').update(database.id, {
        favorito: !database.favorito
      });
      onRefresh?.();
    } catch (err) {
      console.error('Error toggling favorito:', err);
    }
  };

  const badge = BADGE_ESTADO[database.estado] || BADGE_ESTADO.detenido;
  const tipoInfo = ICONOS_TIPO[database.tipo] || ICONOS_TIPO.other;

  if (view === 'list') {
    return (
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-teal-500/30 transition-all group flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tipoInfo.color} flex items-center justify-center shadow-lg shrink-0`}>
          <span className="text-xl">{tipoInfo.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-teal-300 transition">{database.nombre}</h3>
            <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Database size={12} className="text-slate-500" />
            <code className="text-xs text-slate-400 font-mono truncate">{database.nombre_bd || database.tipo}</code>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <Server size={10} />
          <span className="font-mono">{database.host}:{database.puerto}</span>
        </div>
        <StarButton isFavorite={database.favorito} onToggle={handleToggleFavorite} size={14} />
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(database)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit size={12} /></button>
          <button onClick={handleDelete} className="p-1.5 rounded-md bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30" title="Eliminar"><Trash2 size={12} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-teal-500/30 hover:shadow-teal-500/5 transition-all group relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <StarButton isFavorite={database.favorito} onToggle={handleToggleFavorite} size={14} />
      </div>

      <div className="flex items-start gap-3 mb-4 pr-12">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tipoInfo.color} flex items-center justify-center shadow-lg shrink-0`}>
          <span className="text-2xl">{tipoInfo.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-300 transition truncate">{database.nombre}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 capitalize">{database.tipo}</span>
            <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {database.nombre_bd && (
          <div className="flex items-center gap-2">
            <Database size={14} className="text-slate-500 shrink-0" />
            <code className="text-xs text-slate-200 font-mono truncate">{database.nombre_bd}</code>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Server size={14} className="text-slate-500 shrink-0" />
          <code className="text-xs text-slate-400 font-mono truncate">{database.host}:{database.puerto}</code>
        </div>

        {database.usuario && (
          <div className="flex items-center gap-2">
            <Key size={14} className="text-slate-500" />
            <span className="text-xs text-slate-400 font-mono">{database.usuario}</span>
          </div>
        )}

        {database.conexion_string && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2">
            <p className="text-xs text-teal-400 font-mono truncate" title={database.conexion_string}>
              {database.conexion_string}
            </p>
          </div>
        )}

        {database.descripcion && (
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{database.descripcion}</p>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
        <button onClick={() => onEdit(database)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition border border-slate-700/50">
          <Edit size={12} /><span>Editar</span>
        </button>
        <button onClick={handleDelete} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30 ml-auto" title="Eliminar">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
