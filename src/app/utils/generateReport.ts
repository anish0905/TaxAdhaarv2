import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data: any) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text("Taxadhaar Analysis Report", 14, 20);
  
  doc.setFontSize(10);
  doc.text(`User Income: Rs. ${data.salary.toLocaleString()}`, 14, 30);
  doc.text(`Investments: Rs. ${data.inv.toLocaleString()}`, 14, 35);

  autoTable(doc, {
    startY: 45,
    head: [['Tax Regime', 'Total Tax Payable']],
    body: [
      ['New Tax Regime', `Rs. ${data.newTax.toLocaleString()}`],
      ['Old Tax Regime', `Rs. ${data.oldTax.toLocaleString()}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [2, 6, 23] }
  });

  doc.text(`Recommended: ${data.recommended}`, 14, (doc as any).lastAutoTable.finalY + 10);
  doc.save(`Taxadhaar_Report_${Date.now()}.pdf`);
};