import jsPDF from 'jspdf';
import logo from '../assets/logotipo-macor-mexico.png';

export const generatePNCReport = (doc) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Helper functions
    const drawCheckbox = (x, y, label, checked) => {
        pdf.setLineWidth(0.2);
        pdf.rect(x, y - 3, 4, 4);
        if (checked) {
            pdf.setFont('helvetica', 'bold');
            pdf.text('X', x + 0.8, y + 0.2);
            pdf.setFont('helvetica', 'normal');
        }
        pdf.setFontSize(8);
        pdf.text(label, x + 6, y);
    };

    const drawSectionHeader = (yPos, title) => {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPos, contentWidth, 5, 'F');
        pdf.rect(margin, yPos, contentWidth, 5);
        pdf.text(title, margin + 2, yPos + 3.8);
    };

    // --- HEADER ---
    // Logo
    try {
        pdf.addImage(logo, 'PNG', margin + 2, y + 3, 36, 10);
    } catch (e) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MACOR MÉXICO', margin + 5, y + 9);
    }

    // pdf.rect(margin, y, 40, 15); // Removed box around logo as requested

    // Title
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REPORTE DE PRODUCTO NO CONFORME', pageWidth / 2, y + 8, { align: 'center' });

    // Folio
    pdf.setFontSize(10);
    pdf.text(`N° FOLIO: ${doc.folio || ''}`, pageWidth - margin - 35, y + 8);
    pdf.line(pageWidth - margin - 15, y + 8, pageWidth - margin, y + 8);

    y += 20;

    // --- DETECTADO EN ---
    drawSectionHeader(y, 'DETECTADO EN:');
    y += 5;
    pdf.rect(margin, y, contentWidth, 10);
    const detectX = [margin + 5, margin + 45, margin + 85, margin + 125, margin + 155];
    const detectLabels = ['RECEPCIÓN', 'PROCESO PNC', 'EMBARQUE', 'ALMACENAJE', 'CLIENTE'];
    const detectKeys = ['recepcion', 'procesoPNC', 'embarque', 'almacenaje', 'cliente'];

    detectX.forEach((x, i) => {
        drawCheckbox(x, y + 6.5, detectLabels[i], doc.detectedIn[detectKeys[i]]);
    });
    y += 10;

    // --- DATOS GENERALES ---
    pdf.setLineWidth(0.2);
    pdf.rect(margin, y, contentWidth, 40);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');

    // Row 1: Cliente & Fecha
    pdf.text('CLIENTE:', margin + 2, y + 8);
    pdf.line(margin + 20, y + 8, margin + 130, y + 8);
    pdf.text(doc.cliente || '', margin + 22, y + 7.5);

    pdf.text('FECHA:', margin + 135, y + 8);
    pdf.line(margin + 150, y + 8, contentWidth + margin - 2, y + 8);
    pdf.text(new Date(doc.fecha).toLocaleDateString('es-MX'), margin + 152, y + 7.5);

    // Row 2: Part No & Modelo
    y += 10;
    pdf.text('NÚMERO DE PARTE:', margin + 2, y + 8);
    pdf.line(margin + 35, y + 8, margin + 95, y + 8);
    pdf.text(doc.numParte || '', margin + 37, y + 7.5);

    pdf.text('MODELO O PADRE:', margin + 100, y + 8);
    pdf.line(margin + 135, y + 8, contentWidth + margin - 2, y + 8);
    pdf.text(doc.modeloPadre || '', margin + 137, y + 7.5);

    // Row 3: Dimensions & Weight
    y += 10;
    pdf.text('DIMENSIONES:', margin + 2, y + 8);
    pdf.line(margin + 30, y + 8, margin + 95, y + 8);
    pdf.text(doc.dimensiones || '', margin + 32, y + 7.5);

    pdf.text(`PESO (${doc.pesoUnidad}):`, margin + 100, y + 8);
    pdf.line(margin + 135, y + 8, contentWidth + margin - 2, y + 8);
    pdf.text(doc.peso || '', margin + 137, y + 7.5);

    // Row 4: Quantity & Provider
    y += 10;
    pdf.text('CANTIDAD:', margin + 2, y + 8);
    pdf.line(margin + 20, y + 8, margin + 55, y + 8);
    pdf.text(doc.cantidad || '', margin + 22, y + 7.5);

    pdf.text('UNIDAD:', margin + 60, y + 8);
    pdf.line(margin + 75, y + 8, margin + 95, y + 8);
    pdf.text(doc.unidad || '', margin + 77, y + 7.5);

    pdf.text('PROVEEDOR:', margin + 100, y + 8);
    pdf.line(margin + 125, y + 8, contentWidth + margin - 2, y + 8);
    pdf.text(doc.proveedor || '', margin + 127, y + 7.5);

    y += 10;
    // Row 5: Remision & Fecha Remision
    pdf.text('REMISIÓN / TRANSFERENCIA:', margin + 2, y + 8);
    pdf.line(margin + 55, y + 8, margin + 120, y + 8);
    pdf.text(doc.remision || '', margin + 57, y + 7.5);

    pdf.text('FECHA:', margin + 125, y + 8);
    pdf.line(margin + 140, y + 8, contentWidth + margin - 2, y + 8);
    pdf.text(doc.fechaRemision ? new Date(doc.fechaRemision).toLocaleDateString('es-MX') : '', margin + 142, y + 7.5);

    y += 15;

    // --- DESCRIPCIÓN ---
    drawSectionHeader(y, 'DESCRIPCIÓN DE NO CONFORMIDAD:');
    y += 5;
    pdf.rect(margin, y, contentWidth, 25);
    pdf.setFontSize(8);
    const descLines = pdf.splitTextToSize(doc.descripcionNC || '', contentWidth - 4);
    pdf.text(descLines, margin + 2, y + 5);
    y += 25;

    // --- DICTAMEN ---
    pdf.rect(margin, y, contentWidth, 10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DICTAMEN DE CALIDAD:', margin + 2, y + 6.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(doc.dictamen || '', margin + 45, y + 6.5);
    pdf.line(margin + 44, y + 7, contentWidth - 20, y + 7);
    y += 10;

    // --- ÁREA RESPONSABLE ---
    drawSectionHeader(y, 'ÁREA RESPONSABLE:');
    y += 5;
    pdf.rect(margin, y, contentWidth, 10);
    const areaLabels = ['RECIBO', 'PRODUCCIÓN', 'EMBARQUES', 'OTRO'];
    const areaKeys = ['recibo', 'produccion', 'embarques', 'otro'];
    areaKeys.forEach((key, i) => {
        if (i < 3) {
            drawCheckbox(margin + 5 + (i * 50), y + 6.5, areaLabels[i], doc.areaResponsable?.[key]);
        } else {
            drawCheckbox(margin + 155, y + 6.5, areaLabels[i] + ':', !!doc.areaResponsable?.otros);
            pdf.text(doc.areaResponsable?.otros || '', margin + 172, y + 6.5);
            pdf.line(margin + 170, y + 7, contentWidth + margin - 2, y + 7);
        }
    });
    y += 10;

    // --- DISPOSICIÓN & SOPORTE ---
    pdf.rect(margin, y, contentWidth / 2, 45);
    pdf.rect(margin + contentWidth / 2, y, contentWidth / 2, 45);

    pdf.setFont('helvetica', 'bold');
    pdf.text('DISPOSICIÓN:', margin + 2, y + 5);
    pdf.text('DOCUMENTO DE REFERENCIA Y SOPORTE:', margin + contentWidth / 2 + 2, y + 5);
    pdf.setFont('helvetica', 'normal');

    const dispLabels = ['Devolución a Proveedor', 'Recuperar / Retrabajar', 'Usar c/ desviación', 'Degradar a SCRAP', 'Otro'];
    const dispKeys = ['devolucion', 'recuperar', 'desviacion', 'scrap', 'otro'];
    dispKeys.forEach((key, i) => {
        drawCheckbox(margin + 5, y + 12 + (i * 7), dispLabels[i], doc.disposicion[key]);
        if (key === 'otro' && doc.disposicion.otro) {
            pdf.text(doc.disposicion.otro, margin + 20, y + 12 + (i * 7));
            pdf.line(margin + 18, y + 12 + (i * 7) + 0.5, margin + contentWidth / 2 - 5, y + 12 + (i * 7) + 0.5);
        }
    });

    const sopLabels = ['Certificado de Calidad', 'Especificaciones - Dibujo', 'Reporte de Queja', 'Solicitud de Desviación', 'Otro'];
    const sopKeys = ['certificado', 'especificaciones', 'queja', 'desviacion', 'otro'];
    sopKeys.forEach((key, i) => {
        const xPos = margin + contentWidth / 2 + 5;
        const yPos = y + 12 + (i * 7);

        drawCheckbox(xPos, yPos, sopLabels[i], doc.docsSoporte[key]);

        // Línea para escribir al lado de cada opción
        const lineStartX = xPos + (i === 4 ? 15 : 60); // "Otro" tiene label más corto
        const lineEndX = contentWidth + margin - 5;
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(150, 150, 150);
        pdf.line(lineStartX, yPos + 0.5, lineEndX, yPos + 0.5);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.2);

        if (key === 'otro' && doc.docsSoporte.otro) {
            pdf.text(doc.docsSoporte.otro, lineStartX + 2, yPos);
        }
    });

    y += 45;

    // --- AUTORIZACIONES SCRAP ---
    drawSectionHeader(y, 'PARA DEGRADACIONES A SCRAP REQUIERE LAS SIGUIENTES AUTORIZACIONES:');
    y += 5;
    pdf.rect(margin, y, contentWidth, 15);
    const authX = [margin, margin + contentWidth / 4, margin + contentWidth / 2, margin + (3 * contentWidth / 4)];
    const authLabels = ['Calidad', 'Ingeniería', 'Gerencia de Planta', 'Dirección General'];
    const authKeys = ['calidad', 'ingenieria', 'gerencia', 'direccion'];

    authLabels.forEach((label, i) => {
        pdf.line(authX[i], y, authX[i], y + 15);
        pdf.setFontSize(7);
        pdf.text(label, authX[i] + (contentWidth / 8), y + 13, { align: 'center' });
        pdf.setFontSize(8);
        pdf.text(doc.autorizaciones[authKeys[i]] || '', authX[i] + (contentWidth / 8), y + 7, { align: 'center' });
    });
    y += 15;

    // --- ACCIONES TOMADAS ---
    drawSectionHeader(y, 'ACCIONES TOMADAS:');
    y += 5;
    pdf.rect(margin, y, contentWidth, 20);
    const accLines = pdf.splitTextToSize(doc.accionesTomadas || '', contentWidth - 4);
    pdf.text(accLines, margin + 2, y + 5);
    y += 20;

    // --- NOTIFICADO A ---
    drawSectionHeader(y, 'NOTIFICADO A:');
    y += 5;
    pdf.rect(margin, y, contentWidth, 15);
    const notifyLabels = ['PRODUCCIÓN', 'COMERCIAL', 'INGENIERÍA', 'COMPRAS', 'EMBARQUES', 'OTRO(S):'];
    const notifyKeys = ['produccion', 'comercial', 'ingenieria', 'compras', 'embarques', 'otro'];

    notifyKeys.forEach((key, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const xPos = margin + 5 + (col * 95);
        const yPos = y + 4 + (row * 5);

        if (i < 5) {
            drawCheckbox(xPos, yPos, notifyLabels[i], doc.notificadoA?.[key]);
            // Línea para escribir nombre al lado
            pdf.setLineWidth(0.1);
            pdf.setDrawColor(150, 150, 150);
            pdf.line(xPos + 32, yPos + 0.5, xPos + 88, yPos + 0.5);
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.2);
        } else {
            drawCheckbox(xPos, yPos, notifyLabels[i], !!doc.notificadoA?.otro);
            // Línea para "OTRO(S)"
            pdf.setLineWidth(0.1);
            pdf.setDrawColor(150, 150, 150);
            pdf.line(xPos + 25, yPos + 0.5, xPos + 88, yPos + 0.5);
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.2);
            if (doc.notificadoA?.otro) {
                pdf.text(doc.notificadoA.otro, xPos + 27, yPos);
            }
        }
    });

    y += 15;

    // --- FOOTER: Document Control ---
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('MM-FO-CA-06', pageWidth - margin - 25, pageHeight - 10);
    pdf.text('REV. 02', pageWidth - margin - 25, pageHeight - 6);

    // Save
    pdf.save(`PNC_${doc.folio || doc.id}.pdf`);
};
