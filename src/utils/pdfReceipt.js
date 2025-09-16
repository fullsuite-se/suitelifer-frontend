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
 * @returns {Object} - Grouped variations by type
 */
const getVariationSummary = (variations) => {
  if (!variations || variations.length === 0) return null;
  
  // Group variations by type
  const groupedVariations = variations.reduce((acc, variation) => {
    const typeName = variation.type_label || variation.type_name || 'Unknown';
    if (!acc[typeName]) {
      acc[typeName] = [];
    }
    acc[typeName].push(variation);
    return acc;
  }, {});

  return groupedVariations;
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
  
  // Centered Title
  const startY = 20;
  
  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('The Gift Suite', 105, startY + 8, { align: 'center' });
  
  // Horizontal line under title
  doc.setDrawColor(200, 200, 200);
  doc.line(20, startY + 12, 190, startY + 12);
  
  // Customer, Status & Date Row
  const infoY = startY + 25;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Customer
  doc.text('Customer', 20, infoY);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text(`${order.first_name || ''} ${order.last_name || ''}`, 20, infoY + 8);
  
  // Status
  doc.setFont(undefined, 'normal');
  doc.setFontSize(12);
  doc.text('Status', 80, infoY);
  doc.setFont(undefined, 'bold');
  doc.text(order.status.charAt(0).toUpperCase() + order.status.slice(1), 80, infoY + 8);
  
  // Date
  doc.setFont(undefined, 'normal');
  doc.text('Date', 140, infoY);
  doc.setFont(undefined, 'bold');
  const orderDate = new Date(order.ordered_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(orderDate, 140, infoY + 8);
  
  // Horizontal Line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, infoY + 15, 190, infoY + 15);
  
  // Items Section
  const itemsY = infoY + 20;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Items', 20, itemsY);
  
  // Use orderItems if available, otherwise fall back to items
  const items = order.orderItems || order.items || [];
  
  let currentY = itemsY + 8;
  
  if (items.length > 0) {
    items.forEach((item, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      // Calculate item height based on content
      let itemHeight = 22; // Base height
      
      // Add height for variations if they exist
      if (item.variations && item.variations.length > 0) {
        const variationSummary = getVariationSummary(item.variations);
        const variationCount = Object.keys(variationSummary).length;
        itemHeight += variationCount * 6; // 6 points per variation line
      }
      
      // Dynamic item container background
      if (index % 2 === 0) {
        // Even items: light gray background
        doc.setFillColor(248, 250, 252);
        doc.rect(15, currentY - 4, 180, itemHeight, 'F');
      } else {
        // Odd items: white background with border
        doc.setFillColor(255, 255, 255);
        doc.rect(15, currentY - 4, 180, itemHeight, 'F');
        doc.setDrawColor(240, 240, 240);
        doc.rect(15, currentY - 4, 180, itemHeight, 'S');
      }
      
      // Item header
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      
      // Handle long product names
      const productName = item.product_name || 'Product';
      const maxWidth = 120; // Leave space for price
      if (doc.getTextWidth(productName) > maxWidth) {
        const lines = doc.splitTextToSize(productName, maxWidth);
        lines.forEach((line, lineIndex) => {
          doc.text(line, 20, currentY + (lineIndex * 4));
        });
        currentY += lines.length * 4;
      } else {
        doc.text(productName, 20, currentY);
      }
      
      // Quantity and price info
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Qty: ${item.quantity} • ${item.price_points} pts each`, 20, currentY + 6);
      
      // Item total (right aligned)
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      const itemTotal = `${item.quantity * item.price_points} pts`;
      const itemTotalWidth = doc.getTextWidth(itemTotal);
      doc.text(itemTotal, 190 - itemTotalWidth, currentY);
      
      // Dynamic Variations - Now properly contained within background
      if (item.variations && item.variations.length > 0) {
        const variationSummary = getVariationSummary(item.variations);
        let variationY = currentY + 12;
        
        Object.entries(variationSummary).forEach(([typeName, variations]) => {
          if (variationY > 250) {
            doc.addPage();
            variationY = 20;
          }
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(100, 100, 100);
          
          const typeLabel = formatLabel(typeName);
          const optionLabels = variations.map(v => v.option_label || v.option_value || 'Unknown');
          const optionsText = optionLabels.join(', ');
          
          // Handle long variation text
          const maxVarWidth = 150;
          if (doc.getTextWidth(`${typeLabel}: ${optionsText}`) > maxVarWidth) {
            const fullText = `${typeLabel}: ${optionsText}`;
            const lines = doc.splitTextToSize(fullText, maxVarWidth);
            lines.forEach((line, lineIndex) => {
              doc.text(line, 20, variationY + (lineIndex * 3));
            });
            variationY += lines.length * 3;
          } else {
            doc.text(`${typeLabel}: ${optionsText}`, 20, variationY);
            variationY += 4;
          }
        });
        
        currentY = variationY + 2;
      } else {
        currentY += 16;
      }
      
      // Horizontal line between items
      if (index < items.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(20, currentY, 190, currentY);
        currentY += 3;
      }
      
      // Spacing between items
      currentY += 3;
    });
  } else {
    // No items message
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text('No items found in this order', 20, currentY);
    currentY += 16;
  }
  
  // Horizontal Line
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  doc.setDrawColor(200, 200, 200);
  doc.line(20, currentY, 190, currentY);
  currentY += 6;
  
  // Summary
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Summary background
  doc.setFillColor(248, 250, 252);
  doc.rect(15, currentY - 4, 180, 16, 'F');
  
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Total Points Used', 20, currentY);
  
  doc.setTextColor(0, 151, 178);
  doc.setFontSize(16);
  const totalText = `${order.total_points} heartbits`;
  const totalWidth = doc.getTextWidth(totalText);
  doc.text(totalText, 190 - totalWidth, currentY);
  
  // Notes Section
  if (order.notes) {
    const notesY = currentY + 20;
    if (notesY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Notes background
    doc.setFillColor(254, 249, 195);
    doc.rect(15, notesY - 4, 180, 20, 'F');
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(146, 64, 14);
    doc.text('📝 Notes', 20, notesY);
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(120, 53, 15);
    // Split long notes into multiple lines if needed
    const maxWidth = 170;
    const lines = doc.splitTextToSize(order.notes, maxWidth);
    lines.forEach((line, index) => {
      doc.text(line, 20, notesY + 5 + (index * 3));
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 20, 280);
    doc.text('Generated on ' + new Date().toLocaleDateString(), 20, 285);
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