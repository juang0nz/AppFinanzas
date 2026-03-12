import { useState, useEffect } from 'react'
import { getDeudas } from '../services/supabase'

export const useDeudas = () => {
  const [deudas, setDeudas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDeudas = async () => {
    try {
      setLoading(true)
      const data = await getDeudas()
      setDeudas(data || [])
      setError(null)
    } catch (err) {
      console.error('Error al cargar deudas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeudas()
  }, [])

  return { deudas, loading, error, refetch: fetchDeudas }
}
