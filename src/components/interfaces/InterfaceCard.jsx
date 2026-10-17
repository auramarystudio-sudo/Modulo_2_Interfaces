import { ExternalLink, Edit, Copy, Trash2, CheckCircle, QrCode } from 'lucide-react';
import { useState } from 'react';
import { HealthIndicator, QRModal, StarButton, LastUsed } from '../common/CommonComponents.jsx';
import pb from '../../lib/pocketbase.js';

const ICONOS_TIPO = { automatic1111: '🎨', comfyui: '🔗', forge: '⚒️', fooocus: '🖼️', sdnext: '🚀', otra: '🔧' };
const BADGE_ESTADO = {
  activo: { bg: 'bg-green-950/50', text: 'text-green-300', border: 'border-green-700/30', label: 'Activo' },
  inactivo: { bg: 'bg-red-950/50', text: 'text-red-300', border: 'border-red-700/30', label: 'Inactivo' },
  mantenimiento: { bg: 'bg-yellow-950/50', text: 'text-yellow-300', border: 'border-yellow-700/30', label: 'Mantenimiento' },
};

export default function InterfaceCard({ interfaz, onEdit, onDelete, view = 'grid', onRefresh }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleOpen = () => {
    window.open(interfaz.url_local, '_blank', 'noopener,noreferrer');
    registrarUso();
  };

  const registrarUso = async () => {
    try {
      await pb.collection('interfaces_ui').update(interfaz.id, { veces_usado: (interfaz.veces_usado || 0) + 1, ultimo_uso: new Date().toISOString() });
    } catch (err) { console.error('Error registrando uso:', err); }
  };

  const handleCopyCommand = async () => {
    if (!interfaz.comando_lanzamiento) return;
    try {
      await navigator.clipboard.writeText(interfaz.comando_lanzamiento);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Error al copiar:', err); }
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${interfaz.nombre}"?`)) onDelete(interfaz.id);
  };

  const handleToggleFavorite = async () => {
    try {
      await pb.collection('interfaces_ui').update(interfaz.id, { favorito: !interfaz.favorito });
      onRefresh?.();
    } catch (err) { console.error('Error toggling favorito:', err); }
  };

  const badge = BADGE_ESTADO[interfaz.estado] || BADGE_ESTADO.activo;
  const icono = ICONOS_TIPO[interfaz.tipo] || '🔧';

  if (view === 'list') {
    return (
      <>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-cyan-500/30 transition-all group flex items-center gap-4">
          <HealthIndicator url={interfaz.url_local} size="sm" />
          <span className="text-xl">{icono}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-cyan-300 transition">{interfaz.nombre}</h3>
              <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
            </div>
            <p className="text-xs text-slate-500 font-mono truncate">{interfaz.url_local}</p>
          </div>
          {interfaz.veces_usado > 0 && <span className="text-xs text-slate-500 hidden md:block">{interfaz.veces_usado} usos</span>}
          <LastUsed timestamp={interfaz.ultimo_uso} />
          <StarButton isFavorite={interfaz.favorito} onToggle={handleToggleFavorite} size={14} />
          <div className="flex items-center gap-1">
            <button onClick={handleOpen} className="p-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white transition" title="Abrir"><ExternalLink size={12} /></button>
            <button onClick={() => setShowQR(true)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR"><QrCode size={12} /></button>
            <button onClick={() => onEdit(interfaz)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit size={12} /></button>
            <button onClick={handleDelete} className="p-1.5 rounded-md bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30" title="Eliminar"><Trash2 size={12} /></button>
          </div>
        </div>
        {showQR && <QRModal url={interfaz.url_local} title={interfaz.nombre} onClose={() => setShowQR(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-cyan-500/30 hover:shadow-cyan-500/5 transition-all group relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <HealthIndicator url={interfaz.url_local} size="sm" />
          <StarButton isFavorite={interfaz.favorito} onToggle={handleToggleFavorite} size={14} />
        </div>
        <div className="flex items-center gap-3 mb-4 pr-16">
          <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-xl">{icono}</div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition truncate">{interfaz.nombre}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500 capitalize">{interfaz.tipo}</p>
              <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2">
            <p className="text-sm text-slate-200 font-mono truncate">{interfaz.url_local}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-slate-500">Puerto: {interfaz.puerto}</p>
            {interfaz.veces_usado > 0 && <span className="text-xs text-slate-500">{interfaz.veces_usado} usos</span>}
          </div>
          <LastUsed timestamp={interfaz.ultimo_uso} />
        </div>
        {interfaz.descripcion && <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{interfaz.descripcion}</p>}
        {interfaz.comando_lanzamiento && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-400 mb-1.5">Comando:</p>
            <code className="text-xs text-cyan-400 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 block truncate font-mono">{interfaz.comando_lanzamiento}</code>
          </div>
        )}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
          <button onClick={handleOpen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-lg shadow-cyan-500/10"><ExternalLink size={12} /><span>Abrir</span></button>
          <button onClick={() => setShowQR(true)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR Code"><QrCode size={14} /></button>
          <button onClick={() => onEdit(interfaz)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit size={14} /></button>
          {interfaz.comando_lanzamiento && (
            <button onClick={handleCopyCommand} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Copiar comando">
              {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          )}
          <button onClick={handleDelete} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30 ml-auto" title="Eliminar"><Trash2 size={14} /></button>
        </div>
      </div>
      {showQR && <QRModal url={interfaz.url_local} title={interfaz.nombre} onClose={() => setShowQR(false)} />}
    </>
  );
}
