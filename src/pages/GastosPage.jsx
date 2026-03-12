import { useState } from 'react'
import { useGastos } from '../hooks/useGastos'
import { getCurrentMonth, getCurrentYear, getMonthName } from '../utils/helpers'
import MonthSelector from '../components/common/MonthSelector'
import FormGasto from '../components/Gastos/FormGasto'
import ListaGastos from '../components/Gastos/ListaGastos'
import CopiarGastosFijos from '../components/Gastos/CopiarGastosFijos'
import Loading from '../components/common/Loading'

const GastosPage = () => {
  const [mes, setMes] = useState(getCurrentMonth())
  const [anio, setAnio] = useState(getCurrentYear())

  const { gastos, loading, refetch } = useGastos(mes, anio)

  return (
    <div className="page">
      <div className="page-header">
        <h1>💸 Gastos - {getMonthName(mes)} {anio}</h1>
        <MonthSelector 
          mes={mes} 
          anio={anio} 
          onMesChange={setMes} 
          onAnioChange={setAnio} 
        />
      </div>

      {!loading && (
        <CopiarGastosFijos 
          mes={mes} 
          anio={anio} 
          gastos={gastos} 
          onGastosCopied={refetch} 
        />
      )}

      <div className="grid grid-cols-1 mb-3">
        <FormGasto mes={mes} anio={anio} onGastoCreado={refetch} />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <ListaGastos gastos={gastos} onGastoModificado={refetch} />
      )}
    </div>
  )
}

export default GastosPage
