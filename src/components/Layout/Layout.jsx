import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import ThemeSelector from '../common/ThemeSelector'
import './Layout.css'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const handleLogout = async () => {
    try {
      await logout()
      // Forzar recarga para ir al login
      window.location.href = '/login'
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="logo">💰 Finanzas en Pareja</h1>
          <div className="header-user">
            <ThemeSelector />
            <span>👤 {user?.nombre || user?.email}</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <nav className="navbar">
        <div className="container">
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              📊 Dashboard
            </Link>
            <Link to="/hogar" className={`nav-link ${isActive('/hogar')}`}>
              🏠 Hogar
            </Link>
            <Link to="/ingresos" className={`nav-link ${isActive('/ingresos')}`}>
              💵 Ingresos
            </Link>
            <Link to="/gastos" className={`nav-link ${isActive('/gastos')}`}>
              💸 Gastos
            </Link>
            <Link to="/deudas" className={`nav-link ${isActive('/deudas')}`}>
              💳 Deudas
            </Link>
            <Link to="/objetivos" className={`nav-link ${isActive('/objetivos')}`}>
              🎯 Objetivos
            </Link>
            <Link to="/emprendimiento" className={`nav-link ${isActive('/emprendimiento')}`}>
              💼 Emprendimiento
            </Link>
            <Link to="/estadisticas" className={`nav-link ${isActive('/estadisticas')}`}>
              📈 Estadísticas
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="text-center text-muted">
            Finanzas en Pareja © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
