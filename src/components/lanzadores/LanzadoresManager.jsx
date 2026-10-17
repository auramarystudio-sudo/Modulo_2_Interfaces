import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Loader2, AlertTriangle, Terminal, ArrowUpDown } from 'lucide-react';
import pb from '../../lib/pocketbase.js';
import LanzadorCard from './LanzadorCard.jsx';
import LanzadorForm from './LanzadorForm.jsx';
import { SearchBar, ViewToggle } from '../common/CommonComponents.jsx';
import ImportExport from '../common/ImportExport.jsx';
import TemplateSelector from '../common/TemplateSelector.jsx';

export default function LanzadoresManager() {
  const [lanzadores, setLanzadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLanzador, setEditingLanzador] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [view, setView] = useState('grid');
  const [draggedId, setDraggedId] = useState(null);

  const loadLanzadores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const records = await pb.collection('lanzadores').getFullList({ sort: '-created' });
      setLanzadores(records);
    } catch (err) {
      console.error('Error cargando lanzadores:', err);
      setError('No se pudo conectar con PocketBase.');
      setLanzadores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLanzadores();
  }, [loadLanzadores]);

  useEffect(() => {
    const handleOpenForm = () => {
      setEditingLanzador(null);
      setShowTemplates(true);
    };
    window.addEventListener('open-lanzador-form', handleOpenForm);
    return () => window.removeEventListener('open-lanzador-form', handleOpenForm);
  }, []);

  const filters = useMemo(() => {
    const counts = { corriendo: 0, detenido: 0, error: 0, favorito: 0, docker: 0, npm: 0, pocketbase: 0, python: 0, custom: 0 };
    lanzadores.forEach(l => {
      if (l.estado) counts[l.estado] = (counts[l.estado] || 0) + 1;
      if (l.tipo) counts[l.tipo] = (counts[l.tipo] || 0) + 1;
      if (l.favorito) counts.favorito++;
    });
    return [
      { value: 'favorito', label: 'Favoritos', icon: '⭐', count: counts.favorito },
      { value: 'corriendo', label: 'Corriendo', icon: '🟢', count: counts.corriendo },
      { value: 'detenido', label: 'Detenidos', icon: '⚪', count: counts.detenido },
      { value: 'error', label: 'Error', icon: '🔴', count: counts.error },
      { value: 'docker', label: 'Docker', icon: '🐳', count: counts.docker },
      { value: 'npm', label: 'NPM', icon: '📦', count: counts.npm },
      { value: 'pocketbase', label: 'PocketBase', icon: '🗄️', count: counts.pocketbase },
      { value: 'python', label: 'Python', icon: '🐍', count: counts.python },
      { value: 'custom', label: 'Custom', icon: '⚙️', count: counts.custom },
    ];
  }, [lanzadores]);

  const filteredLanzadores = useMemo(() => {
    let result = [...lanzadores];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.nombre?.toLowerCase().includes(q) ||
        l.tipo?.toLowerCase().includes(q) ||
        l.comando?.toLowerCase().includes(q) ||
        l.directorio?.toLowerCase().includes(q) ||
        l.descripcion?.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'favorito') {
      result = result.filter(l => l.favorito);
    } else if (['corriendo', 'detenido', 'error'].includes(activeFilter)) {
      result = result.filter(l => l.estado === activeFilter);
    } else if (activeFilter) {
      result = result.filter(l => l.tipo === activeFilter);
    }

    result.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));
    return result;
  }, [lanzadores, search, activeFilter]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('lanzadores').create(data);
      setLanzadores(prev => [record, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Error al crear: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('lanzadores').update(editingLanzador.id, data);
      setLanzadores(prev => prev.map(l => l.id === record.id ? record : l));
      setEditingLanzador(null);
      setShowForm(false);
    } catch (err) {
      setError('Error al actualizar: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('lanzadores').delete(id);
      setLanzadores(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      setError('Error al eliminar: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleEdit = (lanzador) => {
    setEditingLanzador(lanzador);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLanzador(null);
  };

  const handleTemplateSelect = (template) => {
    setShowTemplates(false);
    setEditingLanzador(template);
    setShowForm(true);
  };

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId === targetId) return;
    
    const newOrder = [...lanzadores];
    const dragIdx = newOrder.findIndex(l => l.id === draggedId);
    const dropIdx = newOrder.findIndex(l => l.id === targetId);
    
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    
    setLanzadores(newOrder);
    setDraggedId(null);
  };

  return (
    <div>
      {error && (
        <div className="flex items-center justify-between bg-red-950/50 border border-red-700/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <span className="text-sm text-red-300">{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 text-sm font-medium transition">Cerrar</button>
        </div>
      )}

      {!loading && lanzadores.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar lanzadores..."
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ViewToggle view={view} onChange={setView} />
            <ImportExport type="lanzadores" items={lanzadores} onImported={loadLanzadores} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4 backdrop-blur-sm">
            <Loader2 size={32} className="text-green-400 animate-spin" />
          </div>
          <p className="text-sm text-slate-400">Cargando lanzadores...</p>
        </div>
      ) : filteredLanzadores.length === 0 && lanzadores.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 backdrop-blur-sm shadow-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-teal-600/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <Terminal size={40} className="text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">No hay lanzadores registrados</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Añade tu primer lanzador o selecciona una plantilla rápida para Docker, NPM, PocketBase y más.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setEditingLanzador(null); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white text-sm font-medium transition shadow-lg shadow-green-500/20"
            >
              <Plus size={16} />
              <span>Crear desde cero</span>
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition border border-slate-700/50"
            >
              <ArrowUpDown size={16} />
              <span>Usar plantilla</span>
            </button>
          </div>
        </div>
      ) : filteredLanzadores.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm text-center">
          <p className="text-sm text-slate-400">No se encontraron lanzadores con esos filtros.</p>
          <button onClick={() => { setSearch(''); setActiveFilter(null); }} className="text-green-400 hover:text-green-300 text-sm mt-2 transition">
            Limpiar filtros
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLanzadores.map(lanzador => (
            <div
              key={lanzador.id}
              draggable
              onDragStart={(e) => handleDragStart(e, lanzador.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, lanzador.id)}
              className={`cursor-grab active:cursor-grabbing ${draggedId === lanzador.id ? 'opacity-50' : ''}`}
            >
              <LanzadorCard
                lanzador={lanzador}
                onEdit={handleEdit}
                onDelete={handleDelete}
                view={view}
                onRefresh={loadLanzadores}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLanzadores.map(lanzador => (
            <LanzadorCard
              key={lanzador.id}
              lanzador={lanzador}
              onEdit={handleEdit}
              onDelete={handleDelete}
              view={view}
              onRefresh={loadLanzadores}
            />
          ))}
        </div>
      )}

      {showForm && (
        <LanzadorForm
          lanzadorData={editingLanzador}
          onSave={editingLanzador?.id ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
          loading={saving}
        />
      )}

      {showTemplates && (
        <TemplateSelector
          type="lanzador"
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}
