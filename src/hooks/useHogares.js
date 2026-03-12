import { useState, useEffect } from 'react'
import { getHogares, getHogar, crearHogar, agregarMiembroAlHogar, eliminarMiembroDelHogar, getIngresosHogar, getGastosHogar, getDeudasHogar } from '../services/supabase'

export const useHogares = () => {
  const [hogares, setHogares] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHogares = async () => {
    try {
      setLoading(true)
      const data = await getHogares()
      setHogares(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar hogares:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHogares()
  }, [])

  const crear = async (nombre, descripcion) => {
    try {
      await crearHogar(nombre, descripcion)
      await fetchHogares()
    } catch (err) {
      console.error('Error al crear hogar:', err)
      throw err
    }
  }

  const agregarMiembro = async (hogarId, email) => {
    try {
      await agregarMiembroAlHogar(hogarId, email)
      await fetchHogares()
    } catch (err) {
      console.error('Error al agregar miembro:', err)
      throw err
    }
  }

  const eliminarMiembro = async (miembroId) => {
    try {
      await eliminarMiembroDelHogar(miembroId)
      await fetchHogares()
    } catch (err) {
      console.error('Error al eliminar miembro:', err)
      throw err
    }
  }

  return {
    hogares,
    loading,
    error,
    crear,
    agregarMiembro,
    eliminarMiembro,
    refetch: fetchHogares
  }
}

export const useHogarData = (hogarId, mes, anio) => {
  const [ingresos, setIngresos] = useState([])
  const [gastos, setGastos] = useState([])
  const [deudas, setDeudas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!hogarId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [ingresosData, gastosData, deudasData] = await Promise.all([
          getIngresosHogar(hogarId, mes, anio),
          getGastosHogar(hogarId, mes, anio),
          getDeudasHogar(hogarId)
        ])
        
        setIngresos(ingresosData || [])
        setGastos(gastosData || [])
        setDeudas(deudasData || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error al cargar datos del hogar:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [hogarId, mes, anio])

  return {
    ingresos,
    gastos,
    deudas,
    loading,
    error
  }
}
