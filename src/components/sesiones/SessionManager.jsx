import { useState, useEffect } from 'react';
import { Plus, Play, Square, X, Edit2, Trash2, Layers, Monitor, Globe, Loader2, AlertCircle, Zap, Save } from 'lucide-react';
import pb from '../../lib/pocketbase.js';

export default function SessionManager() {
  const [sesiones, setSesiones] = useState([]);
  const [interfaces, setInterfaces] = useState([]);
  const [servidores, setServidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [activeSessions, setActiveSessions] = useState(new Set());
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sesionesData, interfacesData, servidoresData] = await Promise.all([
        pb.collection('sesiones').getFullList({ sort: '-created' }).catch(() => []),
        pb.collection('interfaces_ui').getFullList().catch(() => []),
        pb.collection('servidores_red').getFullList().catch(() => []),
      ]);
      setSesiones(sesionesData); setInterfaces(interfacesData); setServidores(servidoresData);
    } catch (err) { console.error('Error cargando datos:', err); setError('Error al cargar las sesiones'); }
    finally { setLoading(false); }
  };

  const toggleSession = (sessionId) => { setActiveSessions(prev => { const newSet = new Set(prev); if (newSet.has(sessionId)) newSet.delete(sessionId); else newSet.add(sessionId); return newSet; }); };

  const handleSaveSession = async (data) => {
    try {
      if (editingSession) { const record = await pb.collection('sesiones').update(editingSession.id, data); setSesiones(prev => prev.map(s => s.id === record.id ? record : s)); }
      else { const record = await pb.collection('sesiones').create(data); setSesiones(prev => [record, ...prev]); }
      setShowForm(false); setEditingSession(null);
    } catch (err) { console.error('Error guardando sesión:', err); setError('Error al guardar la sesión'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta sesión?')) return;
    try { await pb.collection('sesiones').delete(id); setSesiones(prev => prev.filter(s => s.id !== id)); setActiveSessions(prev => { const s = new Set(prev); s.delete(id); return s; }); }
    catch (err) { console.error('Error eliminando sesión:', err); }
  };

  const getSessionItems = (sesion) => {
    const items = [];
    const interfaceIds = sesion.interfaces_ids ? JSON.parse(sesion.interfaces_ids || '[]') : [];
    const servidorIds = sesion.servidores_ids ? JSON.parse(sesion.servidores_ids || '[]') : [];
    interfaceIds.forEach(id => { const intf = interfaces.find(i => i.id === id); if (intf) items.push({ ...intf, itemType: 'interface' }); });
    servidorIds.forEach(id => { const srv = servidores.find(s => s.id === id); if (srv) items.push({ ...srv, itemType: 'server' }); });
    return items;
  };

  const openAllItems = (sesion) => { const items = getSessionItems(sesion); items.forEach(item => { const url = item.url_local || item.url_acceso; if (url) window.open(url, '_blank', 'noopener,noreferrer'); }); };

  if (loading) return (<div className="flex items-center justify-center py-12"><Loader2 size={32} className="text-cyan-400 animate-spin" /></div>);

  return (
    <div>
      {error && (<div className="flex items-center gap-2 bg-red-950/50 border border-red-700/30 rounded-xl p-3 mb-4"><AlertCircle size={16} className="text-red-400" /><span className="text-sm text-red-300">{error}</span><button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300 text-xs">Cerrar</button></div>)}
      {sesiones.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4"><Layers size={32} className="text-amber-400" /></div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">No hay sesiones guardadas</h3>
          <p className="text-sm text-slate-400 mb-4 max-w-md mx-auto">Las sesiones te permiten guardar combinaciones de interfaces y servidores que usas juntos.</p>
          <button onClick={() => { setEditingSession(null); setShowForm(true); }} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-medium transition shadow-lg shadow-amber-500/20"><Plus size={16} />Crear Primera Sesión</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Layers size={16} className="text-amber-400" />Mis Sesiones ({sesiones.length})</h3><button onClick={() => { setEditingSession(null); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-medium transition shadow-lg shadow-amber-500/20"><Plus size={14} />Nueva Sesión</button></div>
          {sesiones.map(sesion => {
            const items = getSessionItems(sesion);
            const isActive = activeSessions.has(sesion.id);
            return (
              <div key={sesion.id} className={`bg-slate-900/50 border rounded-2xl p-5 backdrop-blur-sm transition-all ${isActive ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-800/50 hover:border-slate-700/50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2"><h4 className="text-base font-bold text-slate-100 truncate">{sesion.nombre}</h4>{isActive && <span className="text-xs px-2 py-0.5 rounded-md bg-amber-950/50 text-amber-300 border border-amber-700/30">Activa</span>}</div>
                    {sesion.descripcion && <p className="text-xs text-slate-400 mb-3">{sesion.descripcion}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((item, idx) => <span key={idx} className={`text-xs px-2 py-1 rounded-md border ${item.itemType === 'interface' ? 'bg-cyan-950/30 text-cyan-300 border-cyan-700/30' : 'bg-purple-950/30 text-purple-300 border-purple-700/30'}`}>{item.itemType === 'interface' ? '🖥️' : '🌐'} {item.nombre}</span>)}
                      {items.length === 0 && <span className="text-xs text-slate-500 italic">Sin elementos</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => openAllItems(sesion)} className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-lg shadow-cyan-500/10" title="Abrir todos"><Play size={14} /></button>
                    <button onClick={() => toggleSession(sesion.id)} className={`p-2 rounded-lg transition ${isActive ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'}`} title={isActive ? 'Desactivar' : 'Activar'}>{isActive ? <Square size={14} /> : <Zap size={14} />}</button>
                    <button onClick={() => { setEditingSession(sesion); setShowForm(true); }} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700/50" title="Editar"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(sesion.id)} className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition border border-red-700/30" title="Eliminar"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showForm && <SessionForm session={editingSession} interfaces={interfaces} servidores={servidores} onSave={handleSaveSession} onCancel={() => { setShowForm(false); setEditingSession(null); }} />}
    </div>
  );
}

function SessionForm({ session, interfaces, servidores, onSave, onCancel }) {
  const [nombre, setNombre] = useState(session?.nombre || '');
  const [descripcion, setDescripcion] = useState(session?.descripcion || '');
  const [selectedInterfaces, setSelectedInterfaces] = useState(() => { try { return session?.interfaces_ids ? JSON.parse(session.interfaces_ids) : []; } catch { return []; } });
  const [selectedServidores, setSelectedServidores] = useState(() => { try { return session?.servidores_ids ? JSON.parse(session.servidores_ids) : []; } catch { return []; } });

  const handleSubmit = (e) => { e.preventDefault(); if (!nombre.trim()) return; onSave({ nombre, descripcion, interfaces_ids: JSON.stringify(selectedInterfaces), servidores_ids: JSON.stringify(selectedServidores) }); };
  const toggleInterface = (id) => { setSelectedInterfaces(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
  const toggleServidor = (id) => { setSelectedServidores(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-slate-900 border border-amber-700/50 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"><Layers className="w-5 h-5 text-white" /></div><h2 className="text-xl font-bold text-slate-100">{session ? 'Editar Sesión' : 'Nueva Sesión'}</h2></div>
          <button onClick={onCancel} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre *</label><input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Sesión SDXL Completa" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition" required /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label><textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="¿Cuándo usas esta sesión?" rows={2} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition resize-none" /></div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5"><Monitor size={12} className="text-cyan-400" />Interfaces ({selectedInterfaces.length} seleccionadas)</label>
            {interfaces.length === 0 ? <p className="text-xs text-slate-500 italic">No hay interfaces registradas</p> : (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {interfaces.map(intf => (<label key={intf.id} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${selectedInterfaces.includes(intf.id) ? 'bg-cyan-950/30 border-cyan-700/30' : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'}`}><input type="checkbox" checked={selectedInterfaces.includes(intf.id)} onChange={() => toggleInterface(intf.id)} className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700" /><span className="text-sm text-slate-200">{intf.nombre}</span><span className="text-xs text-slate-500 ml-auto font-mono">{intf.url_local}</span></label>))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5"><Globe size={12} className="text-purple-400" />Servidores ({selectedServidores.length} seleccionados)</label>
            {servidores.length === 0 ? <p className="text-xs text-slate-500 italic">No hay servidores registrados</p> : (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {servidores.map(srv => (<label key={srv.id} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${selectedServidores.includes(srv.id) ? 'bg-purple-950/30 border-purple-700/30' : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'}`}><input type="checkbox" checked={selectedServidores.includes(srv.id)} onChange={() => toggleServidor(srv.id)} className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-purple-500/20 bg-slate-700" /><span className="text-sm text-slate-200">{srv.nombre}</span><span className="text-xs text-slate-500 ml-auto font-mono">{srv.ip_red}:{srv.puerto}</span></label>))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition border border-slate-700/50">Cancelar</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-medium transition shadow-lg shadow-amber-500/20"><Save size={16} />Guardar Sesión</button>
          </div>
        </form>
      </div>
    </div>
  );
}
