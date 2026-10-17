import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Loader2, AlertTriangle, WifiOff, ArrowUpDown } from 'lucide-react';
import pb from '../../lib/pocketbase.js';
import ServerCard from './ServerCard.jsx';
import ServerForm from './ServerForm.jsx';
import { SearchBar, ViewToggle } from '../common/CommonComponents.jsx';
import ImportExport from '../common/ImportExport.jsx';
import TemplateSelector from '../common/TemplateSelector.jsx';

export default function ServidoresManager() {
  const [servidores, setServidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [view, setView] = useState('grid');
  const [draggedId, setDraggedId] = useState(null);

  const loadServidores = useCallback(async () => {
    setLoading(true); setError('');
    try { const records = await pb.collection('servidores_red').getFullList({ sort: '-created' }); setServidores(records); }
    catch (err) { console.error('Error cargando servidores:', err); setError('No se pudo conectar con PocketBase.'); setServidores([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadServidores(); }, [loadServidores]);
  useEffect(() => {
    const handleOpenForm = () => { setEditingServer(null); setShowTemplates(true); };
    window.addEventListener('open-server-form', handleOpenForm);
    return () => window.removeEventListener('open-server-form', handleOpenForm);
  }, []);

  const filters = useMemo(() => {
    const counts = { activo: 0, inactivo: 0, chatbox_ui: 0, api_backend: 0, sd_server: 0, favorito: 0 };
    servidores.forEach(s => { if (s.estado) counts[s.estado]++; if (s.tipo_servidor) counts[s.tipo_servidor]++; if (s.favorito) counts.favorito++; });
    return [
      { value: 'favorito', label: 'Favoritos', icon: '⭐', count: counts.favorito },
      { value: 'activo', label: 'Activos', icon: '🟢', count: counts.activo },
      { value: 'inactivo', label: 'Inactivos', icon: '🔴', count: counts.inactivo },
      { value: 'api_backend', label: 'API Backend', icon: '🤖', count: counts.api_backend },
      { value: 'chatbox_ui', label: 'Chatbox UI', icon: '💬', count: counts.chatbox_ui },
      { value: 'sd_server', label: 'SD Server', icon: '🎨', count: counts.sd_server },
    ];
  }, [servidores]);

  const filteredServidores = useMemo(() => {
    let result = [...servidores];
    if (search) { const q = search.toLowerCase(); result = result.filter(s => s.nombre?.toLowerCase().includes(q) || s.tipo_servidor?.toLowerCase().includes(q) || s.ip_red?.includes(q) || s.descripcion?.toLowerCase().includes(q)); }
    if (activeFilter === 'favorito') result = result.filter(s => s.favorito);
    else if (['activo', 'inactivo'].includes(activeFilter)) result = result.filter(s => s.estado === activeFilter);
    else if (activeFilter) result = result.filter(s => s.tipo_servidor === activeFilter);
    result.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));
    return result;
  }, [servidores, search, activeFilter]);

  const handleCreate = async (data) => { setSaving(true); try { const record = await pb.collection('servidores_red').create(data); setServidores(prev => [record, ...prev]); setShowForm(false); } catch (err) { setError('Error al crear: ' + (err.message || 'Error desconocido')); } finally { setSaving(false); } };
  const handleUpdate = async (data) => { setSaving(true); try { const record = await pb.collection('servidores_red').update(editingServer.id, data); setServidores(prev => prev.map(s => s.id === record.id ? record : s)); setEditingServer(null); setShowForm(false); } catch (err) { setError('Error al actualizar: ' + (err.message || 'Error desconocido')); } finally { setSaving(false); } };
  const handleDelete = async (id) => { try { await pb.collection('servidores_red').delete(id); setServidores(prev => prev.filter(s => s.id !== id)); } catch (err) { setError('Error al eliminar: ' + (err.message || 'Error desconocido')); } };
  const handleEdit = (server) => { setEditingServer(server); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditingServer(null); };
  const handleTemplateSelect = (template) => { setShowTemplates(false); setEditingServer(template); setShowForm(true); };
  const handleDragStart = (e, id) => { setDraggedId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e, targetId) => { e.preventDefault(); if (draggedId === targetId) return; const newOrder = [...servidores]; const dragIdx = newOrder.findIndex(s => s.id === draggedId); const dropIdx = newOrder.findIndex(s => s.id === targetId); const [moved] = newOrder.splice(dragIdx, 1); newOrder.splice(dropIdx, 0, moved); setServidores(newOrder); setDraggedId(null); };

  return (
    <div>
      {error && (<div className="flex items-center justify-between bg-red-950/50 border border-red-700/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center"><AlertTriangle size={16} className="text-red-400" /></div><span className="text-sm text-red-300">{error}</span></div><button onClick={() => setError('')} className="text-red-400 hover:text-red-300 text-sm font-medium transition">Cerrar</button></div>)}
      {!loading && servidores.length > 0 && (<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"><div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Buscar servidores..." filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} /></div><div className="flex items-center gap-2 shrink-0"><ViewToggle view={view} onChange={setView} /><ImportExport type="servidores" items={servidores} onImported={loadServidores} /></div></div>)}
      {loading ? (<div className="flex flex-col items-center justify-center py-20"><div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 backdrop-blur-sm"><Loader2 size={32} className="text-purple-400 animate-spin" /></div><p className="text-sm text-slate-400">Cargando servidores...</p></div>) : filteredServidores.length === 0 && servidores.length === 0 ? (<div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 backdrop-blur-sm shadow-xl text-center"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6"><WifiOff size={40} className="text-purple-400" /></div><h3 className="text-xl font-bold text-slate-100 mb-2">No hay servidores registrados</h3><p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Añade tu primer servidor o selecciona una plantilla rápida.</p><div className="flex items-center justify-center gap-3"><button onClick={() => { setEditingServer(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium transition shadow-lg shadow-purple-500/20"><Plus size={16} /><span>Crear desde cero</span></button><button onClick={() => setShowTemplates(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition border border-slate-700/50"><ArrowUpDown size={16} /><span>Usar plantilla</span></button></div></div>) : filteredServidores.length === 0 ? (<div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm text-center"><p className="text-sm text-slate-400">No se encontraron servidores con esos filtros.</p><button onClick={() => { setSearch(''); setActiveFilter(null); }} className="text-purple-400 hover:text-purple-300 text-sm mt-2 transition">Limpiar filtros</button></div>) : view === 'grid' ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredServidores.map(server => (<div key={server.id} draggable onDragStart={(e) => handleDragStart(e, server.id)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, server.id)} className={`cursor-grab active:cursor-grabbing ${draggedId === server.id ? 'opacity-50' : ''}`}><ServerCard server={server} onEdit={handleEdit} onDelete={handleDelete} view={view} onRefresh={loadServidores} /></div>))}</div>) : (<div className="space-y-2">{filteredServidores.map(server => <ServerCard key={server.id} server={server} onEdit={handleEdit} onDelete={handleDelete} view={view} onRefresh={loadServidores} />)}</div>)}
      {showForm && <ServerForm serverData={editingServer} onSave={editingServer?.id ? handleUpdate : handleCreate} onCancel={handleCloseForm} loading={saving} />}
      {showTemplates && <TemplateSelector type="server" onSelect={handleTemplateSelect} onClose={() => setShowTemplates(false)} />}
    </div>
  );
}
