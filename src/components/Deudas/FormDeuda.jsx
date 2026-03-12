import { useState } from 'react'
import { createDeuda } from '../../services/supabase'
import './FormDeuda.css'

const FormDeuda = ({ onDeudaCreada }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    monto_total: '',
    monto_pagado: 0,
    cuotas_total: '',
    cuotas_pagadas: 0
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.descripcion || !formData.monto_total || Number(formData.monto_total) <= 0) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    try {
      setLoading(true)
      await createDeuda({
        ...formData,
        monto_total: Number(formData.monto_total),
        monto_pagado: Number(formData.monto_pagado) || 0,
        cuotas_total: Number(formData.cuotas_total) || null,
        cuotas_pagadas: Number(formData.cuotas_pagadas) || 0,
        activa: true
      })
      
      setFormData({
        descripcion: '',
        monto_total: '',
        monto_pagado: 0,
        cuotas_total: '',
        cuotas_pagadas: 0
      })
      
      if (onDeudaCreada) onDeudaCreada()
    } catch (error) {
      console.error('Error al crear deuda:', error)
      alert('Error al guardar la deuda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-deuda">
      <div className="form-group">
        <label className="form-label">Descripción *</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ej: Tarjeta Visa, Préstamo, etc."
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Monto Total *</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={formData.monto_total}
            onChange={(e) => setFormData({ ...formData, monto_total: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Monto Pagado</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={formData.monto_pagado}
            onChange={(e) => setFormData({ ...formData, monto_pagado: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Cuotas Totales</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={formData.cuotas_total}
            onChange={(e) => setFormData({ ...formData, cuotas_total: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cuotas Pagadas</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={formData.cuotas_pagadas}
            onChange={(e) => setFormData({ ...formData, cuotas_pagadas: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : '➕ Agregar Deuda'}
      </button>
    </form>
  )
}

export default FormDeuda
