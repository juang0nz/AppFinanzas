import { useState, useEffect } from 'react'

// Usuarios permitidos (Juanchi y Flor)
const USUARIOS = [
  {
    id: '1',
    email: 'juanchi@finanzas.com',
    password: 'juanchi123',
    nombre: 'Juanchi'
  },
  {
    id: '2',
    email: 'flor@finanzas.com',
    password: 'flor123',
    nombre: 'Flor'
  }
]

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar si hay sesión guardada en localStorage
    const sesionGuardada = localStorage.getItem('finanzas_usuario')
    if (sesionGuardada) {
      try {
        const usuarioGuardado = JSON.parse(sesionGuardada)
        setUser(usuarioGuardado)
      } catch (err) {
        console.error('Error recuperando sesión:', err)
        localStorage.removeItem('finanzas_usuario')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      // Buscar usuario en la lista
      const usuarioEncontrado = USUARIOS.find(
        u => u.email === email && u.password === password
      )

      if (!usuarioEncontrado) {
        throw new Error('Credenciales incorrectas')
      }

      // Crear objeto de usuario (sin la contraseña)
      const usuarioData = {
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        nombre: usuarioEncontrado.nombre
      }

      // Guardar en localStorage
      localStorage.setItem('finanzas_usuario', JSON.stringify(usuarioData))
      setUser(usuarioData)
      
      return usuarioData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      localStorage.removeItem('finanzas_usuario')
      setUser(null)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }
}
