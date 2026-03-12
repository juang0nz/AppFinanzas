import { deleteGasto, updateGasto } from '../../services/supabase'
import { formatCurrency } from '../../utils/helpers'
import './ListaGastos.css'

const ListaGastos = ({ gastos, onGastoModificado }) => {
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return

    try {
      await deleteGasto(id)
      if (onGastoModificado) onGastoModificado()
    } catch (error) {
      console.error('Error al eliminar gasto:', error)
      alert('Error al eliminar el gasto')
    }
  }

  const handleTogglePagado = async (gasto) => {
    try {
      await updateGasto(gasto.id, { ...gasto, pagado: !gasto.pagado })
      if (onGastoModificado) onGastoModificado()
    } catch (error) {
      console.error('Error al actualizar gasto:', error)
      alert('Error al actualizar el gasto')
    }
  }

  if (gastos.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No hay gastos registrados este mes</p>
      </div>
    )
  }

  // Agrupar por categoría
  const gastosPorCategoria = gastos.reduce((acc, gasto) => {
    if (!acc[gasto.categoria]) {
      acc[gasto.categoria] = []
    }
    acc[gasto.categoria].push(gasto)
    return acc
  }, {})

  return (
    <div className="lista-gastos">
      {Object.entries(gastosPorCategoria).map(([categoria, gastosCategoria]) => {
        const totalCategoria = gastosCategoria.reduce((sum, g) => sum + Number(g.monto), 0)
        
        return (
          <div key={categoria} className="categoria-grupo">
            <div className="categoria-header">
              <h3>{categoria}</h3>
              <span className="categoria-total">{formatCurrency(totalCategoria)}</span>
            </div>
            
            <div className="gastos-list">
              {gastosCategoria.map((gasto) => (
                <div 
                  key={gasto.id} 
                  className={`gasto-item ${gasto.pagado ? 'gasto-pagado' : 'gasto-pendiente'}`}
                >
                  <div className="gasto-info">
                    <div className="gasto-descripcion">{gasto.descripcion}</div>
                    <div className="gasto-meta">
                      <span className="gasto-tipo">{gasto.tipo}</span>
                      <span className={`gasto-estado ${gasto.pagado ? 'estado-pagado' : 'estado-pendiente'}`}>
                        {gasto.pagado ? '✓ Pagado' : '⏱ Pendiente'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="gasto-actions">
                    <div className="gasto-monto">{formatCurrency(gasto.monto)}</div>
                    <button
                      onClick={() => handleTogglePagado(gasto)}
                      className="btn-toggle"
                      title={gasto.pagado ? 'Marcar como pendiente' : 'Marcar como pagado'}
                    >
                      {gasto.pagado ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => handleEliminar(gasto.id)}
                      className="btn-delete"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ListaGastos
