// Gestor principal de interfaces UI locales
// Conecta con PocketBase para CRUD de interfaces
import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import pb from '../../lib/pocketbase.js';
import InterfaceCard from './InterfaceCard.jsx';
import InterfaceForm from './InterfaceForm.jsx';

export default function InterfacesManager() {
  // Estado de las interfaces
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingInterface, setEditingInterface] = useState(null);

  // Cargar interfaces desde PocketBase
  const loadInterfaces = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const records = await pb.collection('interfaces_ui').getFullList({
        sort: '-created',
      });
      setInterfaces(records);
    } catch (err) {
      console.error('Error cargando interfaces:', err);
      setError('No se pudo conectar con PocketBase. Verifica que el servidor esté activo en http://127.0.0.1:8090');
      // Datos de ejemplo para demostración si no hay conexión
      setInterfaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    loadInterfaces();
  }, [loadInterfaces]);

  // Escuchar evento para abrir formulario desde la página
  useEffect(() => {
    const handleOpenForm = () => {
      setEditingInterface(null);
      setShowForm(true);
    };
    window.addEventListener('open-interface-form', handleOpenForm);
    return () => window.removeEventListener('open-interface-form', handleOpenForm);
  }, []);

  // Crear nueva interfaz
  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('interfaces_ui').create(data);
      setInterfaces(prev => [record, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creando interfaz:', err);
      setError('Error al crear la interfaz: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  // Actualizar interfaz existente
  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const record = await pb.collection('interfaces_ui').update(editingInterface.id, data);
      setInterfaces(prev => prev.map(i => i.id === record.id ? record : i));
      setEditingInterface(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error actualizando interfaz:', err);
      setError('Error al actualizar la interfaz: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  // Eliminar interfaz
  const handleDelete = async (id) => {
    try {
      await pb.collection('interfaces_ui').delete(id);
      setInterfaces(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error eliminando interfaz:', err);
      setError('Error al eliminar la interfaz: ' + (err.message || 'Error desconocido'));
    }
  };

  // Abrir modal de edición
  const handleEdit = (interfaz) => {
    setEditingInterface(interfaz);
    setShowForm(true);
  };

  // Abrir modal de creación
  const handleNew = () => {
    setEditingInterface(null);
    setShowForm(true);
  };

  // Cerrar modal
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInterface(null);
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
          <p className="text-slate-400">Cargando interfaces...</p>
        </div>
      ) : interfaces.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🖥️</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No hay interfaces registradas
          </h3>
          <p className="text-slate-400 max-w-md mb-6">
            Añade tu primera interfaz usando el botón superior.
            Gestiona accesos directos a AUTOMATIC1111, ComfyUI, Forge y más.
          </p>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-5 py-2.5 transition-colors"
          >
            <Plus size={20} />
            Añadir Primera Interfaz
          </button>
        </div>
      ) : (
        /* Grid de interfaces */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interfaces.map(interfaz => (
            <InterfaceCard
              key={interfaz.id}
              interfaz={interfaz}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <InterfaceForm
          interfaceData={editingInterface}
          onSave={editingInterface ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
          loading={saving}
        />
      )}
    </div>
  );
}
