import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createIngreso } from '../../services/supabase'
import { TIPO_GASTO } from '../../utils/helpers'
import './FormIngreso.css'

const FormIngreso = ({ mes, anio, onIngresoCreado }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    persona: user?.nombre || 'Juanchi',
    monto: '',
    descripcion: '',
    tipo: TIPO_GASTO.FIJO, // Los ingresos suelen ser fijos (salarios)
    mes,
    anio
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.monto || Number(formData.monto) <= 0) {
      alert('Por favor ingresa un monto válido')
      return
    }

    try {
      setLoading(true)
      await createIngreso({
        ...formData,
        monto: Number(formData.monto)
      })
      
      setFormData({
        persona: user?.nombre || 'Juanchi',
        monto: '',
        descripcion: '',
        tipo: TIPO_GASTO.FIJO,
        mes,
        anio
      })
      
      if (onIngresoCreado) onIngresoCreado()
    } catch (error) {
      console.error('Error al crear ingreso:', error)
      alert('Error al guardar el ingreso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-ingreso">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Persona</label>
          <select
            className="form-select"
            value={formData.persona}
            onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
          >
            <option value="Juanchi">Juanchi</option>
            <option value="Flor">Flor</option>
            <option value="Emprendimiento">Emprendimiento</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Monto *</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Sueldo, Freelance, etc."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select
            className="form-select"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          >
            <option value={TIPO_GASTO.FIJO}>{TIPO_GASTO.FIJO}</option>
            <option value={TIPO_GASTO.VARIABLE}>{TIPO_GASTO.VARIABLE}</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : '➕ Agregar Ingreso'}
      </button>
    </form>
  )
}

export default FormIngreso
