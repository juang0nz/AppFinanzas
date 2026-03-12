import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  calcularTotalIngresos, 
  calcularTotalGastos, 
  calcularBalance,
  getMonthName,
  CATEGORIAS_PRINCIPALES 
} from '../../utils/helpers'
import './ExportPDF.css'

const ExportPDF = ({ mes, anio, ingresos = [], gastos = [], deudas = [] }) => {
  const { theme } = useTheme()
  const [exportando, setExportando] = useState(false)

  const generarPDF = async () => {
    setExportando(true)
    
    try {
      // Importar dinámicamente jsPDF
      const { default: jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      
      // Configuración de colores según tema
      let colorPrimary, colorSecondary, colorDanger, colorText, colorLight, colorBg
      
      if (theme === 'peñarol') {
        // Colores Peñarol: amarillo, negro
        colorPrimary = [255, 204, 0]  // Amarillo Peñarol
        colorSecondary = [255, 204, 0]
        colorDanger = [255, 204, 0]
        colorText = [0, 0, 0]  // Negro
        colorLight = [80, 80, 80]
        colorBg = [0, 0, 0]
      } else if (theme === 'dark') {
        // Colores modo oscuro
        colorPrimary = [139, 92, 246]
        colorSecondary = [34, 197, 94]
        colorDanger = [248, 113, 113]
        colorText = [229, 231, 235]
        colorLight = [156, 163, 175]
        colorBg = [31, 41, 55]
      } else {
        // Colores modo común
        colorPrimary = [79, 70, 229]
        colorSecondary = [16, 185, 129]
        colorDanger = [239, 68, 68]
        colorText = [31, 41, 55]
        colorLight = [107, 114, 128]
        colorBg = [255, 255, 255]
      }
      
      let yPos = 20
      
      // ============ ENCABEZADO ============
      if (theme === 'peñarol') {
        // Fondo amarillo con texto negro
        doc.setFillColor(255, 204, 0)
        doc.rect(0, 0, pageWidth, 35, 'F')
        doc.setTextColor(0, 0, 0)
      } else {
        doc.setFillColor(...colorPrimary)
        doc.rect(0, 0, pageWidth, 35, 'F')
        doc.setTextColor(255, 255, 255)
      }
      
      doc.setFontSize(24)
      doc.setFont(undefined, 'bold')
      // jsPDF no soporta emojis correctamente, usar solo texto
      const titulo = 'REPORTE FINANCIERO'
      doc.text(titulo, pageWidth / 2, 15, { align: 'center' })
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'normal')
      doc.text(`${getMonthName(mes)} ${anio}`, pageWidth / 2, 25, { align: 'center' })
      
      yPos = 45
      
      // ============ RESUMEN GENERAL ============
      const totalIngresos = calcularTotalIngresos(ingresos)
      const totalGastos = calcularTotalGastos(gastos)
      const balance = calcularBalance(totalIngresos, totalGastos)
      
      doc.setTextColor(...colorText)
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Resumen del Mes', 15, yPos)
      yPos += 10
      
      // Cuadros de resumen
      const boxWidth = (pageWidth - 50) / 3
      const boxHeight = 25
      let xPos = 15
      
      // Ingresos
      if (theme === 'peñarol') {
        doc.setFillColor(255, 245, 204)  // Amarillo claro
      } else {
        doc.setFillColor(229, 255, 245)
      }
      doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 3, 3, 'F')
      doc.setTextColor(...colorText)
      doc.setFontSize(10)
      doc.text('Total Ingresos', xPos + boxWidth / 2, yPos + 8, { align: 'center' })
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text(`$${totalIngresos.toLocaleString('es-UY')}`, xPos + boxWidth / 2, yPos + 18, { align: 'center' })
      
      xPos += boxWidth + 10
      
      // Gastos
      if (theme === 'peñarol') {
        doc.setFillColor(50, 50, 50)  // Gris oscuro
      } else {
        doc.setFillColor(254, 242, 242)
      }
      doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 3, 3, 'F')
      if (theme === 'peñarol') {
        doc.setTextColor(255, 204, 0)  // Amarillo
      } else {
        doc.setTextColor(...colorDanger)
      }
      doc.setFontSize(10)
      doc.text('Total Gastos', xPos + boxWidth / 2, yPos + 8, { align: 'center' })
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text(`$${totalGastos.toLocaleString('es-UY')}`, xPos + boxWidth / 2, yPos + 18, { align: 'center' })
      
      xPos += boxWidth + 10
      
      // Balance
      if (theme === 'peñarol') {
        doc.setFillColor(balance >= 0 ? 255 : 50, balance >= 0 ? 245 : 50, balance >= 0 ? 204 : 50)
        doc.setTextColor(balance >= 0 ? 0 : 255, balance >= 0 ? 0 : 204, balance >= 0 ? 0 : 0)
      } else {
        const balanceColor = balance >= 0 ? colorSecondary : colorDanger
        doc.setFillColor(balance >= 0 ? 229 : 254, balance >= 0 ? 255 : 242, balance >= 0 ? 245 : 242)
        doc.setTextColor(...balanceColor)
      }
      doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 3, 3, 'F')
      doc.setFontSize(10)
      doc.text('Balance', xPos + boxWidth / 2, yPos + 8, { align: 'center' })
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text(`$${balance.toLocaleString('es-UY')}`, xPos + boxWidth / 2, yPos + 18, { align: 'center' })
      
      yPos += boxHeight + 15
      
      // ============ INGRESOS DETALLADOS ============
      if (ingresos.length > 0) {
        doc.setTextColor(...colorText)
        doc.setFontSize(14)
        doc.setFont(undefined, 'bold')
        doc.text('Ingresos Detallados', 15, yPos)
        yPos += 8
        
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        
        ingresos.forEach((ingreso, index) => {
          if (yPos > pageHeight - 30) {
            doc.addPage()
            yPos = 20
          }
          
          doc.setTextColor(...colorLight)
          doc.text(`${ingreso.concepto}`, 20, yPos)
          doc.text(`${ingreso.persona || 'N/A'}`, 100, yPos)
          doc.setTextColor(...colorSecondary)
          doc.setFont(undefined, 'bold')
          doc.text(`$${Number(ingreso.monto).toLocaleString('es-UY')}`, pageWidth - 20, yPos, { align: 'right' })
          doc.setFont(undefined, 'normal')
          yPos += 6
        })
        
        yPos += 8
      }
      
      // ============ GASTOS POR CATEGORÍA ============
      if (gastos.length > 0) {
        if (yPos > pageHeight - 60) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setTextColor(...colorText)
        doc.setFontSize(14)
        doc.setFont(undefined, 'bold')
        doc.text('Gastos por Categoría', 15, yPos)
        yPos += 8
        
        // Agrupar gastos por categoría
        const gastosPorCategoria = {}
        gastos.forEach(gasto => {
          const cat = gasto.categoria_principal || 'Sin categoría'
          if (!gastosPorCategoria[cat]) {
            gastosPorCategoria[cat] = {
              total: 0,
              items: []
            }
          }
          gastosPorCategoria[cat].total += Number(gasto.monto)
          gastosPorCategoria[cat].items.push(gasto)
        })
        
        Object.entries(gastosPorCategoria).forEach(([categoria, data]) => {
          if (yPos > pageHeight - 30) {
            doc.addPage()
            yPos = 20
          }
          
          doc.setFontSize(11)
          doc.setFont(undefined, 'bold')
          doc.setTextColor(...colorPrimary)
          doc.text(`${categoria}`, 20, yPos)
          doc.setTextColor(...colorDanger)
          doc.text(`$${data.total.toLocaleString('es-UY')}`, pageWidth - 20, yPos, { align: 'right' })
          yPos += 6
          
          doc.setFontSize(8)
          doc.setFont(undefined, 'normal')
          data.items.forEach(gasto => {
            if (yPos > pageHeight - 25) {
              doc.addPage()
              yPos = 20
            }
            
            doc.setTextColor(...colorLight)
            doc.text(`  - ${gasto.concepto}`, 25, yPos)
            doc.text(`$${Number(gasto.monto).toLocaleString('es-UY')}`, pageWidth - 20, yPos, { align: 'right' })
            yPos += 5
          })
          
          yPos += 5
        })
      }
      
      // ============ PIE DE PÁGINA ============
      const totalPages = doc.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(...colorLight)
        doc.text(
          `Página ${i} de ${totalPages} - Generado el ${new Date().toLocaleDateString('es-UY')}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
      }
      
      // Guardar PDF
      doc.save(`Finanzas_${getMonthName(mes)}_${anio}.pdf`)
      
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Error al generar el PDF. Verifica que las librerías estén instaladas.')
    } finally {
      setExportando(false)
    }
  }

  const icono = theme === 'peñarol' ? '⚽' : '📄'
  
  return (
    <button 
      onClick={generarPDF} 
      className="btn-export-pdf"
      disabled={exportando}
      data-theme={theme}
    >
      {exportando ? `${icono} Generando...` : `${icono} Exportar PDF`}
    </button>
  )
}

export default ExportPDF
