import './FraseMotivacional.css'

const FraseMotivacional = ({ frase, icono = '💬' }) => {
  if (!frase) return null

  return (
    <div className="frase-motivacional">
      <span className="frase-icono">{icono}</span>
      <p className="frase-texto">{frase}</p>
    </div>
  )
}

export default FraseMotivacional
