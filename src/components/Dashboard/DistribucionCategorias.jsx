import { formatCurrency, calcularPorcentajeCategoria, CATEGORIAS_PRINCIPALES } from '../../utils/helpers'
import ProgressBar from '../common/ProgressBar'
import './DistribucionCategorias.css'

const DistribucionCategorias = ({ gastos }) => {
  // Calcular distribución por categoría principal
  const distribucion = gastos.reduce((acc, gasto) => {
    const categoria = gasto.categoria_principal || 'Vida'
    acc[categoria] = (acc[categoria] || 0) + Number(gasto.monto)
    return acc
  }, {})

  const totalGastos = Object.values(distribucion).reduce((sum, val) => sum + val, 0)

  // Iconos para cada categoría
  const iconos = {
    Vida: '🏠',
    Deudas: '💳',
    Ahorro: '💰',
    Inversión: '📈',
    Disfrute: '🎉'
  }

  // Colores para las barras
  const colores = {
    Vida: 'vida',
    Deudas: 'deudas',
    Ahorro: 'ahorro',
    Inversión: 'inversion',
    Disfrute: 'disfrute'
  }

  return (
    <div className="distribucion-categorias">
      <div className="card-header">
        <h3>📊 Distribución por Categorías</h3>
        <p className="subtitle">Cómo organizás tu dinero</p>
      </div>

      {totalGastos === 0 ? (
        <p className="text-muted">No hay gastos registrados este mes</p>
      ) : (
        <div className="categorias-list">
          {Object.entries(CATEGORIAS_PRINCIPALES).map(([key, categoria]) => {
            const monto = distribucion[categoria] || 0
            const porcentaje = calcularPorcentajeCategoria(monto, totalGastos)
            
            return (
              <div key={categoria} className="categoria-item">
                <div className="categoria-header">
                  <div className="categoria-info">
                    <span className="categoria-icono">{iconos[categoria]}</span>
                    <span className="categoria-nombre">{categoria}</span>
                  </div>
                  <div className="categoria-valores">
                    <span className="categoria-porcentaje">{porcentaje}%</span>
                    <span className="categoria-monto">{formatCurrency(monto)}</span>
                  </div>
                </div>
                <ProgressBar 
                  progreso={porcentaje} 
                  color={colores[categoria]} 
                  altura="small"
                  mostrarPorcentaje={false}
                />
              </div>
            )
          })}
        </div>
      )}

      <div className="total-footer">
        <span>Total Gastado:</span>
        <strong>{formatCurrency(totalGastos)}</strong>
      </div>
    </div>
  )
}

export default DistribucionCategorias
