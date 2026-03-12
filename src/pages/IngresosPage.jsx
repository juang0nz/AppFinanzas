import { useState } from 'react'
import { useIngresos } from '../hooks/useIngresos'
import { getCurrentMonth, getCurrentYear, getMonthName } from '../utils/helpers'
import MonthSelector from '../components/common/MonthSelector'
import FormIngreso from '../components/Ingresos/FormIngreso'
import ListaIngresos from '../components/Ingresos/ListaIngresos'
import CopiarIngresosFijos from '../components/Ingresos/CopiarIngresosFijos'
import Loading from '../components/common/Loading'

const IngresosPage = () => {
  const [mes, setMes] = useState(getCurrentMonth())
  const [anio, setAnio] = useState(getCurrentYear())

  const { ingresos, loading, refetch } = useIngresos(mes, anio)

  return (
    <div className="page">
      <div className="page-header">
        <h1>💵 Ingresos - {getMonthName(mes)} {anio}</h1>
        <MonthSelector 
          mes={mes} 
          anio={anio} 
          onMesChange={setMes} 
          onAnioChange={setAnio} 
        />
      </div>

      {!loading && (
        <CopiarIngresosFijos 
          mes={mes} 
          anio={anio} 
          ingresos={ingresos} 
          onIngresosCopied={refetch} 
        />
      )}

      <div className="grid grid-cols-1 mb-3">
        <FormIngreso mes={mes} anio={anio} onIngresoCreado={refetch} />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <ListaIngresos ingresos={ingresos} onIngresoEliminado={refetch} />
      )}
    </div>
  )
}

export default IngresosPage
