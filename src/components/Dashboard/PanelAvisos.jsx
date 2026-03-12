import { useMemo } from 'react'
import { useAvisos } from '../../hooks/useAvisos'
import { ICONOS_AVISO, COLORES_PRIORIDAD, formatCurrency } from '../../utils/helpers'
import './PanelAvisos.css'

const PanelAvisos = ({ gastos = [] }) => {
  const { avisos, loading, avisosNoLeidos, marcarLeido, eliminarAviso, marcarTodosLeidos } = useAvisos(true)

  // Generar avisos automáticos para gastos pendientes del mes actual
  const avisosGastosPendientes = useMemo(() => {
    const gastosPendientes = gastos.filter(g => !g.pagado)
    
    return gastosPendientes.map(gasto => ({
      id: `gasto-${gasto.id}`,
      tipo: 'gasto_pendiente',
      titulo: '💸 Gasto Pendiente de Pago',
      mensaje: `${gasto.descripcion} - ${formatCurrency(gasto.monto)} (${gasto.persona || 'Sin asignar'})`,
      prioridad: 'media',
      fecha_evento: gasto.fecha,
      leido: false,
      esAutomatico: true
    }))
  }, [gastos])

  // Combinar avisos manuales con avisos automáticos de gastos pendientes
  const todosLosAvisos = useMemo(() => {
    return [...avisosGastosPendientes, ...avisos]
  }, [avisosGastosPendientes, avisos])

  const totalNoLeidos = avisosNoLeidos + avisosGastosPendientes.length

  if (loading) {
    return <div className="panel-avisos-loading">Cargando avisos...</div>
  }

  if (todosLosAvisos.length === 0) {
    return (
      <div className="panel-avisos panel-avisos-vacio">
        <div className="avisos-header">
          <h3>✅ Todo al Día</h3>
        </div>
        <p className="texto-vacio">No tienes avisos pendientes. ¡Excelente trabajo!</p>
      </div>
    )
  }

  const handleMarcarLeido = async (id, esAutomatico) => {
    // Los avisos automáticos de gastos no se pueden marcar como leídos (solo se van cuando pagas el gasto)
    if (esAutomatico) return
    
    try {
      await marcarLeido(id)
    } catch (err) {
      console.error('Error al marcar aviso:', err)
    }
  }

  const handleEliminar = async (id, esAutomatico) => {
    // Los avisos automáticos de gastos no se pueden eliminar manualmente
    if (esAutomatico) return
    
    try {
      await eliminarAviso(id)
    } catch (err) {
      console.error('Error al eliminar aviso:', err)
    }
  }

  const handleMarcarTodos = async () => {
    try {
      await marcarTodosLeidos()
    } catch (err) {
      console.error('Error al marcar todos:', err)
    }
  }

  return (
    <div className="panel-avisos">
      <div className="avisos-header">
        <div>
          <h3>🔔 Avisos Importantes</h3>
          {totalNoLeidos > 0 && (
            <span className="badge-avisos">{totalNoLeidos} sin leer</span>
          )}
        </div>
        {avisosNoLeidos > 0 && (
          <button onClick={handleMarcarTodos} className="btn-marcar-todos">
            Marcar todos como leídos
          </button>
        )}
      </div>

      <div className="avisos-lista">
        {todosLosAvisos.map((aviso) => (
          <div 
            key={aviso.id} 
            className={`aviso-item aviso-${aviso.prioridad} ${aviso.esAutomatico ? 'aviso-automatico' : ''}`}
            style={{ borderLeftColor: COLORES_PRIORIDAD[aviso.prioridad] }}
          >
            <div className="aviso-icono">
              {ICONOS_AVISO[aviso.tipo] || 'ℹ️'}
            </div>
            <div className="aviso-contenido">
              <h4 className="aviso-titulo">
                {aviso.titulo}
                {aviso.esAutomatico && <span className="badge-auto">Auto</span>}
              </h4>
              <p className="aviso-mensaje">{aviso.mensaje}</p>
              {aviso.fecha_evento && (
                <p className="aviso-fecha">
                  📅 {new Date(aviso.fecha_evento).toLocaleDateString('es-AR')}
                </p>
              )}
            </div>
            {!aviso.esAutomatico && (
              <div className="aviso-acciones">
                <button 
                  onClick={() => handleMarcarLeido(aviso.id, aviso.esAutomatico)}
                  className="btn-icono"
                  title="Marcar como leído"
                >
                  ✓
                </button>
                <button 
                  onClick={() => handleEliminar(aviso.id, aviso.esAutomatico)}
                  className="btn-icono btn-eliminar"
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PanelAvisos
