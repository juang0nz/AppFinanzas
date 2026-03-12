import { useState, useMemo } from 'react'
import { useIngresos } from '../hooks/useIngresos'
import { useGastos } from '../hooks/useGastos'
import { useDeudas } from '../hooks/useDeudas'
import { getCurrentMonth, getCurrentYear, getMonthName, calcularTotalIngresos, calcularTotalGastos, calcularBalance } from '../utils/helpers'
import MonthSelector from '../components/common/MonthSelector'
import Loading from '../components/common/Loading'
import ExportPDF from '../components/common/ExportPDF'
import './HogarCompartidoPage.css'

const HogarCompartidoPage = () => {
  const [mes, setMes] = useState(getCurrentMonth())
  const [anio, setAnio] = useState(getCurrentYear())

  const { ingresos, loading: loadingIngresos } = useIngresos(mes, anio)
  const { gastos, loading: loadingGastos } = useGastos(mes, anio)
  const { deudas, loading: loadingDeudas } = useDeudas()

  const loading = loadingIngresos || loadingGastos || loadingDeudas

  // Calcular totales por persona
  const stats = useMemo(() => {
    const ingresosJuanchi = ingresos.filter(i => i.persona === 'Juanchi')
    const ingresosFlor = ingresos.filter(i => i.persona === 'Flor')
    const ingresosEmprendimiento = ingresos.filter(i => i.persona === 'Emprendimiento')
    const gastosJuanchi = gastos.filter(g => g.persona === 'Juanchi')
    const gastosFlor = gastos.filter(g => g.persona === 'Flor')
    const gastosEmprendimiento = gastos.filter(g => g.persona === 'Emprendimiento')

    const totalIngresosJuanchi = calcularTotalIngresos(ingresosJuanchi)
    const totalIngresosFlor = calcularTotalIngresos(ingresosFlor)
    const totalIngresosEmprendimiento = calcularTotalIngresos(ingresosEmprendimiento)
    const totalGastosJuanchi = calcularTotalGastos(gastosJuanchi)
    const totalGastosFlor = calcularTotalGastos(gastosFlor)
    const totalGastosEmprendimiento = calcularTotalGastos(gastosEmprendimiento)

    const totalIngresos = totalIngresosJuanchi + totalIngresosFlor + totalIngresosEmprendimiento
    const totalGastos = totalGastosJuanchi + totalGastosFlor + totalGastosEmprendimiento
    const balance = calcularBalance(totalIngresos, totalGastos)

    return {
      totalIngresos,
      totalGastos,
      balance,
      juanchi: {
        ingresos: totalIngresosJuanchi,
        gastos: totalGastosJuanchi,
        balance: calcularBalance(totalIngresosJuanchi, totalGastosJuanchi)
      },
      flor: {
        ingresos: totalIngresosFlor,
        gastos: totalGastosFlor,
        balance: calcularBalance(totalIngresosFlor, totalGastosFlor)
      },
      emprendimiento: {
        ingresos: totalIngresosEmprendimiento,
        gastos: totalGastosEmprendimiento,
        balance: calcularBalance(totalIngresosEmprendimiento, totalGastosEmprendimiento)
      }
    }
  }, [ingresos, gastos])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Hogar Compartido</h1>
          <p className="text-muted">Finanzas de Juanchi, Flor y Emprendimiento</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ExportPDF mes={mes} anio={anio} ingresos={ingresos} gastos={gastos} />
          <MonthSelector 
            mes={mes} 
            anio={anio} 
            onMesChange={setMes} 
            onAnioChange={setAnio} 
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Resumen Total */}
          <div className="grid grid-cols-3 mb-2">
            <div className="stat-card stat-ingresos">
              <div className="stat-label">Total Ingresos</div>
              <div className="stat-value">${stats.totalIngresos.toLocaleString('es-UY')}</div>
            </div>
            <div className="stat-card stat-gastos">
              <div className="stat-label">Total Gastos</div>
              <div className="stat-value">${stats.totalGastos.toLocaleString('es-UY')}</div>
            </div>
            <div className={`stat-card ${stats.balance >= 0 ? 'stat-balance-positivo' : 'stat-balance-negativo'}`}>
              <div className="stat-label">Balance</div>
              <div className="stat-value">${stats.balance.toLocaleString('es-UY')}</div>
            </div>
          </div>

          {/* Breakdown por Persona */}
          <div className="grid grid-cols-3 mb-2">
            <div className="card">
              <h3>Juanchi</h3>
              <div className="persona-stats">
                <div className="stat-row">
                  <span className="stat-label-small">Ingresos:</span>
                  <span className="text-success">${stats.juanchi.ingresos.toLocaleString('es-UY')}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label-small">Gastos:</span>
                  <span className="text-danger">${stats.juanchi.gastos.toLocaleString('es-UY')}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label-small">Balance:</span>
                  <span className={stats.juanchi.balance >= 0 ? 'text-success' : 'text-danger'}>
                    ${stats.juanchi.balance.toLocaleString('es-UY')}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Flor</h3>
              <div className="persona-stats">
                <div className="stat-row">
                  <span className="stat-label-small">Ingresos:</span>
                  <span className="text-success">${stats.flor.ingresos.toLocaleString('es-UY')}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label-small">Gastos:</span>
                  <span className="text-danger">${stats.flor.gastos.toLocaleString('es-UY')}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label-small">Balance:</span>
                  <span className={stats.flor.balance >= 0 ? 'text-success' : 'text-danger'}>
                    ${stats.flor.balance.toLocaleString('es-UY')}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Emprendimiento</h3>
              <div className="persona-stats">
                <div className="stat-row">
                  <span className="stat-label-small">Ingresos:</span>
                  <span className="text-success">${stats.emprendimiento.ingresos.toLocaleString('es-UY')}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label-small">Gastos:</span>
                  <span className="text-danger">${stats.emprendimiento.gastos.toLocaleString('es-UY')}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label-small">Balance:</span>
                  <span className={stats.emprendimiento.balance >= 0 ? 'text-success' : 'text-danger'}>
                    ${stats.emprendimiento.balance.toLocaleString('es-UY')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingresos */}
          <div className="card mb-2">
            <h3>Ingresos ({getMonthName(mes)} {anio})</h3>
            {ingresos.length === 0 ? (
              <p className="text-muted">No hay ingresos registrados este mes</p>
            ) : (
              <div className="tabla-financiera">
                <table>
                  <thead>
                    <tr>
                      <th>Persona</th>
                      <th>Concepto</th>
                      <th>Tipo</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map((ingreso) => (
                      <tr key={ingreso.id}>
                        <td><strong>{ingreso.persona || '-'}</strong></td>
                        <td>{ingreso.concepto}</td>
                        <td className="text-muted">{ingreso.tipo || '-'}</td>
                        <td className="text-success">${Number(ingreso.monto).toLocaleString('es-UY')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Gastos */}
          <div className="card mb-2">
            <h3>Gastos ({getMonthName(mes)} {anio})</h3>
            {gastos.length === 0 ? (
              <p className="text-muted">No hay gastos registrados este mes</p>
            ) : (
              <div className="tabla-financiera">
                <table>
                  <thead>
                    <tr>
                      <th>Persona</th>
                      <th>Concepto</th>
                      <th>Categoría</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map((gasto) => (
                      <tr key={gasto.id}>
                        <td><strong>{gasto.persona || '-'}</strong></td>
                        <td>{gasto.concepto}</td>
                        <td className="text-muted">{gasto.categoria || '-'}</td>
                        <td className="text-danger">${Number(gasto.monto).toLocaleString('es-UY')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Deudas */}
          {deudas.length > 0 && (
            <div className="card">
              <h3>Deudas</h3>
              <div className="tabla-financiera">
                <table>
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Total</th>
                      <th>Pendiente</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deudas.map((deuda) => (
                      <tr key={deuda.id}>
                        <td>{deuda.concepto}</td>
                        <td>${Number(deuda.monto_total).toLocaleString('es-UY')}</td>
                        <td className="text-danger">${Number(deuda.monto_pendiente).toLocaleString('es-UY')}</td>
                        <td className="text-muted">{deuda.estado || 'activa'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HogarCompartidoPage
