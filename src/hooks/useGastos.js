import { useState, useEffect } from 'react'
import { getGastos } from '../services/supabase'

export const useGastos = (mes, anio) => {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGastos = async () => {
    try {
      setLoading(true)
      const data = await getGastos(mes, anio)
      setGastos(data || [])
      setError(null)
    } catch (err) {
      console.error('Error al cargar gastos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGastos()
  }, [mes, anio])

  return { gastos, loading, error, refetch: fetchGastos }
}
