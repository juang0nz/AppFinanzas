import { useState } from 'react'
import { deleteDeuda, updateDeuda } from '../../services/supabase'
import { formatCurrency } from '../../utils/helpers'
import './ListaDeudas.css'

const ListaDeudas = ({ deudas, onDeudaModificada }) => {
  const [editando, setEditando] = useState(null)

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta deuda?')) return

    try {
      await deleteDeuda(id)
      if (onDeudaModificada) onDeudaModificada()
    } catch (error) {
      console.error('Error al eliminar deuda:', error)
      alert('Error al eliminar la deuda')
    }
  }

  const handleActualizarPago = async (deuda, campo, valor) => {
    try {
      const actualizado = { ...deuda, [campo]: Number(valor) }
      
      // Si el monto o cuotas están completas, marcar como inactiva
      if (actualizado.monto_pagado >= actualizado.monto_total) {
        actualizado.activa = false
      }
      if (actualizado.cuotas_total && actualizado.cuotas_pagadas >= actualizado.cuotas_total) {
        actualizado.activa = false
      }
      
      await updateDeuda(deuda.id, actualizado)
      setEditando(null)
      if (onDeudaModificada) onDeudaModificada()
    } catch (error) {
      console.error('Error al actualizar deuda:', error)
      alert('Error al actualizar la deuda')
    }
  }

  const handleToggleActiva = async (deuda) => {
    try {
      await updateDeuda(deuda.id, { ...deuda, activa: !deuda.activa })
      if (onDeudaModificada) onDeudaModificada()
    } catch (error) {
      console.error('Error al actualizar deuda:', error)
      alert('Error al actualizar la deuda')
    }
  }

  if (deudas.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No hay deudas registradas</p>
      </div>
    )
  }

  const deudasActivas = deudas.filter(d => d.activa)
  const deudasInactivas = deudas.filter(d => !d.activa)

  const renderDeuda = (deuda) => {
    const montoRestante = deuda.monto_total - deuda.monto_pagado
    const porcentajePagado = (deuda.monto_pagado / deuda.monto_total) * 100
    const cuotasRestantes = deuda.cuotas_total ? deuda.cuotas_total - deuda.cuotas_pagadas : null

    return (
      <div key={deuda.id} className={`deuda-item ${!deuda.activa ? 'deuda-completada' : ''}`}>
        <div className="deuda-header">
          <h3>{deuda.descripcion}</h3>
          <button
            onClick={() => handleToggleActiva(deuda)}
            className={`btn-estado ${deuda.activa ? 'activa' : 'inactiva'}`}
          >
            {deuda.activa ? '⏱ Activa' : '✓ Completada'}
          </button>
        </div>

        <div className="deuda-progreso">
          <div className="progreso-bar">
            <div 
              className="progreso-fill" 
              style={{ width: `${Math.min(porcentajePagado, 100)}%` }}
            ></div>
          </div>
          <span className="progreso-texto">
            {porcentajePagado.toFixed(0)}% pagado
          </span>
        </div>

        <div className="deuda-info">
          <div className="info-row">
            <span>Monto Total:</span>
            <strong>{formatCurrency(deuda.monto_total)}</strong>
          </div>
          <div className="info-row">
            <span>Monto Pagado:</span>
            <div className="info-editable">
              {editando === `${deuda.id}-monto` ? (
                <input
                  type="number"
                  className="input-editar"
                  defaultValue={deuda.monto_pagado}
                  onBlur={(e) => handleActualizarPago(deuda, 'monto_pagado', e.target.value)}
                  autoFocus
                />
              ) : (
                <span 
                  className="valor-editable"
                  onClick={() => setEditando(`${deuda.id}-monto`)}
                >
                  {formatCurrency(deuda.monto_pagado)} ✏️
                </span>
              )}
            </div>
          </div>
          <div className="info-row destacado">
            <span>Falta Pagar:</span>
            <strong className="text-danger">{formatCurrency(montoRestante)}</strong>
          </div>

          {deuda.cuotas_total && (
            <>
              <div className="info-row mt-2">
                <span>Cuotas Pagadas:</span>
                <div className="info-editable">
                  {editando === `${deuda.id}-cuotas` ? (
                    <input
                      type="number"
                      className="input-editar"
                      defaultValue={deuda.cuotas_pagadas}
                      onBlur={(e) => handleActualizarPago(deuda, 'cuotas_pagadas', e.target.value)}
                      max={deuda.cuotas_total}
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="valor-editable"
                      onClick={() => setEditando(`${deuda.id}-cuotas`)}
                    >
                      {deuda.cuotas_pagadas} de {deuda.cuotas_total} ✏️
                    </span>
                  )}
                </div>
              </div>
              {cuotasRestantes > 0 && (
                <div className="info-row">
                  <span>Cuotas Restantes:</span>
                  <strong>{cuotasRestantes}</strong>
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => handleEliminar(deuda.id)}
          className="btn-delete-deuda"
        >
          🗑️ Eliminar
        </button>
      </div>
    )
  }

  return (
    <div className="lista-deudas">
      {deudasActivas.length > 0 && (
        <div className="deudas-seccion">
          <h2>Deudas Activas ({deudasActivas.length})</h2>
          <div className="deudas-grid">
            {deudasActivas.map(renderDeuda)}
          </div>
        </div>
      )}

      {deudasInactivas.length > 0 && (
        <div className="deudas-seccion">
          <h2>Deudas Completadas ({deudasInactivas.length})</h2>
          <div className="deudas-grid">
            {deudasInactivas.map(renderDeuda)}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaDeudas
