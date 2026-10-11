// Punto de entrada de la aplicación con React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Interfaces from './pages/Interfaces.jsx';
import Servidores from './pages/Servidores.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interfaces" element={<Interfaces />} />
          <Route path="/servidores" element={<Servidores />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
