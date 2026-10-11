// Formulario Modal para crear/editar interfaces UI locales
import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

// Opciones de tipo de interfaz
const TIPOS_INTERFAZ = [
  { value: 'automatic1111', label: 'AUTOMATIC1111 WebUI' },
  { value: 'comfyui', label: 'ComfyUI' },
  { value: 'forge', label: 'Forge' },
  { value: 'fooocus', label: 'Fooocus' },
  { value: 'sdnext', label: 'SD.Next' },
  { value: 'otra', label: 'Otra' },
];

// Opciones de estado
const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
];

export default function InterfaceForm({ interfaceData, onSave, onCancel, loading }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'automatic1111',
    url_local: '',
    puerto: '',
    comando_lanzamiento: '',
    descripcion: '',
    estado: 'activo',
  });

  const [error, setError] = useState('');

  // Si se pasa una interfaz existente, rellenar el formulario
  useEffect(() => {
    if (interfaceData) {
      setFormData({
        nombre: interfaceData.nombre || '',
        tipo: interfaceData.tipo || 'automatic1111',
        url_local: interfaceData.url_local || '',
        puerto: interfaceData.puerto || '',
        comando_lanzamiento: interfaceData.comando_lanzamiento || '',
        descripcion: interfaceData.descripcion || '',
        estado: interfaceData.estado || 'activo',
      });
    }
  }, [interfaceData]);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Limpiar error al editar
  };

  // Validar y enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!formData.url_local.trim()) {
      setError('La URL local es obligatoria');
      return;
    }
    if (!formData.puerto) {
      setError('El puerto es obligatorio');
      return;
    }

    // Preparar datos para enviar
    const dataToSave = {
      ...formData,
      puerto: parseInt(formData.puerto, 10),
    };

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {interfaceData ? 'Editar Interfaz' : 'Nueva Interfaz'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo del formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mensaje de error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 rounded-lg p-3">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: AUTOMATIC1111"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Tipo de Interfaz *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              required
            >
              {TIPOS_INTERFAZ.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* URL Local */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              URL Local *
            </label>
            <input
              type="url"
              name="url_local"
              value={formData.url_local}
              onChange={handleChange}
              placeholder="Ej: http://127.0.0.1:7860"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
              required
            />
          </div>

          {/* Puerto */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Puerto *
            </label>
            <input
              type="number"
              name="puerto"
              value={formData.puerto}
              onChange={handleChange}
              placeholder="Ej: 7860"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
              required
            />
          </div>

          {/* Comando de Lanzamiento */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Comando de Lanzamiento
            </label>
            <input
              type="text"
              name="comando_lanzamiento"
              value={formData.comando_lanzamiento}
              onChange={handleChange}
              placeholder="Ej: webui-user.bat --xformers --api"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            >
              {ESTADOS.map(estado => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción opcional de la interfaz..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400 resize-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
