import { useState } from 'react'
import { createObjetivo } from '../../services/supabase'
import './FormObjetivo.css'

const FormObjetivo = ({ onObjetivoCreado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    monto_objetivo: '',
    monto_actual: 0,
    tipo: 'Compartido',
    propietario: null,
    fecha_limite: ''
  })
  const [loading, setLoading] = useState(false)

  const handleTipoChange = (tipo) => {
    setFormData({
      ...formData,
      tipo,
      propietario: tipo === 'Compartido' ? null : 'Juanchi'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.monto_objetivo || Number(formData.monto_objetivo) <= 0) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    try {
      setLoading(true)
      await createObjetivo({
        ...formData,
        monto_objetivo: Number(formData.monto_objetivo),
        monto_actual: Number(formData.monto_actual) || 0,
        fecha_limite: formData.fecha_limite || null
      })
      
      setFormData({
        nombre: '',
        descripcion: '',
        monto_objetivo: '',
        monto_actual: 0,
        tipo: 'Compartido',
        propietario: null,
        fecha_limite: ''
      })
      
      if (onObjetivoCreado) onObjetivoCreado()
    } catch (error) {
      console.error('Error al crear objetivo:', error)
      alert('Error al guardar el objetivo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-objetivo">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nombre del Objetivo *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Vacaciones, Auto nuevo, MacBook..."
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Monto Objetivo *</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={formData.monto_objetivo}
            onChange={(e) => setFormData({ ...formData, monto_objetivo: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Monto Ahorrado Actualmente</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={formData.monto_actual}
            onChange={(e) => setFormData({ ...formData, monto_actual: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha Límite (opcional)</label>
          <input
            type="date"
            className="form-input"
            value={formData.fecha_limite}
            onChange={(e) => setFormData({ ...formData, fecha_limite: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tipo de Objetivo</label>
          <select
            className="form-select"
            value={formData.tipo}
            onChange={(e) => handleTipoChange(e.target.value)}
          >
            <option value="Compartido">Compartido (Juanchi y Flor)</option>
            <option value="Individual">Individual</option>
          </select>
        </div>

        {formData.tipo === 'Individual' && (
          <div className="form-group">
            <label className="form-label">Propietario</label>
            <select
              className="form-select"
              value={formData.propietario || 'Juanchi'}
              onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
            >
              <option value="Juanchi">Juanchi</option>
              <option value="Flor">Flor</option>
              <option value="Emprendimiento">Emprendimiento</option>
            </select>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Descripción (opcional)</label>
        <textarea
          className="form-input"
          placeholder="Describe tu objetivo..."
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          rows="3"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : '🎯 Crear Objetivo'}
      </button>
    </form>
  )
}

export default FormObjetivo
