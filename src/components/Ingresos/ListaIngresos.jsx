import { deleteIngreso } from '../../services/supabase'
import { formatCurrency } from '../../utils/helpers'
import './ListaIngresos.css'

const ListaIngresos = ({ ingresos, onIngresoEliminado }) => {
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este ingreso?')) return

    try {
      await deleteIngreso(id)
      if (onIngresoEliminado) onIngresoEliminado()
    } catch (error) {
      console.error('Error al eliminar ingreso:', error)
      alert('Error al eliminar el ingreso')
    }
  }

  if (ingresos.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No hay ingresos registrados este mes</p>
      </div>
    )
  }

  const totalPorPersona = ingresos.reduce((acc, ing) => {
    acc[ing.persona] = (acc[ing.persona] || 0) + Number(ing.monto)
    return acc
  }, {})

  return (
    <div className="lista-ingresos">
      <div className="totales-personas">
        {Object.entries(totalPorPersona).map(([persona, total]) => (
          <div key={persona} className="total-persona">
            <span>{persona}:</span>
            <span className="total-monto">{formatCurrency(total)}</span>
          </div>
        ))}
      </div>

      <div className="ingresos-list">
        {ingresos.map((ingreso) => (
          <div key={ingreso.id} className="ingreso-item">
            <div className="ingreso-info">
              <div className="ingreso-persona">{ingreso.persona}</div>
              <div className="ingreso-descripcion">{ingreso.descripcion || 'Sin descripción'}</div>
            </div>
            <div className="ingreso-actions">
              <div className="ingreso-monto">{formatCurrency(ingreso.monto)}</div>
              <button
                onClick={() => handleEliminar(ingreso.id)}
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
}

export default ListaIngresos
