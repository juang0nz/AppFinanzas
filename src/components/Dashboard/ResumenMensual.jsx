import { formatCurrency, TEXTOS_EXPLICATIVOS } from '../../utils/helpers'
import './ResumenMensual.css'

const ResumenMensual = ({ ingresos, gastos }) => {
  const totalIngresos = ingresos.reduce((sum, ing) => sum + Number(ing.monto), 0)
  const totalGastos = gastos.reduce((sum, gasto) => sum + Number(gasto.monto), 0)
  const saldo = totalIngresos - totalGastos

  // Calcular gastos del fondo común vs personales
  const gastosFondoComun = gastos
    .filter(g => g.tipo_movimiento === 'Fondo Común' || !g.tipo_movimiento)
    .reduce((sum, g) => sum + Number(g.monto), 0)
  
  const gastosPersonales = totalGastos - gastosFondoComun

  const gastosPagados = gastos.filter(g => g.pagado).reduce((sum, g) => sum + Number(g.monto), 0)
  const gastosPendientes = gastos.filter(g => !g.pagado).reduce((sum, g) => sum + Number(g.monto), 0)

  // Desglose de gastos pendientes por persona
  const gastosPendientesJuanchi = gastos.filter(g => !g.pagado && g.persona === 'Juanchi').reduce((sum, g) => sum + Number(g.monto), 0)
  const gastosPendientesFlor = gastos.filter(g => !g.pagado && g.persona === 'Flor').reduce((sum, g) => sum + Number(g.monto), 0)
  const gastosPendientesEmprendimiento = gastos.filter(g => !g.pagado && g.persona === 'Emprendimiento').reduce((sum, g) => sum + Number(g.monto), 0)

  return (
    <div className="resumen-mensual">
      <div className="resumen-grid">
        <div className="resumen-item resumen-ingresos">
          <div className="resumen-icon">💵</div>
          <div>
            <p className="resumen-label">Total Ingresos</p>
            <p className="resumen-valor">{formatCurrency(totalIngresos)}</p>
          </div>
        </div>

        <div className="resumen-item resumen-gastos">
          <div className="resumen-icon">💸</div>
          <div>
            <p className="resumen-label">Total Gastos</p>
            <p className="resumen-valor">{formatCurrency(totalGastos)}</p>
          </div>
        </div>

        <div className={`resumen-item ${saldo >= 0 ? 'resumen-positivo' : 'resumen-negativo'}`}>
          <div className="resumen-icon">{saldo >= 0 ? '✅' : '⚠️'}</div>
          <div>
            <p className="resumen-label">Saldo Disponible</p>
            <p className="resumen-valor">{formatCurrency(saldo)}</p>
          </div>
        </div>
      </div>

      <div className="resumen-detalle">
        <div className="detalle-item">
          <div className="detalle-info">
            <span className="detalle-icono">🏠</span>
            <span>Fondo Común del Hogar:</span>
          </div>
          <span className="detalle-valor">{formatCurrency(gastosFondoComun)}</span>
        </div>
        
        <div className="detalle-item">
          <div className="detalle-info">
            <span className="detalle-icono">👤</span>
            <span>Gastos Personales:</span>
          </div>
          <span className="detalle-valor">{formatCurrency(gastosPersonales)}</span>
        </div>

        <div className="separador"></div>

        <div className="detalle-item">
          <span>Gastos Pagados:</span>
          <span className="text-success">{formatCurrency(gastosPagados)}</span>
        </div>
        <div className="detalle-item">
          <span>Gastos Pendientes:</span>
          <span className="text-danger">{formatCurrency(gastosPendientes)}</span>
        </div>

        {/* Desglose de gastos pendientes por persona */}
        {gastosPendientes > 0 && (
          <>
            <div className="separador"></div>
            <div className="detalle-item detalle-secundario">
              <div className="detalle-info">
                <span className="detalle-icono-small">👤</span>
                <span>Pendientes Juanchi:</span>
              </div>
              <span className="text-warning">{formatCurrency(gastosPendientesJuanchi)}</span>
            </div>
            <div className="detalle-item detalle-secundario">
              <div className="detalle-info">
                <span className="detalle-icono-small">👤</span>
                <span>Pendientes Flor:</span>
              </div>
              <span className="text-warning">{formatCurrency(gastosPendientesFlor)}</span>
            </div>
            <div className="detalle-item detalle-secundario">
              <div className="detalle-info">
                <span className="detalle-icono-small">💼</span>
                <span>Pendientes Emprendimiento:</span>
              </div>
              <span className="text-warning">{formatCurrency(gastosPendientesEmprendimiento)}</span>
            </div>
          </>
        )}
      </div>

      <div className="explicacion">
        <p className="explicacion-texto">
          ℹ️ {TEXTOS_EXPLICATIVOS.FONDO_COMUN}
        </p>
      </div>
    </div>
  )
}

export default ResumenMensual
