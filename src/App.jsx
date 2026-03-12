import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import IngresosPage from './pages/IngresosPage'
import GastosPage from './pages/GastosPage'
import DeudasPage from './pages/DeudasPage'
import EstadisticasPage from './pages/EstadisticasPage'
import HogarCompartidoPage from './pages/HogarCompartidoPage'
import ObjetivosPage from './pages/ObjetivosPage'
import EmprendimientoPage from './pages/EmprendimientoPage'
import LoginPage from './pages/LoginPage'
import Loading from './components/common/Loading'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return (
    <Router>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ingresos" element={<IngresosPage />} />
            <Route path="/gastos" element={<GastosPage />} />
            <Route path="/deudas" element={<DeudasPage />} />
            <Route path="/objetivos" element={<ObjetivosPage />} />
            <Route path="/estadisticas" element={<EstadisticasPage />} />
            <Route path="/hogar" element={<HogarCompartidoPage />} />
            <Route path="/emprendimiento" element={<EmprendimientoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  )
}

export default App
