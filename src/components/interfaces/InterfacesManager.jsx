import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Loader2, AlertTriangle, MonitorX, ArrowUpDown } from 'lucide-react';
import pb from '../../lib/pocketbase.js';
import InterfaceCard from './InterfaceCard.jsx';
import InterfaceForm from './InterfaceForm.jsx';
import { SearchBar, ViewToggle } from '../common/CommonComponents.jsx';
import ImportExport from '../common/ImportExport.jsx';
import TemplateSelector from '../common/TemplateSelector.jsx';

export default function InterfacesManager() {
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingInterface, setEditingInterface] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [view, setView] = useState('grid');
  const [draggedId, setDraggedId] = useState(null);

  const loadInterfaces = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const records = await pb.collection('interfaces_ui').getFullList({ sort: '-created' });
      setInterfaces(records);
    } catch (err) {
      console.error('Error cargando interfaces:', err);
      setError('No se pudo conectar con PocketBase.');
      setInterfaces([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadInterfaces(); }, [loadInterfaces]);
  useEffect(() => {
    const handleOpenForm = () => { setEditingInterface(null); setShowTemplates(true); };
    window.addEventListener('open-interface-form', handleOpenForm);
    return () => window.removeEventListener('open-interface-form', handleOpenForm);
  }, []);

  const filters = useMemo(() => {
    const counts = { activo: 0, inactivo: 0, mantenimiento: 0, favorito: 0 };
    interfaces.forEach(i => {
      if (i.estado) counts[i.estado] = (counts[i.estado] || 0) + 1;
      if (i.favorito) counts.favorito++;
    });
    return [
      { value: 'favorito', label: 'Favoritos', icon: '⭐', count: counts.favorito },
      { value: 'activo', label: 'Activos', icon: '🟢', count: counts.activo },
      { value: 'inactivo', label: 'Inactivos', icon: '🔴', count: counts.inactivo },
      { value: 'mantenimiento', label: 'Mantenimiento', icon: '🟡', count: counts.mantenimiento },
    ];
  }, [interfaces]);

  const filteredInterfaces = useMemo(() => {
    let result = [...interfaces];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i => i.nombre?.toLowerCase().includes(q) || i.tipo?.toLowerCase().includes(q) || i.descripcion?.toLowerCase().includes(q));
    }
    if (activeFilter === 'favorito') result = result.filter(i => i.favorito);
    else if (activeFilter) result = result.filter(i => i.estado === activeFilter);
    result.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));
    return result;
  }, [interfaces, search, activeFilter]);

  const handleCreate = async (data) => {
    setSaving(true);
    try { const record = await pb.collection('interfaces_ui').create(data); setInterfaces(prev => [record, ...prev]); setShowForm(false); }
    catch (err) { setError('Error al crear: ' + (err.message || 'Error desconocido')); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try { const record = await pb.collection('interfaces_ui').update(editingInterface.id, data); setInterfaces(prev => prev.map(i => i.id === record.id ? record : i)); setEditingInterface(null); setShowForm(false); }
    catch (err) { setError('Error al actualizar: ' + (err.message || 'Error desconocido')); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await pb.collection('interfaces_ui').delete(id); setInterfaces(prev => prev.filter(i => i.id !== id)); }
    catch (err) { setError('Error al eliminar: ' + (err.message || 'Error desconocido')); }
  };

  const handleEdit = (interfaz) => { setEditingInterface(interfaz); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditingInterface(null); };

  const handleTemplateSelect = (template) => {
    setShowTemplates(false);
    setEditingInterface(template);
    setShowForm(true);
  };

  const handleDragStart = (e, id) => { setDraggedId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId === targetId) return;
    const newOrder = [...interfaces];
    const dragIdx = newOrder.findIndex(i => i.id === draggedId);
    const dropIdx = newOrder.findIndex(i => i.id === targetId);
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    setInterfaces(newOrder);
    setDraggedId(null);
  };

  return (
    <div>
      {error && (
        <div className="flex items-center justify-between bg-red-950/50 border border-red-700/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center"><AlertTriangle size={16} className="text-red-400" /></div>
            <span className="text-sm text-red-300">{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 text-sm font-medium transition">Cerrar</button>
        </div>
      )}
      {!loading && interfaces.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Buscar interfaces..." filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} /></div>
          <div className="flex items-center gap-2 shrink-0">
            <ViewToggle view={view} onChange={setView} />
            <ImportExport type="interfaces" items={interfaces} onImported={loadInterfaces} />
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 backdrop-blur-sm"><Loader2 size={32} className="text-cyan-400 animate-spin" /></div>
          <p className="text-sm text-slate-400">Cargando interfaces...</p>
        </div>
      ) : filteredInterfaces.length === 0 && interfaces.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 backdrop-blur-sm shadow-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6"><MonitorX size={40} className="text-cyan-400" /></div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">No hay interfaces registradas</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Añade tu primera interfaz o selecciona una plantilla rápida.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => { setEditingInterface(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg shadow-cyan-500/20"><Plus size={16} /><span>Crear desde cero</span></button>
            <button onClick={() => setShowTemplates(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition border border-slate-700/50"><ArrowUpDown size={16} /><span>Usar plantilla</span></button>
          </div>
        </div>
      ) : filteredInterfaces.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm text-center">
          <p className="text-sm text-slate-400">No se encontraron interfaces con esos filtros.</p>
          <button onClick={() => { setSearch(''); setActiveFilter(null); }} className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 transition">Limpiar filtros</button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInterfaces.map(interfaz => (
            <div key={interfaz.id} draggable onDragStart={(e) => handleDragStart(e, interfaz.id)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, interfaz.id)} className={`cursor-grab active:cursor-grabbing ${draggedId === interfaz.id ? 'opacity-50' : ''}`}>
              <InterfaceCard interfaz={interfaz} onEdit={handleEdit} onDelete={handleDelete} view={view} onRefresh={loadInterfaces} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredInterfaces.map(interfaz => <InterfaceCard key={interfaz.id} interfaz={interfaz} onEdit={handleEdit} onDelete={handleDelete} view={view} onRefresh={loadInterfaces} />)}
        </div>
      )}
      {showForm && <InterfaceForm interfaceData={editingInterface} onSave={editingInterface?.id ? handleUpdate : handleCreate} onCancel={handleCloseForm} loading={saving} />}
      {showTemplates && <TemplateSelector type="interface" onSelect={handleTemplateSelect} onClose={() => setShowTemplates(false)} />}
    </div>
  );
}
