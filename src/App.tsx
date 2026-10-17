import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Interfaces from './pages/Interfaces.jsx';
import Servidores from './pages/Servidores.jsx';
import Lanzadores from './pages/Lanzadores.jsx';
import Herramientas from './pages/Herramientas.jsx';
import Sesiones from './pages/Sesiones.jsx';
import KeyboardShortcuts from './components/shortcuts/KeyboardShortcuts.jsx';
import GuidedTour from './components/tour/GuidedTour.jsx';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interfaces" element={<Interfaces />} />
          <Route path="/servidores" element={<Servidores />} />
          <Route path="/lanzadores" element={<Lanzadores />} />
          <Route path="/herramientas" element={<Herramientas />} />
          <Route path="/sesiones" element={<Sesiones />} />
        </Routes>
        <KeyboardShortcuts />
        <GuidedTour />
      </Layout>
    </HashRouter>
  );
}
