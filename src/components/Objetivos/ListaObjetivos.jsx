import { useState } from 'react'
import { updateObjetivo, deleteObjetivo } from '../../services/supabase'
import './ListaObjetivos.css'

const ListaObjetivos = ({ objetivos, onObjetivoModificado }) => {
  const [editando, setEditando] = useState(null)
  const [montoAAgregar, setMontoAAgregar] = useState('')

  const calcularProgreso = (actual, objetivo) => {
    if (objetivo === 0) return 0
    return Math.min((actual / objetivo) * 100, 100)
  }

  const handleAgregarMonto = async (objetivo) => {
    if (!montoAAgregar || Number(montoAAgregar) <= 0) {
      alert('Ingresa un monto válido')
      return
    }

    try {
      const nuevoMontoActual = Number(objetivo.monto_actual) + Number(montoAAgregar)
      const completado = nuevoMontoActual >= Number(objetivo.monto_objetivo)

      await updateObjetivo(objetivo.id, {
        monto_actual: nuevoMontoActual,
        completado
      })

      setEditando(null)
      setMontoAAgregar('')
      if (onObjetivoModificado) onObjetivoModificado()
    } catch (error) {
      console.error('Error al actualizar objetivo:', error)
      alert('Error al actualizar el objetivo')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este objetivo?')) return

    try {
      await deleteObjetivo(id)
      if (onObjetivoModificado) onObjetivoModificado()
    } catch (error) {
      console.error('Error al eliminar objetivo:', error)
      alert('Error al eliminar el objetivo')
    }
  }

  const handleMarcarCompletado = async (objetivo) => {
    try {
      await updateObjetivo(objetivo.id, {
        completado: !objetivo.completado,
        monto_actual: objetivo.completado ? objetivo.monto_actual : objetivo.monto_objetivo
      })
      if (onObjetivoModificado) onObjetivoModificado()
    } catch (error) {
      console.error('Error al actualizar objetivo:', error)
      alert('Error al actualizar el objetivo')
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return 'Sin fecha límite'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getDiasRestantes = (fecha) => {
    if (!fecha) return null
    const hoy = new Date()
    const limite = new Date(fecha)
    const diff = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
    return diff
  }

  if (!objetivos || objetivos.length === 0) {
    return (
      <div className="card">
        <p className="text-muted">No hay objetivos creados todavía. Crea tu primer objetivo arriba.</p>
      </div>
    )
  }

  // Separar objetivos por tipo
  const objetivosCompartidos = objetivos.filter(o => o.tipo === 'Compartido')
  const objetivosJuanchi = objetivos.filter(o => o.tipo === 'Individual' && o.propietario === 'Juanchi')
  const objetivosFlor = objetivos.filter(o => o.tipo === 'Individual' && o.propietario === 'Flor')
  const objetivosEmprendimiento = objetivos.filter(o => o.tipo === 'Individual' && o.propietario === 'Emprendimiento')

  const renderObjetivo = (objetivo) => {
    const progreso = calcularProgreso(objetivo.monto_actual, objetivo.monto_objetivo)
    const diasRestantes = getDiasRestantes(objetivo.fecha_limite)
    const isCompletado = objetivo.completado || progreso >= 100

    return (
      <div key={objetivo.id} className={`objetivo-card ${isCompletado ? 'completado' : ''}`}>
        <div className="objetivo-header">
          <div className="objetivo-info">
            <h4 className="objetivo-nombre">{objetivo.nombre}</h4>
            {objetivo.descripcion && <p className="objetivo-descripcion">{objetivo.descripcion}</p>}
          </div>
          <div className="objetivo-acciones">
            <button
              onClick={() => handleMarcarCompletado(objetivo)}
              className="btn-icono"
              title={isCompletado ? 'Marcar como incompleto' : 'Marcar como completado'}
            >
              {isCompletado ? '✓' : '○'}
            </button>
            <button
              onClick={() => handleEliminar(objetivo.id)}
              className="btn-icono btn-eliminar"
              title="Eliminar objetivo"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="objetivo-progreso-container">
          <div className="objetivo-montos">
            <span className="monto-actual">${Number(objetivo.monto_actual).toLocaleString('es-UY')}</span>
            <span className="monto-separador">/</span>
            <span className="monto-objetivo">${Number(objetivo.monto_objetivo).toLocaleString('es-UY')}</span>
          </div>
          <div className="progreso-bar">
            <div 
              className="progreso-fill" 
              style={{ width: `${progreso}%` }}
            >
              {progreso > 10 && <span className="progreso-texto">{Math.round(progreso)}%</span>}
            </div>
          </div>
        </div>

        <div className="objetivo-detalles">
          <div className="objetivo-fecha">
            <span className="fecha-label">Fecha límite:</span>
            <span className={diasRestantes !== null && diasRestantes < 30 ? 'fecha-valor fecha-proxima' : 'fecha-valor'}>
              {formatFecha(objetivo.fecha_limite)}
              {diasRestantes !== null && diasRestantes > 0 && (
                <span className="dias-restantes"> ({diasRestantes} días)</span>
              )}
              {diasRestantes !== null && diasRestantes <= 0 && (
                <span className="dias-restantes vencido"> (¡Vencido!)</span>
              )}
            </span>
          </div>
        </div>

        {!isCompletado && (
          <div className="objetivo-agregar">
            {editando === objetivo.id ? (
              <div className="agregar-monto-form">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Monto a agregar"
                  value={montoAAgregar}
                  onChange={(e) => setMontoAAgregar(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => handleAgregarMonto(objetivo)}
                  className="btn btn-primary btn-sm"
                >
                  ✓ Agregar
                </button>
                <button
                  onClick={() => {
                    setEditando(null)
                    setMontoAAgregar('')
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditando(objetivo.id)}
                className="btn btn-secondary btn-sm"
              >
                💰 Agregar dinero
              </button>
            )}
          </div>
        )}

        {isCompletado && (
          <div className="objetivo-completado-badge">
            🎉 ¡Objetivo Alcanzado!
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="lista-objetivos">
      {objetivosCompartidos.length > 0 && (
        <div className="objetivos-seccion">
          <h3 className="seccion-titulo">💑 Objetivos Compartidos</h3>
          <div className="objetivos-grid">
            {objetivosCompartidos.map(renderObjetivo)}
          </div>
        </div>
      )}

      {objetivosJuanchi.length > 0 && (
        <div className="objetivos-seccion">
          <h3 className="seccion-titulo">👤 Objetivos de Juanchi</h3>
          <div className="objetivos-grid">
            {objetivosJuanchi.map(renderObjetivo)}
          </div>
        </div>
      )}

      {objetivosFlor.length > 0 && (
        <div className="objetivos-seccion">
          <h3 className="seccion-titulo">👤 Objetivos de Flor</h3>
          <div className="objetivos-grid">
            {objetivosFlor.map(renderObjetivo)}
          </div>
        </div>
      )}

      {objetivosEmprendimiento.length > 0 && (
        <div className="objetivos-seccion">
          <h3 className="seccion-titulo">🏢 Objetivos del Emprendimiento</h3>
          <div className="objetivos-grid">
            {objetivosEmprendimiento.map(renderObjetivo)}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaObjetivos
