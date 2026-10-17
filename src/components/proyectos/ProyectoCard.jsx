import { ExternalLink, Edit, Trash2, Folder, Globe, Terminal, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { HealthIndicator, QRModal, StarButton, LastUsed } from '../common/CommonComponents.jsx';
import pb from '../../lib/pocketbase.js';

const ICONOS_TIPO = {
  nodejs: { icon: '🟢', color: 'from-green-500 to-emerald-600' },
  python: { icon: '🐍', color: 'from-yellow-500 to-orange-600' },
  php: { icon: '🐘', color: 'from-indigo-500 to-purple-600' },
  static: { icon: '📄', color: 'from-blue-500 to-cyan-600' },
  docker: { icon: '🐳', color: 'from-blue-600 to-sky-700' },
  other: { icon: '⚙️', color: 'from-slate-500 to-gray-600' },
};

const BADGE_ESTADO = {
  detenido: { bg: 'bg-slate-950/50', text: 'text-slate-300', border: 'border-slate-700/30', label: 'Detenido' },
  corriendo: { bg: 'bg-green-950/50', text: 'text-green-300', border: 'border-green-700/30', label: 'Corriendo' },
  error: { bg: 'bg-red-950/50', text: 'text-red-300', border: 'border-red-700/30', label: 'Error' },
};

export default function ProyectoCard({ proyecto, onEdit, onDelete, view = 'grid', onRefresh }) {
  const [showQR, setShowQR] = useState(false);

  const handleOpen = () => {
    if (proyecto.url_acceso) {
      window.open(proyecto.url_acceso, '_blank', 'noopener,noreferrer');
      registrarUso();
    }
  };

  const registrarUso = async () => {
    try {
      await pb.collection('proyectos').update(proyecto.id, {
        veces_usado: (proyecto.veces_usado || 0) + 1,
        ultimo_uso: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error registrando uso:', err);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${proyecto.nombre}"?`)) {
      onDelete(proyecto.id);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await pb.collection('proyectos').update(proyecto.id, {
        favorito: !proyecto.favorito
      });
      onRefresh?.();
    } catch (err) {
      console.error('Error toggling favorito:', err);
    }
  };

  const badge = BADGE_ESTADO[proyecto.estado] || BADGE_ESTADO.detenido;
  const tipoInfo = ICONOS_TIPO[proyecto.tipo] || ICONOS_TIPO.other;

  if (view === 'list') {
    return (
      <>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-pink-500/30 transition-all group flex items-center gap-4">
          {proyecto.url_acceso && <HealthIndicator url={proyecto.url_acceso} size="sm" />}
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tipoInfo.color} flex items-center justify-center shadow-lg shrink-0`}>
            <span className="text-xl">{tipoInfo.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-pink-300 transition">{proyecto.nombre}</h3>
              <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Folder size={12} className="text-slate-500" />
              <code className="text-xs text-slate-400 font-mono truncate">{proyecto.ruta}</code>
            </div>
          </div>
          {proyecto.dominio_local && (
            <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500">
              <Globe size={10} />
              <span>{proyecto.dominio_local}</span>
            </div>
          )}
          {proyecto.veces_usado > 0 && <span className="text-xs text-slate-500 hidden md:block">{proyecto.veces_usado} usos</span>}
          <LastUsed timestamp={proyecto.ultimo_uso} />
          <StarButton isFavorite={proyecto.favorito} onToggle={handleToggleFavorite} size={14} />
          <div className="flex items-center gap-1">
            {proyecto.url_acceso && (
              <>
                <button onClick={handleOpen} className="p-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white transition" title="Abrir"><ExternalLink size={12} /></button>
                <button onClick={() => setShowQR(true)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR"><LinkIcon size={12} /></button>
              </>
            )}
            <button onClick={() => onEdit(proyecto)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit size={12} /></button>
            <button onClick={handleDelete} className="p-1.5 rounded-md bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30" title="Eliminar"><Trash2 size={12} /></button>
          </div>
        </div>
        {showQR && proyecto.url_acceso && <QRModal url={proyecto.url_acceso} title={proyecto.nombre} onClose={() => setShowQR(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-pink-500/30 hover:shadow-pink-500/5 transition-all group relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {proyecto.url_acceso && <HealthIndicator url={proyecto.url_acceso} size="sm" />}
          <StarButton isFavorite={proyecto.favorito} onToggle={handleToggleFavorite} size={14} />
        </div>

        <div className="flex items-start gap-3 mb-4 pr-16">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tipoInfo.color} flex items-center justify-center shadow-lg shrink-0`}>
            <span className="text-2xl">{tipoInfo.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-pink-300 transition truncate">{proyecto.nombre}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 capitalize">{proyecto.tipo}</span>
              <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Folder size={14} className="text-slate-500 shrink-0" />
            <code className="text-xs text-slate-400 font-mono truncate">{proyecto.ruta}</code>
          </div>

          {proyecto.comando_inicio && (
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-slate-500" />
              <code className="text-xs text-pink-400 font-mono truncate">{proyecto.comando_inicio}</code>
            </div>
          )}

          {proyecto.puerto && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Puerto: <span className="text-slate-200 font-mono">{proyecto.puerto}</span></span>
            </div>
          )}

          {proyecto.dominio_local && (
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-slate-500" />
              <span className="text-xs text-cyan-400 font-mono">{proyecto.dominio_local}</span>
            </div>
          )}

          {proyecto.url_acceso && (
            <div>
              <a href={proyecto.url_acceso} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all transition">
                {proyecto.url_acceso}
              </a>
            </div>
          )}

          {proyecto.descripcion && (
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{proyecto.descripcion}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
          {proyecto.veces_usado > 0 && <span className="text-xs text-slate-500">{proyecto.veces_usado} usos</span>}
          <LastUsed timestamp={proyecto.ultimo_uso} />
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
          {proyecto.url_acceso && (
            <>
              <button onClick={handleOpen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-lg shadow-cyan-500/10">
                <ExternalLink size={12} /><span>Abrir</span>
              </button>
              <button onClick={() => setShowQR(true)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR Code">
                <LinkIcon size={14} />
              </button>
            </>
          )}
          <button onClick={() => onEdit(proyecto)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar">
            <Edit size={14} />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30 ml-auto" title="Eliminar">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {showQR && proyecto.url_acceso && <QRModal url={proyecto.url_acceso} title={proyecto.nombre} onClose={() => setShowQR(false)} />}
    </>
  );
}
