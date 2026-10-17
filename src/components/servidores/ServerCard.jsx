import { ExternalLink, Edit, Trash2, Server, MessageSquare, Cpu, QrCode, Boxes } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HealthIndicator, QRModal, StarButton, LastUsed } from '../common/CommonComponents.jsx';
import pb from '../../lib/pocketbase.js';

const ICONOS_TIPO = {
  chatbox_ui: { icon: MessageSquare, gradient: 'from-purple-500 to-pink-600', label: 'Chatbox UI' },
  api_backend: { icon: Cpu, gradient: 'from-blue-500 to-cyan-600', label: 'API Backend' },
  sd_server: { icon: Server, gradient: 'from-orange-500 to-amber-600', label: 'SD Server' },
};
const BADGE_ESTADO = {
  activo: { bg: 'bg-green-950/50', text: 'text-green-300', border: 'border-green-700/30', label: 'Activo' },
  inactivo: { bg: 'bg-red-950/50', text: 'text-red-300', border: 'border-red-700/30', label: 'Inactivo' },
};
const TIPO_BADGE = {
  chatbox_ui: 'bg-purple-950/50 text-purple-300 border-purple-700/30',
  api_backend: 'bg-blue-950/50 text-blue-300 border-blue-700/30',
  sd_server: 'bg-orange-950/50 text-orange-300 border-orange-700/30',
};

export default function ServerCard({ server, onEdit, onDelete, view = 'grid', onRefresh }) {
  const [showQR, setShowQR] = useState(false);
  const [ollamaModels, setOllamaModels] = useState(null);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    const isOllama = server.nombre?.toLowerCase().includes('ollama') || server.puerto === 11434 || server.url_acceso?.includes(':11434');
    if (isOllama) fetchOllamaModels();
  }, [server.url_acceso]);

  const fetchOllamaModels = async () => {
    setLoadingModels(true);
    try {
      const response = await fetch(`${server.url_acceso}/api/tags`, { signal: AbortSignal.timeout(5000) });
      const data = await response.json();
      if (data.models) setOllamaModels(data.models.map(m => m.name));
    } catch { setOllamaModels(null); }
    finally { setLoadingModels(false); }
  };

  const handleOpen = () => { window.open(server.url_acceso, '_blank', 'noopener,noreferrer'); registrarUso(); };
  const registrarUso = async () => {
    try { await pb.collection('servidores_red').update(server.id, { veces_usado: (server.veces_usado || 0) + 1, ultimo_uso: new Date().toISOString() }); }
    catch (err) { console.error('Error registrando uso:', err); }
  };
  const handleDelete = () => { if (window.confirm(`¿Estás seguro de eliminar "${server.nombre}"?`)) onDelete(server.id); };
  const handleToggleFavorite = async () => {
    try { await pb.collection('servidores_red').update(server.id, { favorito: !server.favorito }); onRefresh?.(); }
    catch (err) { console.error('Error toggling favorito:', err); }
  };

  const badge = BADGE_ESTADO[server.estado] || BADGE_ESTADO.activo;
  const tipoInfo = ICONOS_TIPO[server.tipo_servidor] || ICONOS_TIPO.api_backend;
  const TipoIcon = tipoInfo.icon;
  const modelos = ollamaModels || (server.modelos_disponibles ? server.modelos_disponibles.split('\n').filter(m => m.trim()) : []);

  if (view === 'list') {
    return (
      <>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-purple-500/30 transition-all group flex items-center gap-4">
          <HealthIndicator url={server.url_acceso} size="sm" />
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tipoInfo.gradient} flex items-center justify-center shrink-0`}><TipoIcon size={14} className="text-white" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-purple-300 transition">{server.nombre}</h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${TIPO_BADGE[server.tipo_servidor] || TIPO_BADGE.api_backend}`}>{tipoInfo.label}</span>
            </div>
            <p className="text-xs text-slate-500 font-mono truncate">{server.ip_red}:{server.puerto}</p>
          </div>
          {modelos.length > 0 && <span className="text-xs text-slate-500 hidden md:flex items-center gap-1"><Boxes size={10} />{modelos.length} modelos</span>}
          {server.veces_usado > 0 && <span className="text-xs text-slate-500 hidden md:block">{server.veces_usado} usos</span>}
          <LastUsed timestamp={server.ultimo_uso} />
          <StarButton isFavorite={server.favorito} onToggle={handleToggleFavorite} size={14} />
          <div className="flex items-center gap-1">
            <button onClick={handleOpen} className="p-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white transition" title="Abrir"><ExternalLink size={12} /></button>
            <button onClick={() => setShowQR(true)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR"><QrCode size={12} /></button>
            <button onClick={() => onEdit(server)} className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit size={12} /></button>
            <button onClick={handleDelete} className="p-1.5 rounded-md bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30" title="Eliminar"><Trash2 size={12} /></button>
          </div>
        </div>
        {showQR && <QRModal url={server.url_acceso} title={server.nombre} onClose={() => setShowQR(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-purple-500/30 hover:shadow-purple-500/5 transition-all group relative">
        <div className="absolute top-4 right-4 flex items-center gap-2"><HealthIndicator url={server.url_acceso} size="sm" /><StarButton isFavorite={server.favorito} onToggle={handleToggleFavorite} size={14} /></div>
        <div className="flex items-start gap-3 mb-4 pr-16">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tipoInfo.gradient} flex items-center justify-center shadow-lg shrink-0`}><TipoIcon size={20} className="text-white" /></div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition truncate">{server.nombre}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${TIPO_BADGE[server.tipo_servidor] || TIPO_BADGE.api_backend}`}>{tipoInfo.label}</span>
              <span className={`${badge.bg} ${badge.text} border ${badge.border} text-[10px] px-1.5 py-0.5 rounded`}>{badge.label}</span>
            </div>
          </div>
        </div>
        <div className="mb-3"><div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2"><Server size={14} className="text-slate-500 shrink-0" /><span className="text-sm text-slate-200 font-mono truncate">{server.ip_red}:{server.puerto}</span></div></div>
        <div className="mb-3"><a href={server.url_acceso} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all transition">{server.url_acceso}</a></div>
        {server.descripcion && <p className="text-sm text-slate-400 mb-3 line-clamp-2 leading-relaxed">{server.descripcion}</p>}
        {modelos.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1"><Boxes size={10} />Modelos ({modelos.length}){ollamaModels && <span className="text-green-400 text-[10px]">• Live</span>}{loadingModels && <span className="text-yellow-400 text-[10px]">• Cargando...</span>}</p>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {modelos.slice(0, 8).map((modelo, idx) => <span key={idx} className="text-[10px] bg-slate-800/50 text-slate-300 border border-slate-700/50 rounded px-1.5 py-0.5 font-mono">{modelo.trim()}</span>)}
              {modelos.length > 8 && <span className="text-[10px] text-slate-500">+{modelos.length - 8} más</span>}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">{server.veces_usado > 0 && <span className="text-xs text-slate-500">{server.veces_usado} usos</span>}<LastUsed timestamp={server.ultimo_uso} /></div>
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
          <button onClick={handleOpen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-lg shadow-cyan-500/10"><ExternalLink size={12} /><span>Abrir</span></button>
          <button onClick={() => setShowQR(true)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="QR Code"><QrCode size={14} /></button>
          <button onClick={() => onEdit(server)} className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit size={14} /></button>
          <button onClick={handleDelete} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30 ml-auto" title="Eliminar"><Trash2 size={14} /></button>
        </div>
      </div>
      {showQR && <QRModal url={server.url_acceso} title={server.nombre} onClose={() => setShowQR(false)} />}
    </>
  );
}
