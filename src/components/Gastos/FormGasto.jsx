import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createGasto } from '../../services/supabase'
import { CATEGORIAS_GASTOS, TIPO_GASTO } from '../../utils/helpers'
import './FormGasto.css'

const FormGasto = ({ mes, anio, onGastoCreado }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    categoria: CATEGORIAS_GASTOS[0],
    tipo: TIPO_GASTO.FIJO,
    pagado: false,
    persona: user?.nombre || 'Juanchi',
    mes,
    anio
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.descripcion || !formData.monto || Number(formData.monto) <= 0) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    try {
      setLoading(true)
      await createGasto({
        ...formData,
        monto: Number(formData.monto)
      })
      
      setFormData({
        descripcion: '',
        monto: '',
        categoria: CATEGORIAS_GASTOS[0],
        tipo: TIPO_GASTO.FIJO,
        pagado: false,
        persona: user?.nombre || 'Juanchi',
        mes,
        anio
      })
      
      if (onGastoCreado) onGastoCreado()
    } catch (error) {
      console.error('Error al crear gasto:', error)
      alert('Error al guardar el gasto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-gasto">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Descripción *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Alquiler, Supermercado, etc."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
          />
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
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          >
            {CATEGORIAS_GASTOS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.pagado}
              onChange={(e) => setFormData({ ...formData, pagado: e.target.checked })}
            />
            <span>Marcar como pagado</span>
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : '➕ Agregar Gasto'}
      </button>
    </form>
  )
}

export default FormGasto
