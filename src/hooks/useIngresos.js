import { useState, useEffect } from 'react'
import { getIngresos } from '../services/supabase'

export const useIngresos = (mes, anio) => {
  const [ingresos, setIngresos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchIngresos = async () => {
    try {
      setLoading(true)
      const data = await getIngresos(mes, anio)
      setIngresos(data || [])
      setError(null)
    } catch (err) {
      console.error('Error al cargar ingresos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIngresos()
  }, [mes, anio])

  return { ingresos, loading, error, refetch: fetchIngresos }
}
