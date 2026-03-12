import { useState, useEffect } from 'react'
import { getAvisos, marcarAvisoComoLeido, deleteAviso, marcarTodosAvisosComoLeidos } from '../services/supabase'

export const useAvisos = (soloNoLeidos = false) => {
  const [avisos, setAvisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAvisos = async () => {
    try {
      setLoading(true)
      const data = await getAvisos(soloNoLeidos)
      setAvisos(data || [])
      setError(null)
    } catch (err) {
      console.error('Error al cargar avisos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvisos()
  }, [soloNoLeidos])

  const marcarLeido = async (id) => {
    try {
      await marcarAvisoComoLeido(id)
      await fetchAvisos()
    } catch (err) {
      console.error('Error al marcar aviso como leído:', err)
      throw err
    }
  }

  const eliminarAviso = async (id) => {
    try {
      await deleteAviso(id)
      await fetchAvisos()
    } catch (err) {
      console.error('Error al eliminar aviso:', err)
      throw err
    }
  }

  const marcarTodosLeidos = async () => {
    try {
      await marcarTodosAvisosComoLeidos()
      await fetchAvisos()
    } catch (err) {
      console.error('Error al marcar todos como leídos:', err)
      throw err
    }
  }

  const avisosNoLeidos = avisos.filter(aviso => !aviso.leido).length

  return {
    avisos,
    loading,
    error,
    avisosNoLeidos,
    marcarLeido,
    eliminarAviso,
    marcarTodosLeidos,
    refetch: fetchAvisos
  }
}
