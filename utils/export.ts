import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Expense, Project, Budget, Currency } from '@/types';
import { format } from 'date-fns';

export function exportExpenseToExcel(
  expense: Expense,
  project?: Project,
  budget?: Budget,
  currency?: Currency
) {
  const worksheetData = [
    ['Expense Transaction Details'],
    [],
    ['Field', 'Value'],
    ['Expense ID', expense.id],
    ['Project', project?.name || 'N/A'],
    ['Budget ID', budget?.id || 'N/A'],
    ['Amount', `${currency?.symbol || ''}${expense.amount.toLocaleString()} ${currency?.code || ''}`],
    ['Description', expense.description],
    ['Date', format(new Date(expense.date), 'MMM dd, yyyy')],
    ['Status', expense.status.charAt(0).toUpperCase() + expense.status.slice(1)],
    ['Requested By', expense.requestedBy],
    ['Approved By', expense.approvedBy || 'N/A'],
    ['Authorized By', expense.authorizedBy || 'N/A'],
    ['Created At', format(new Date(expense.createdAt), 'MMM dd, yyyy HH:mm')],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expense Details');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 40 },
  ];

  const fileName = `expense_${expense.id}_${format(new Date(), 'yyyyMMdd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportExpenseToPDF(
  expense: Expense,
  project?: Project,
  budget?: Budget,
  currency?: Currency
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('Expense Transaction Details', 14, 20);
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(14, 25, 196, 25);
  
  let yPos = 35;
  const lineHeight = 8;
  const margin = 14;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Expense details
  const details = [
    ['Expense ID:', expense.id],
    ['Project:', project?.name || 'N/A'],
    ['Budget ID:', budget?.id || 'N/A'],
    ['Amount:', `${currency?.symbol || ''}${expense.amount.toLocaleString()} ${currency?.code || ''}`],
    ['Description:', expense.description],
    ['Date:', format(new Date(expense.date), 'MMM dd, yyyy')],
    ['Status:', expense.status.charAt(0).toUpperCase() + expense.status.slice(1)],
    ['Requested By:', expense.requestedBy],
    ['Approved By:', expense.approvedBy || 'N/A'],
    ['Authorized By:', expense.authorizedBy || 'N/A'],
    ['Created At:', format(new Date(expense.createdAt), 'MMM dd, yyyy HH:mm')],
  ];
  
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    
    // Handle long text by wrapping
    const maxWidth = 180 - margin;
    const lines = doc.splitTextToSize(value.toString(), maxWidth);
    doc.text(lines, margin + 50, yPos);
    
    yPos += Math.max(lineHeight, lines.length * lineHeight);
    
    // Add new page if needed
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount} - Generated on ${format(new Date(), 'MMM dd, yyyy HH:mm')}`,
      14,
      285,
      { align: 'left' }
    );
  }
  
  const fileName = `expense_${expense.id}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
}

export function exportExpensesToExcel(expenses: Expense[], projects: Project[], currencies: Currency[]) {
  const worksheetData = [
    ['Expense Transactions'],
    [],
    ['ID', 'Project', 'Amount', 'Currency', 'Description', 'Date', 'Status', 'Requested By', 'Approved By', 'Authorized By', 'Created At'],
  ];
  
  expenses.forEach(expense => {
    const project = projects.find(p => p.id === expense.projectId);
    const currency = currencies.find(c => c.id === expense.currencyId);
    
    worksheetData.push([
      expense.id,
      project?.name || 'N/A',
      expense.amount,
      currency?.code || 'N/A',
      expense.description,
      format(new Date(expense.date), 'MMM dd, yyyy'),
      expense.status,
      expense.requestedBy,
      expense.approvedBy || 'N/A',
      expense.authorizedBy || 'N/A',
      format(new Date(expense.createdAt), 'MMM dd, yyyy HH:mm'),
    ]);
  });
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
  
  const fileName = `expenses_${format(new Date(), 'yyyyMMdd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

