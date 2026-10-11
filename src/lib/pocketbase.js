// Configuración de PocketBase - Conexión a la base de datos real
import PocketBase from 'pocketbase';

// URL del servidor PocketBase (cambiar según tu configuración)
// En producción, reemplazar con la URL real de tu instancia de PocketBase
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Instancia global de PocketBase
const pb = new PocketBase(POCKETBASE_URL);

// Función para verificar la conexión
export async function checkConnection() {
  try {
    await pb.health.check();
    return true;
  } catch (error) {
    console.error('Error de conexión con PocketBase:', error);
    return false;
  }
}

// Exportar la instancia de PocketBase
export default pb;
