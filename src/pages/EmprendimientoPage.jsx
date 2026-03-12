import { useState, useMemo } from 'react'
import { useIngresos } from '../hooks/useIngresos'
import { useGastos } from '../hooks/useGastos'
import { useObjetivos } from '../hooks/useObjetivos'
import { getCurrentMonth, getCurrentYear, calcularTotalIngresos, calcularTotalGastos, calcularBalance } from '../utils/helpers'
import MonthSelector from '../components/common/MonthSelector'
import Loading from '../components/common/Loading'
import ExportPDF from '../components/common/ExportPDF'
import './EmprendimientoPage.css'

const EmprendimientoPage = () => {
  const [mes, setMes] = useState(getCurrentMonth())
  const [anio, setAnio] = useState(getCurrentYear())

  const { ingresos, loading: loadingIngresos } = useIngresos(mes, anio)
  const { gastos, loading: loadingGastos } = useGastos(mes, anio)
  const { objetivos, loading: loadingObjetivos } = useObjetivos()

  const loading = loadingIngresos || loadingGastos || loadingObjetivos

  // Filtrar solo datos del Emprendimiento
  const emprendimientoData = useMemo(() => {
    const ingresosEmp = ingresos.filter(i => i.persona === 'Emprendimiento')
    const gastosEmp = gastos.filter(g => g.persona === 'Emprendimiento')
    const objetivosEmp = objetivos.filter(o => o.propietario === 'Emprendimiento')

    const totalIngresos = calcularTotalIngresos(ingresosEmp)
    const totalGastos = calcularTotalGastos(gastosEmp)
    const balance = calcularBalance(totalIngresos, totalGastos)

    return {
      ingresos: ingresosEmp,
      gastos: gastosEmp,
      objetivos: objetivosEmp,
      totalIngresos,
      totalGastos,
      balance
    }
  }, [ingresos, gastos, objetivos])

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('es-UY')}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const calcularProgreso = (actual, objetivo) => {
    if (!objetivo || objetivo === 0) return 0
    return Math.min((actual / objetivo) * 100, 100)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>💼 Emprendimiento</h1>
          <p className="text-muted">Finanzas del negocio</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ExportPDF 
            mes={mes} 
            anio={anio} 
            ingresos={emprendimientoData.ingresos} 
            gastos={emprendimientoData.gastos} 
          />
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
          {/* Resumen del Mes */}
          <div className="grid grid-cols-3 mb-2">
            <div className="stat-card stat-ingresos">
              <div className="stat-label">Ingresos del Mes</div>
              <div className="stat-value">{formatCurrency(emprendimientoData.totalIngresos)}</div>
            </div>
            <div className="stat-card stat-gastos">
              <div className="stat-label">Gastos del Mes</div>
              <div className="stat-value">{formatCurrency(emprendimientoData.totalGastos)}</div>
            </div>
            <div className={`stat-card ${emprendimientoData.balance >= 0 ? 'stat-balance-positivo' : 'stat-balance-negativo'}`}>
              <div className="stat-label">Balance del Mes</div>
              <div className="stat-value">{formatCurrency(emprendimientoData.balance)}</div>
            </div>
          </div>

          {/* Sección de Ingresos */}
          <div className="section">
            <h2>💵 Ingresos del Emprendimiento</h2>
            {emprendimientoData.ingresos.length === 0 ? (
              <p className="empty-message">No hay ingresos registrados para este mes</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Tipo</th>
                      <th className="text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emprendimientoData.ingresos.map(ingreso => (
                      <tr key={ingreso.id}>
                        <td>{formatDate(ingreso.fecha)}</td>
                        <td>{ingreso.descripcion}</td>
                        <td>
                          <span className="category-badge">{ingreso.categoria}</span>
                        </td>
                        <td>
                          <span className={`tipo-badge tipo-${ingreso.tipo?.toLowerCase()}`}>
                            {ingreso.tipo || 'Fijo'}
                          </span>
                        </td>
                        <td className="text-right amount-positive">{formatCurrency(ingreso.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sección de Gastos */}
          <div className="section">
            <h2>💳 Gastos del Emprendimiento</h2>
            {emprendimientoData.gastos.length === 0 ? (
              <p className="empty-message">No hay gastos registrados para este mes</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Tipo</th>
                      <th>Pagado</th>
                      <th className="text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emprendimientoData.gastos.map(gasto => (
                      <tr key={gasto.id}>
                        <td>{formatDate(gasto.fecha)}</td>
                        <td>{gasto.descripcion}</td>
                        <td>
                          <span className="category-badge">{gasto.categoria}</span>
                        </td>
                        <td>
                          <span className={`tipo-badge tipo-${gasto.tipo?.toLowerCase()}`}>
                            {gasto.tipo || 'Fijo'}
                          </span>
                        </td>
                        <td>
                          <span className={`pagado-badge ${gasto.pagado ? 'pagado-si' : 'pagado-no'}`}>
                            {gasto.pagado ? '✓ Sí' : '✗ No'}
                          </span>
                        </td>
                        <td className="text-right amount-negative">{formatCurrency(gasto.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sección de Objetivos */}
          <div className="section">
            <h2>🎯 Objetivos del Emprendimiento</h2>
            {emprendimientoData.objetivos.length === 0 ? (
              <p className="empty-message">No hay objetivos registrados para el emprendimiento</p>
            ) : (
              <div className="objetivos-grid">
                {emprendimientoData.objetivos.map(objetivo => {
                  const progreso = calcularProgreso(objetivo.monto_actual, objetivo.monto_objetivo)
                  const diasRestantes = objetivo.fecha_limite 
                    ? Math.ceil((new Date(objetivo.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24))
                    : null

                  return (
                    <div key={objetivo.id} className={`objetivo-card ${objetivo.completado ? 'objetivo-completado' : ''}`}>
                      <div className="objetivo-header">
                        <h3>{objetivo.nombre}</h3>
                        {objetivo.completado && <span className="badge-completado">✓ Completado</span>}
                      </div>
                      {objetivo.descripcion && <p className="objetivo-descripcion">{objetivo.descripcion}</p>}
                      
                      <div className="objetivo-montos">
                        <span className="monto-actual">{formatCurrency(objetivo.monto_actual)}</span>
                        <span className="monto-separador">/</span>
                        <span className="monto-objetivo">{formatCurrency(objetivo.monto_objetivo)}</span>
                      </div>

                      <div className="progreso-container">
                        <div className="progreso-bar">
                          <div 
                            className="progreso-fill" 
                            style={{ width: `${progreso}%` }}
                          ></div>
                        </div>
                        <span className="progreso-texto">{progreso.toFixed(0)}%</span>
                      </div>

                      {diasRestantes !== null && (
                        <div className={`objetivo-fecha ${diasRestantes < 30 ? 'fecha-cercana' : ''}`}>
                          {diasRestantes > 0 
                            ? `Quedan ${diasRestantes} días` 
                            : diasRestantes === 0 
                              ? '¡Hoy es la fecha límite!' 
                              : `Venció hace ${Math.abs(diasRestantes)} días`}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default EmprendimientoPage
