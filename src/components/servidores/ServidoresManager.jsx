// Gestor principal de servidores de red local
// Conecta con PocketBase para CRUD de servidores
import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import pb from '../../lib/pocketbase.js';
import ServerCard from './ServerCard.jsx';
import ServerForm from './ServerForm.jsx';

export default function ServidoresManager() {
  // Estado de los servidores
  const [servidores, setServidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingServer, setEditingServer] = useState(null);

  // Cargar servidores desde PocketBase
  const loadServidores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const records = await pb.collection('servidores_red').getFullList({
        sort: '-created',
      });
      setServidores(records);
    } catch (err) {
      console.error('Error cargando servidores:', err);
      setError('No se pudo conectar con PocketBase. Verifica que el servidor esté activo en http://127.0.0.1:8090');
      // Estado vacío si no hay conexión
      setServidores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    loadServidores();
  }, [loadServidores]);

  // Escuchar evento para abrir formulario desde la página
  useEffect(() => {
    const handleOpenForm = () => {
      setEditingServer(null);
      setShowForm(true);
    };
    window.addEventListener('open-server-form', handleOpenForm);
    return () => window.removeEventListener('open-server-form', handleOpenForm);
  }, []);

  // Crear nuevo servidor
  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('servidores_red').create(data);
      setServidores(prev => [record, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creando servidor:', err);
      setError('Error al crear el servidor: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  // Actualizar servidor existente
  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('servidores_red').update(editingServer.id, data);
      setServidores(prev => prev.map(s => s.id === record.id ? record : s));
      setEditingServer(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error actualizando servidor:', err);
      setError('Error al actualizar el servidor: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  // Eliminar servidor
  const handleDelete = async (id) => {
    try {
      await pb.collection('servidores_red').delete(id);
      setServidores(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error eliminando servidor:', err);
      setError('Error al eliminar el servidor: ' + (err.message || 'Error desconocido'));
    }
  };

  // Abrir modal de edición
  const handleEdit = (server) => {
    setEditingServer(server);
    setShowForm(true);
  };

  // Abrir modal de creación
  const handleNew = () => {
    setEditingServer(null);
    setShowForm(true);
  };

  // Cerrar modal
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingServer(null);
  };

  return (
    <div>
      {/* Barra de error */}
      {error && (
        <div className="flex items-center justify-between bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-400 shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Estado de carga */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
          <p className="text-slate-400">Cargando servidores...</p>
        </div>
      ) : servidores.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No hay servidores registrados
          </h3>
          <p className="text-slate-400 max-w-md mb-6">
            Añade tu primer servidor usando el botón superior.
            Gestiona accesos a Ollama, SillyTavern, KoboldCpp y más desde tu red local.
          </p>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-5 py-2.5 transition-colors"
          >
            <Plus size={20} />
            Registrar Primer Servidor
          </button>
        </div>
      ) : (
        /* Grid de servidores */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servidores.map(server => (
            <ServerCard
              key={server.id}
              server={server}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <ServerForm
          serverData={editingServer}
          onSave={editingServer ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
          loading={saving}
        />
      )}
    </div>
  );
}
