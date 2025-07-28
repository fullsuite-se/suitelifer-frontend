import jsPDF from 'jspdf';

/**
 * Helper function to format variation labels
 * @param {string} label - The label to format
 * @returns {string} - Formatted label
 */
const formatLabel = (label) => {
  if (typeof label !== 'string') return String(label ?? '');
  return label
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
};

/**
 * Helper function to get variation summary for an item
 * @param {Array} variations - Array of variation objects
 * @returns {string} - Formatted variation summary
 */
const getVariationSummary = (variations) => {
  if (!variations || variations.length === 0) return '';
  
  // Group variations by type
  const groupedVariations = variations.reduce((acc, variation) => {
    const typeName = variation.type_label || variation.type_name || 'Unknown';
    if (!acc[typeName]) {
      acc[typeName] = [];
    }
    acc[typeName].push(variation);
    return acc;
  }, {});

  // Format each variation group
  const variationTexts = Object.entries(groupedVariations).map(([typeName, variations]) => {
    const optionLabels = variations.map(v => v.option_label || v.option_value || 'Unknown');
    return `${formatLabel(typeName)}: ${optionLabels.join(', ')}`;
  });

  return variationTexts.join(' | ');
};

/**
 * Generates a PDF receipt for an order
 * @param {Object} order - Order object with all details
 * @returns {jsPDF} PDF document
 */
export const generateReceiptPDF = (order) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Compact layout
  const startY = 30;
  const lineHeight = 7;
  
  // Order Number
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Order #${order.order_id}`, 20, startY);
  
  // Customer Name (below order number)
  if (order.first_name || order.last_name) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${order.first_name || ''} ${order.last_name || ''}`, 20, startY + lineHeight);
  }
  
  // Status (below customer name)
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const statusY = startY + (lineHeight * 2);
  doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, statusY);
  
  // Order Items Section Header
  const itemsY = statusY + 15;
  doc.setFontSize(16);
  doc.setTextColor(0, 151, 178); // Brand color
  doc.text('Order Items', 20, itemsY);
  
  // Add a line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, itemsY + 3, 190, itemsY + 3);
  
  let yPosition = itemsY + 15;
  
  // Use orderItems if available, otherwise fall back to items
  const items = order.orderItems || order.items || [];
  
  if (items.length > 0) {
    items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Compact item container
      doc.setFillColor(248, 250, 252); // Light blue-gray background
      doc.rect(15, yPosition - 3, 180, 25, 'F');
      
      // Product name and quantity on same line
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(item.product_name || 'Product', 20, yPosition);
      
      // Quantity and price (right aligned)
      const quantityText = `${item.quantity}x ${item.price_points} pts`;
      const quantityWidth = doc.getTextWidth(quantityText);
      doc.text(quantityText, 190 - quantityWidth, yPosition);
      
      // Category (if available) and subtotal on second line
      if (item.product_category) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(item.product_category, 20, yPosition + 8);
      }
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const totalText = `Total: ${item.quantity * item.price_points} pts`;
      const totalWidth = doc.getTextWidth(totalText);
      doc.text(totalText, 190 - totalWidth, yPosition + 8);
      
              // Compact variations display
        if (item.variations && item.variations.length > 0) {
          // Group variations by type
          const groupedVariations = item.variations.reduce((acc, variation) => {
            const typeName = variation.type_name || 'Unknown';
            if (!acc[typeName]) {
              acc[typeName] = [];
            }
            acc[typeName].push(variation);
            return acc;
          }, {});
          
          let variationY = yPosition + 12;
          
          Object.entries(groupedVariations).forEach(([typeName, variations]) => {
            if (variationY > 250) {
              doc.addPage();
              variationY = 20;
            }
            
            // Variation type and options on same line
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            const typeLabel = variations[0]?.type_label || formatLabel(typeName);
            const optionLabels = variations.map(v => v.option_label || v.option_value || 'Unknown');
            const optionsText = optionLabels.join(', ');
            doc.text(`${typeLabel}: ${optionsText}`, 20, variationY);
            
            variationY += 6;
          });
          
          yPosition = variationY + 3;
        } else {
          yPosition += 15;
        }
        
        // Add minimal spacing between items
        yPosition += 5;
    });
  } else {
    // Enhanced no items message
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text('No items found in this order', 20, yPosition);
    yPosition += 20;
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
    // Split long notes into multiple lines if needed
    const maxWidth = 170;
    const lines = doc.splitTextToSize(order.notes, maxWidth);
    lines.forEach((line, index) => {
      doc.text(line, 20, yPosition + 35 + (index * 5));
    });
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