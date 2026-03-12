import { useState, useEffect } from 'react'
import { getObjetivos } from '../services/supabase'

export const useObjetivos = () => {
  const [objetivos, setObjetivos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchObjetivos = async () => {
    try {
      setLoading(true)
      const data = await getObjetivos()
      setObjetivos(data || [])
      setError(null)
    } catch (err) {
      console.error('Error al cargar objetivos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchObjetivos()
  }, [])

  return { objetivos, loading, error, refetch: fetchObjetivos }
}
