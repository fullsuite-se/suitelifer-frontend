import jsPDF from 'jspdf';

/**
 * Generates a PDF receipt for an order
 * @param {Object} order - Order object with all details
 * @returns {jsPDF} PDF document
 */
export const generateReceiptPDF = (order) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(0, 151, 178); // #0097b2
  doc.text('Suitelifer', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Digital Receipt', 20, 40);
  
  // Order Info
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Order #${order.order_id}`, 20, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${new Date(order.ordered_at).toLocaleDateString()}`, 20, 65);
  doc.text(`Time: ${new Date(order.ordered_at).toLocaleTimeString()}`, 20, 72);
  
  // Status
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, 85);
  
  // Items
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Items:', 20, 105);
  
  let yPosition = 115;
  
  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(item.product_name || 'Product', 20, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Quantity: ${item.quantity}`, 20, yPosition + 7);
      doc.text(`Price: ${item.price_points} heartbits`, 20, yPosition + 14);
      doc.text(`Subtotal: ${item.price_points * item.quantity} heartbits`, 20, yPosition + 21);
      
      yPosition += 35;
    });
  }
  
  // Total
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Total:', 20, yPosition);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 151, 178);
  doc.text(`${order.total_points} heartbits`, 20, yPosition + 10);
  
  // Notes
  if (order.notes) {
    if (yPosition + 30 > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Notes:', 20, yPosition + 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(order.notes, 20, yPosition + 35);
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 20, 280);
    doc.text('Thank you for your purchase!', 20, 285);
  }
  
  return doc;
};

/**
 * Downloads a PDF receipt for an order
 * @param {Object} order - Order object with all details
 */
export const downloadReceiptPDF = (order) => {
  const doc = generateReceiptPDF(order);
  const fileName = `receipt-${order.order_id}-${new Date(order.ordered_at).toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

/**
 * Prints a PDF receipt for an order
 * @param {Object} order - Order object with all details
 */
export const printReceiptPDF = (order) => {
  const doc = generateReceiptPDF(order);
  doc.autoPrint();
  doc.output('dataurlnewwindow');
}; 