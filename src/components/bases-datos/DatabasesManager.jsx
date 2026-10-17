import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Loader2, AlertTriangle, Database, ArrowUpDown } from 'lucide-react';
import pb from '../../lib/pocketbase.js';
import DatabaseCard from './DatabaseCard.jsx';
import DatabaseForm from './DatabaseForm.jsx';
import { SearchBar, ViewToggle } from '../common/CommonComponents.jsx';
import ImportExport from '../common/ImportExport.jsx';

export default function DatabasesManager() {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDatabase, setEditingDatabase] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [view, setView] = useState('grid');
  const [draggedId, setDraggedId] = useState(null);

  const loadDatabases = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const records = await pb.collection('bases_datos').getFullList({ sort: '-created' });
      setDatabases(records);
    } catch (err) {
      console.error('Error cargando bases de datos:', err);
      setError('No se pudo conectar con PocketBase.');
      setDatabases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabases();
  }, [loadDatabases]);

  useEffect(() => {
    const handleOpenForm = () => {
      setEditingDatabase(null);
      setShowForm(true);
    };
    window.addEventListener('open-database-form', handleOpenForm);
    return () => window.removeEventListener('open-database-form', handleOpenForm);
  }, []);

  const filters = useMemo(() => {
    const counts = { corriendo: 0, detenido: 0, error: 0, favorito: 0, sqlite: 0, postgresql: 0, mysql: 0, mongodb: 0, redis: 0 };
    databases.forEach(db => {
      if (db.estado) counts[db.estado] = (counts[db.estado] || 0) + 1;
      if (db.tipo) counts[db.tipo] = (counts[db.tipo] || 0) + 1;
      if (db.favorito) counts.favorito++;
    });
    return [
      { value: 'favorito', label: 'Favoritos', icon: '⭐', count: counts.favorito },
      { value: 'corriendo', label: 'Corriendo', icon: '🟢', count: counts.corriendo },
      { value: 'detenido', label: 'Detenidos', icon: '⚪', count: counts.detenido },
      { value: 'error', label: 'Error', icon: '🔴', count: counts.error },
      { value: 'postgresql', label: 'PostgreSQL', icon: '🐘', count: counts.postgresql },
      { value: 'mysql', label: 'MySQL', icon: '🐬', count: counts.mysql },
      { value: 'mongodb', label: 'MongoDB', icon: '🍃', count: counts.mongodb },
      { value: 'redis', label: 'Redis', icon: '🔴', count: counts.redis },
      { value: 'sqlite', label: 'SQLite', icon: '📦', count: counts.sqlite },
    ];
  }, [databases]);

  const filteredDatabases = useMemo(() => {
    let result = [...databases];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(db =>
        db.nombre?.toLowerCase().includes(q) ||
        db.tipo?.toLowerCase().includes(q) ||
        db.nombre_bd?.toLowerCase().includes(q) ||
        db.host?.toLowerCase().includes(q) ||
        db.descripcion?.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'favorito') {
      result = result.filter(db => db.favorito);
    } else if (['corriendo', 'detenido', 'error'].includes(activeFilter)) {
      result = result.filter(db => db.estado === activeFilter);
    } else if (activeFilter) {
      result = result.filter(db => db.tipo === activeFilter);
    }

    result.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));
    return result;
  }, [databases, search, activeFilter]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('bases_datos').create(data);
      setDatabases(prev => [record, ...prev]);
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
      const record = await pb.collection('bases_datos').update(editingDatabase.id, data);
      setDatabases(prev => prev.map(db => db.id === record.id ? record : db));
      setEditingDatabase(null);
      setShowForm(false);
    } catch (err) {
      setError('Error al actualizar: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('bases_datos').delete(id);
      setDatabases(prev => prev.filter(db => db.id !== id));
    } catch (err) {
      setError('Error al eliminar: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleEdit = (database) => {
    setEditingDatabase(database);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDatabase(null);
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
    
    const newOrder = [...databases];
    const dragIdx = newOrder.findIndex(db => db.id === draggedId);
    const dropIdx = newOrder.findIndex(db => db.id === targetId);
    
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    
    setDatabases(newOrder);
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

      {!loading && databases.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar bases de datos..."
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ViewToggle view={view} onChange={setView} />
            <ImportExport type="bases_datos" items={databases} onImported={loadDatabases} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 backdrop-blur-sm">
            <Loader2 size={32} className="text-teal-400 animate-spin" />
          </div>
          <p className="text-sm text-slate-400">Cargando bases de datos...</p>
        </div>
      ) : filteredDatabases.length === 0 && databases.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 backdrop-blur-sm shadow-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-600/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-6">
            <Database size={40} className="text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">No hay bases de datos registradas</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Añade tu primera base de datos para gestionar conexiones PostgreSQL, MySQL, MongoDB y más.
          </p>
          <button
            onClick={() => { setEditingDatabase(null); setShowForm(true); }}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-sm font-medium transition shadow-lg shadow-teal-500/20"
          >
            <Plus size={16} />
            <span>Añadir Primera Base de Datos</span>
          </button>
        </div>
      ) : filteredDatabases.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm text-center">
          <p className="text-sm text-slate-400">No se encontraron bases de datos con esos filtros.</p>
          <button onClick={() => { setSearch(''); setActiveFilter(null); }} className="text-teal-400 hover:text-teal-300 text-sm mt-2 transition">
            Limpiar filtros
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDatabases.map(database => (
            <div
              key={database.id}
              draggable
              onDragStart={(e) => handleDragStart(e, database.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, database.id)}
              className={`cursor-grab active:cursor-grabbing ${draggedId === database.id ? 'opacity-50' : ''}`}
            >
              <DatabaseCard
                database={database}
                onEdit={handleEdit}
                onDelete={handleDelete}
                view={view}
                onRefresh={loadDatabases}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDatabases.map(database => (
            <DatabaseCard
              key={database.id}
              database={database}
              onEdit={handleEdit}
              onDelete={handleDelete}
              view={view}
              onRefresh={loadDatabases}
            />
          ))}
        </div>
      )}

      {showForm && (
        <DatabaseForm
          databaseData={editingDatabase}
          onSave={editingDatabase?.id ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
          loading={saving}
        />
      )}
    </div>
  );
}
