import { ExternalLink, Edit, Copy, Trash2, Play, Square, CheckCircle, QrCode, Terminal, Folder, Settings } from 'lucide-react';
import { useState } from 'react';
import { HealthIndicator, QRModal, StarButton, LastUsed } from '../common/CommonComponents.jsx';
import pb from '../../lib/pocketbase.js';

const ICONOS_TIPO = {
  docker: { icon: '🐳', color: 'from-blue-500 to-cyan-600' },
  npm: { icon: '📦', color: 'from-red-500 to-pink-600' },
  pocketbase: { icon: '🗄️', color: 'from-purple-500 to-indigo-600' },
  python: { icon: '🐍', color: 'from-yellow-500 to-orange-600' },
  custom: { icon: '⚙️', color: 'from-slate-500 to-gray-600' },
};

const BADGE_ESTADO = {
  detenido: { bg: 'bg-slate-950/50', text: 'text-slate-300', border: 'border-slate-700/30', label: 'Detenido' },
  corriendo: { bg: 'bg-green-950/50', text: 'text-green-300', border: 'border-green-700/30', label: 'Corriendo' },
  error: { bg: 'bg-red-950/50', text: 'text-red-300', border: 'border-red-700/30', label: 'Error' },
};

export default function LanzadorCard({ lanzador, onEdit, onDelete, view = 'grid', onRefresh }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleOpen = () => {
    if (lanzador.url_acceso) {
      window.open(lanzador.url_acceso, '_blank', 'noopener,noreferrer');
      registrarUso();
    }
  };

  const registrarUso = async () => {
    try {
      await pb.collection('lanzadores').update(lanzador.id, {
        veces_usado: (lanzador.veces_usado || 0) + 1,
        ultimo_uso: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error registrando uso:', err);
    }
  };

  const handleCopyCommand = async () => {
    if (!lanzador.comando) return;
    try {
      await navigator.clipboard.writeText(lanzador.comando);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${lanzador.nombre}"?`)) {
      onDelete(lanzador.id);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await pb.collection('lanzadores').update(lanzador.id, {
        favorito: !lanzador.favorito
      });
      onRefresh?.();
    } catch (err) {
      console.error('Error toggling favorito:', err);
    }
  };

  const badge = BADGE_ESTADO[lanzador.estado] || BADGE_ESTADO.detenido;
  const tipoInfo = ICONOS_TIPO[lanzador.tipo] || ICONOS_TIPO.custom;

  if (view === 'list') {
    return (
      <>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-green-500/30 transition-all group flex items-center gap-4">
          {lanzador.url_acceso && <HealthIndicator url={lanzador.url_acceso} size="sm" />}
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tipoInfo.color} flex items-center justify-center shadow-lg shrink-0`}>
            <span className="text-xl">{tipoInfo.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-green-300 transition">{lanzador.nombre}</h3>
              <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-slate-500" />
              <code className="text-xs text-slate-400 font-mono truncate">{lanzador.comando}</code>
            </div>
          </div>
          {lanzador.directorio && (
            <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500">
              <Folder size={10} />
              <span className="truncate max-w-[200px]">{lanzador.directorio}</span>
            </div>
          )}
          {lanzador.veces_usado > 0 && <span className="text-xs text-slate-500 hidden md:block">{lanzador.veces_usado} usos</span>}
          <LastUsed timestamp={lanzador.ultimo_uso} />
          <StarButton isFavorite={lanzador.favorito} onToggle={handleToggleFavorite} size={14} />
          <div className="flex items-center gap-1">
            <button onClick={handleCopyCommand} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Copiar comando">
              {copied ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
            {lanzador.url_acceso && (
              <>
                <button onClick={handleOpen} className="p-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white transition" title="Abrir"><ExternalLink size={12} /></button>
                <button onClick={() => setShowQR(true)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR"><QrCode size={12} /></button>
              </>
            )}
            <button onClick={() => onEdit(lanzador)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit size={12} /></button>
            <button onClick={handleDelete} className="p-1.5 rounded-md bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30" title="Eliminar"><Trash2 size={12} /></button>
          </div>
        </div>
        {showQR && lanzador.url_acceso && <QRModal url={lanzador.url_acceso} title={lanzador.nombre} onClose={() => setShowQR(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-green-500/30 hover:shadow-green-500/5 transition-all group relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {lanzador.url_acceso && <HealthIndicator url={lanzador.url_acceso} size="sm" />}
          <StarButton isFavorite={lanzador.favorito} onToggle={handleToggleFavorite} size={14} />
        </div>

        <div className="flex items-start gap-3 mb-4 pr-16">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tipoInfo.color} flex items-center justify-center shadow-lg shrink-0`}>
            <span className="text-2xl">{tipoInfo.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-green-300 transition truncate">{lanzador.nombre}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 capitalize">{lanzador.tipo}</span>
              <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={14} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-400">Comando:</span>
            </div>
            <code className="text-xs text-green-400 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 block font-mono line-clamp-3">
              {lanzador.comando}
            </code>
          </div>

          {lanzador.directorio && (
            <div className="flex items-center gap-2">
              <Folder size={14} className="text-slate-500 shrink-0" />
              <span className="text-xs text-slate-400 font-mono truncate">{lanzador.directorio}</span>
            </div>
          )}

          {lanzador.puerto && (
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-slate-500" />
              <span className="text-xs text-slate-400">Puerto: <span className="text-slate-200 font-mono">{lanzador.puerto}</span></span>
            </div>
          )}

          {lanzador.url_acceso && (
            <div>
              <a href={lanzador.url_acceso} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all transition">
                {lanzador.url_acceso}
              </a>
            </div>
          )}

          {lanzador.descripcion && (
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{lanzador.descripcion}</p>
          )}

          {lanzador.variables_entorno && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Variables de entorno:</p>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg px-3 py-2 max-h-16 overflow-y-auto">
                <code className="text-[10px] text-slate-300 font-mono whitespace-pre-line">{lanzador.variables_entorno}</code>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
          {lanzador.veces_usado > 0 && <span className="text-xs text-slate-500">{lanzador.veces_usado} usos</span>}
          <LastUsed timestamp={lanzador.ultimo_uso} />
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
          <button onClick={handleCopyCommand} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition shadow-lg shadow-green-500/10">
            {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
          {lanzador.url_acceso && (
            <>
              <button onClick={handleOpen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-lg shadow-cyan-500/10">
                <ExternalLink size={12} /><span>Abrir</span>
              </button>
              <button onClick={() => setShowQR(true)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR Code">
                <QrCode size={14} />
              </button>
            </>
          )}
          <button onClick={() => onEdit(lanzador)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar">
            <Edit size={14} />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30 ml-auto" title="Eliminar">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {showQR && lanzador.url_acceso && <QRModal url={lanzador.url_acceso} title={lanzador.nombre} onClose={() => setShowQR(false)} />}
    </>
  );
}
