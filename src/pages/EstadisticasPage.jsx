import { useState } from 'react'
import { useIngresos } from '../hooks/useIngresos'
import { useGastos } from '../hooks/useGastos'
import { getCurrentMonth, getCurrentYear, getMonthName, formatCurrency } from '../utils/helpers'
import MonthSelector from '../components/common/MonthSelector'
import Loading from '../components/common/Loading'
import './EstadisticasPage.css'

const EstadisticasPage = () => {
  const [mes, setMes] = useState(getCurrentMonth())
  const [anio, setAnio] = useState(getCurrentYear())

  const { ingresos, loading: loadingIngresos } = useIngresos(mes, anio)
  const { gastos, loading: loadingGastos } = useGastos(mes, anio)

  const loading = loadingIngresos || loadingGastos

  if (loading) {
    return <Loading />
  }

  // Calcular estadísticas
  const totalIngresos = ingresos.reduce((sum, ing) => sum + Number(ing.monto), 0)
  const totalGastos = gastos.reduce((sum, g) => sum + Number(g.monto), 0)
  
  // Gastos por categoría
  const gastosPorCategoria = gastos.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + Number(gasto.monto)
    return acc
  }, {})

  const categoriasOrdenadas = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])

  // Gastos por tipo
  const gastosFijos = gastos.filter(g => g.tipo === 'Fijo').reduce((sum, g) => sum + Number(g.monto), 0)
  const gastosVariables = gastos.filter(g => g.tipo === 'Variable').reduce((sum, g) => sum + Number(g.monto), 0)

  // Ingresos por persona
  const ingresosPorPersona = ingresos.reduce((acc, ing) => {
    acc[ing.persona] = (acc[ing.persona] || 0) + Number(ing.monto)
    return acc
  }, {})

  return (
    <div className="page">
      <div className="page-header">
        <h1>📈 Estadísticas - {getMonthName(mes)} {anio}</h1>
        <MonthSelector 
          mes={mes} 
          anio={anio} 
          onMesChange={setMes} 
          onAnioChange={setAnio} 
        />
      </div>

      <div className="estadisticas-grid">
        {/* Ingresos por Persona */}
        <div className="card">
          <div className="card-header">
            <h2>💵 Ingresos por Persona</h2>
          </div>
          {Object.entries(ingresosPorPersona).length === 0 ? (
            <p className="text-muted">No hay datos</p>
          ) : (
            <div className="stats-list">
              {Object.entries(ingresosPorPersona).map(([persona, monto]) => (
                <div key={persona} className="stat-item">
                  <span>{persona}</span>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar stat-bar-success"
                      style={{ width: `${(monto / totalIngresos) * 100}%` }}
                    ></div>
                  </div>
                  <strong>{formatCurrency(monto)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gastos por Tipo */}
        <div className="card">
          <div className="card-header">
            <h2>📊 Gastos por Tipo</h2>
          </div>
          {gastos.length === 0 ? (
            <p className="text-muted">No hay datos</p>
          ) : (
            <div className="stats-list">
              <div className="stat-item">
                <span>Gastos Fijos</span>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar stat-bar-primary"
                    style={{ width: `${(gastosFijos / totalGastos) * 100}%` }}
                  ></div>
                </div>
                <strong>{formatCurrency(gastosFijos)}</strong>
              </div>
              <div className="stat-item">
                <span>Gastos Variables</span>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar stat-bar-warning"
                    style={{ width: `${(gastosVariables / totalGastos) * 100}%` }}
                  ></div>
                </div>
                <strong>{formatCurrency(gastosVariables)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Gastos por Categoría */}
        <div className="card card-full">
          <div className="card-header">
            <h2>🏷️ Gastos por Categoría</h2>
          </div>
          {categoriasOrdenadas.length === 0 ? (
            <p className="text-muted">No hay datos</p>
          ) : (
            <div className="stats-list">
              {categoriasOrdenadas.map(([categoria, monto]) => (
                <div key={categoria} className="stat-item">
                  <span>{categoria}</span>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar stat-bar-danger"
                      style={{ width: `${(monto / totalGastos) * 100}%` }}
                    ></div>
                  </div>
                  <strong>{formatCurrency(monto)}</strong>
                  <span className="stat-percentage">
                    {((monto / totalGastos) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top 5 Gastos */}
        <div className="card">
          <div className="card-header">
            <h2>🔝 Top 5 Gastos</h2>
          </div>
          {gastos.length === 0 ? (
            <p className="text-muted">No hay datos</p>
          ) : (
            <div className="top-list">
              {gastos
                .sort((a, b) => Number(b.monto) - Number(a.monto))
                .slice(0, 5)
                .map((gasto, index) => (
                  <div key={gasto.id} className="top-item">
                    <span className="top-number">{index + 1}</span>
                    <div className="top-info">
                      <p className="top-desc">{gasto.descripcion}</p>
                      <p className="top-cat text-muted">{gasto.categoria}</p>
                    </div>
                    <strong className="text-danger">{formatCurrency(gasto.monto)}</strong>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Resumen General */}
        <div className="card">
          <div className="card-header">
            <h2>📋 Resumen General</h2>
          </div>
          <div className="resumen-list">
            <div className="resumen-item">
              <span>Total Ingresos:</span>
              <strong className="text-success">{formatCurrency(totalIngresos)}</strong>
            </div>
            <div className="resumen-item">
              <span>Total Gastos:</span>
              <strong className="text-danger">{formatCurrency(totalGastos)}</strong>
            </div>
            <div className="resumen-item resumen-destacado">
              <span>Saldo:</span>
              <strong className={totalIngresos - totalGastos >= 0 ? 'text-success' : 'text-danger'}>
                {formatCurrency(totalIngresos - totalGastos)}
              </strong>
            </div>
            <div className="resumen-item">
              <span>Gastos Pagados:</span>
              <strong>{gastos.filter(g => g.pagado).length} de {gastos.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasPage
