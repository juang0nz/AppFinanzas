import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import './LoginPage.css'

const LoginPage = () => {
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formError, setFormError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    // Validaciones
    if (!formData.email || !formData.password) {
      setFormError('Por favor completa todos los campos')
      return
    }

    try {
      await login(formData.email, formData.password)
      // Forzar recarga para ir al home
      window.location.href = '/'
    } catch (err) {
      setFormError(err.message || 'Email o contraseña incorrectos')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>💰 Finanzas en Pareja</h1>
          <p>Inicia sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {(formError || error) && (
            <div className="error-message">
              {formError || error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
