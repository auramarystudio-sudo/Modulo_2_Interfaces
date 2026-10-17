import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Loader2, AlertTriangle, FolderOpen, ArrowUpDown } from 'lucide-react';
import pb from '../../lib/pocketbase.js';
import ProyectoCard from './ProyectoCard.jsx';
import ProyectoForm from './ProyectoForm.jsx';
import { SearchBar, ViewToggle } from '../common/CommonComponents.jsx';
import ImportExport from '../common/ImportExport.jsx';

export default function ProyectosManager() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [view, setView] = useState('grid');
  const [draggedId, setDraggedId] = useState(null);

  const loadProyectos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const records = await pb.collection('proyectos').getFullList({ sort: '-created' });
      setProyectos(records);
    } catch (err) {
      console.error('Error cargando proyectos:', err);
      setError('No se pudo conectar con PocketBase.');
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProyectos();
  }, [loadProyectos]);

  useEffect(() => {
    const handleOpenForm = () => {
      setEditingProyecto(null);
      setShowForm(true);
    };
    window.addEventListener('open-proyecto-form', handleOpenForm);
    return () => window.removeEventListener('open-proyecto-form', handleOpenForm);
  }, []);

  const filters = useMemo(() => {
    const counts = { corriendo: 0, detenido: 0, error: 0, favorito: 0, nodejs: 0, python: 0, php: 0, static: 0, docker: 0 };
    proyectos.forEach(p => {
      if (p.estado) counts[p.estado] = (counts[p.estado] || 0) + 1;
      if (p.tipo) counts[p.tipo] = (counts[p.tipo] || 0) + 1;
      if (p.favorito) counts.favorito++;
    });
    return [
      { value: 'favorito', label: 'Favoritos', icon: '⭐', count: counts.favorito },
      { value: 'corriendo', label: 'Corriendo', icon: '🟢', count: counts.corriendo },
      { value: 'detenido', label: 'Detenidos', icon: '⚪', count: counts.detenido },
      { value: 'error', label: 'Error', icon: '🔴', count: counts.error },
      { value: 'nodejs', label: 'Node.js', icon: '🟢', count: counts.nodejs },
      { value: 'python', label: 'Python', icon: '🐍', count: counts.python },
      { value: 'php', label: 'PHP', icon: '🐘', count: counts.php },
      { value: 'docker', label: 'Docker', icon: '🐳', count: counts.docker },
    ];
  }, [proyectos]);

  const filteredProyectos = useMemo(() => {
    let result = [...proyectos];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.nombre?.toLowerCase().includes(q) ||
        p.tipo?.toLowerCase().includes(q) ||
        p.ruta?.toLowerCase().includes(q) ||
        p.dominio_local?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'favorito') {
      result = result.filter(p => p.favorito);
    } else if (['corriendo', 'detenido', 'error'].includes(activeFilter)) {
      result = result.filter(p => p.estado === activeFilter);
    } else if (activeFilter) {
      result = result.filter(p => p.tipo === activeFilter);
    }

    result.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));
    return result;
  }, [proyectos, search, activeFilter]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('proyectos').create(data);
      setProyectos(prev => [record, ...prev]);
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
      const record = await pb.collection('proyectos').update(editingProyecto.id, data);
      setProyectos(prev => prev.map(p => p.id === record.id ? record : p));
      setEditingProyecto(null);
      setShowForm(false);
    } catch (err) {
      setError('Error al actualizar: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('proyectos').delete(id);
      setProyectos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleEdit = (proyecto) => {
    setEditingProyecto(proyecto);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProyecto(null);
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
    
    const newOrder = [...proyectos];
    const dragIdx = newOrder.findIndex(p => p.id === draggedId);
    const dropIdx = newOrder.findIndex(p => p.id === targetId);
    
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    
    setProyectos(newOrder);
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

      {!loading && proyectos.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar proyectos..."
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ViewToggle view={view} onChange={setView} />
            <ImportExport type="proyectos" items={proyectos} onImported={loadProyectos} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-4 backdrop-blur-sm">
            <Loader2 size={32} className="text-pink-400 animate-spin" />
          </div>
          <p className="text-sm text-slate-400">Cargando proyectos...</p>
        </div>
      ) : filteredProyectos.length === 0 && proyectos.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 backdrop-blur-sm shadow-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/30 flex items-center justify-center mx-auto mb-6">
            <FolderOpen size={40} className="text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">No hay proyectos registrados</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Añade tu primer proyecto para gestionar aplicaciones locales, dominios virtuales y más.
          </p>
          <button
            onClick={() => { setEditingProyecto(null); setShowForm(true); }}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-medium transition shadow-lg shadow-pink-500/20"
          >
            <Plus size={16} />
            <span>Añadir Primer Proyecto</span>
          </button>
        </div>
      ) : filteredProyectos.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm text-center">
          <p className="text-sm text-slate-400">No se encontraron proyectos con esos filtros.</p>
          <button onClick={() => { setSearch(''); setActiveFilter(null); }} className="text-pink-400 hover:text-pink-300 text-sm mt-2 transition">
            Limpiar filtros
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProyectos.map(proyecto => (
            <div
              key={proyecto.id}
              draggable
              onDragStart={(e) => handleDragStart(e, proyecto.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, proyecto.id)}
              className={`cursor-grab active:cursor-grabbing ${draggedId === proyecto.id ? 'opacity-50' : ''}`}
            >
              <ProyectoCard
                proyecto={proyecto}
                onEdit={handleEdit}
                onDelete={handleDelete}
                view={view}
                onRefresh={loadProyectos}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProyectos.map(proyecto => (
            <ProyectoCard
              key={proyecto.id}
              proyecto={proyecto}
              onEdit={handleEdit}
              onDelete={handleDelete}
              view={view}
              onRefresh={loadProyectos}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ProyectoForm
          proyectoData={editingProyecto}
          onSave={editingProyecto?.id ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
          loading={saving}
        />
      )}
    </div>
  );
}
