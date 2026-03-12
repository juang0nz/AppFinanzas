import { formatCurrency, calculatePercentage } from '../../utils/helpers'
import ProgressBar from '../common/ProgressBar'
import './IngresosPorPersona.css'

const IngresosPorPersona = ({ ingresos }) => {
  // Agrupar ingresos por persona
  const ingresosPorPersona = ingresos.reduce((acc, ing) => {
    const persona = ing.persona || 'Sin asignar'
    acc[persona] = (acc[persona] || 0) + Number(ing.monto)
    return acc
  }, {})

  const totalIngresos = Object.values(ingresosPorPersona).reduce((sum, val) => sum + val, 0)

  return (
    <div className="ingresos-por-persona">
      <div className="card-header">
        <h3>👥 Ingresos por Persona</h3>
        <p className="subtitle">Aportes individuales al hogar</p>
      </div>

      {totalIngresos === 0 ? (
        <p className="text-muted">No hay ingresos registrados este mes</p>
      ) : (
        <>
          <div className="personas-list">
            {Object.entries(ingresosPorPersona).map(([persona, monto]) => {
              const porcentaje = calculatePercentage(monto, totalIngresos)
              
              return (
                <div key={persona} className="persona-item">
                  <div className="persona-header">
                    <span className="persona-nombre">{persona}</span>
                    <div className="persona-valores">
                      <span className="persona-porcentaje">{porcentaje}%</span>
                      <span className="persona-monto">{formatCurrency(monto)}</span>
                    </div>
                  </div>
                  <ProgressBar 
                    progreso={porcentaje} 
                    color="success" 
                    altura="small"
                    mostrarPorcentaje={false}
                  />
                </div>
              )
            })}
          </div>

          <div className="total-footer">
            <span>Ingreso Total del Hogar:</span>
            <strong>{formatCurrency(totalIngresos)}</strong>
          </div>
        </>
      )}
    </div>
  )
}

export default IngresosPorPersona
