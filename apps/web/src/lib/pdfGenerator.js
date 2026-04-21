import jsPDF from 'jspdf';
import { calculateInvoiceTotals } from '@/lib/invoiceCalculations';

// ─── Fonction interne qui construit le doc jsPDF ─────────────────────────────
const buildPDFDoc = (invoiceData) => {
  const doc = new jsPDF();
  const { subtotal, tax, total } = calculateInvoiceTotals(invoiceData);

  const primaryColor = [99, 91, 255];
  let yPos = 20;

  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('FACTURE', 20, yPos);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 3, 190, yPos + 3);

  yPos += 15;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('DE', 20, yPos);
  doc.text('POUR', 110, yPos);

  yPos += 5;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text(invoiceData.company.name || "Nom de l'Entreprise", 20, yPos);
  doc.text(invoiceData.client.name || 'Nom du Client', 110, yPos);

  yPos += 5;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  const companyDetails = [
    invoiceData.company.address,
    `${invoiceData.company.city} ${invoiceData.company.zip}`,
    invoiceData.company.email,
    invoiceData.company.phone
  ].filter(Boolean);

  const clientDetails = [
    invoiceData.client.address,
    `${invoiceData.client.city} ${invoiceData.client.zip}`,
    invoiceData.client.email,
    invoiceData.client.phone
  ].filter(Boolean);

  companyDetails.forEach(detail => {
    doc.text(detail, 20, yPos);
    yPos += 4;
  });

  yPos = 45;
  clientDetails.forEach(detail => {
    doc.text(detail, 110, yPos);
    yPos += 4;
  });

  yPos = Math.max(yPos, 70);

  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos, 170, 15, 'F');

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'bold');
  doc.text('Numéro de Facture', 25, yPos + 5);
  doc.text('Date de Facture', 80, yPos + 5);
  doc.text("Date d'Échéance", 135, yPos + 5);

  yPos += 9;
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  doc.text(invoiceData.invoiceNumber || 'N/A', 25, yPos);
  doc.text(invoiceData.invoiceDate || 'N/A', 80, yPos);
  doc.text(invoiceData.dueDate || 'N/A', 135, yPos);

  yPos += 15;

  doc.setFillColor(...primaryColor);
  doc.rect(20, yPos, 170, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('DESCRIPTION', 25, yPos + 5);
  doc.text('QTÉ',        125, yPos + 5, { align: 'center' });
  doc.text('PRIX',       158, yPos + 5, { align: 'right'  });
  doc.text('TOTAL',      190, yPos + 5, { align: 'right'  });

  yPos += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);

  // ── Lignes articles ──
  invoiceData.items.forEach((item, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    const qty       = parseFloat(item.quantity) || 0;
    const price     = parseFloat(item.price)    || 0;
    const itemTotal = qty * price;

    yPos += 4; // ← margin top entre chaque ligne

    const desc = item.description || "Description de l'article";
    const truncated = doc.splitTextToSize(desc, 90)[0];

    doc.text(truncated,                        25,  yPos);
    doc.text(qty.toString(),                  125,  yPos, { align: 'center' });
    doc.text(`${price.toFixed(2)} FCFA`,      158,  yPos, { align: 'right'  });
    doc.text(`${itemTotal.toFixed(2)} FCFA`,  190,  yPos, { align: 'right'  });

    yPos += 6;

    if (index < invoiceData.items.length - 1) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(20, yPos, 190, yPos);
      yPos += 2;
    }
  });

  yPos += 10;

  // ── Totaux alignés à droite ──
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');

  doc.text('Sous-Total :',                    155, yPos, { align: 'right' });
  doc.text(`${subtotal.toFixed(2)} FCFA`,     190, yPos, { align: 'right' });

  if (parseFloat(invoiceData.discount) > 0) {
    yPos += 6;
    doc.setTextColor(220, 38, 38);
    doc.text('Remise :',                                              155, yPos, { align: 'right' });
    doc.text(`-${parseFloat(invoiceData.discount).toFixed(2)} FCFA`, 190, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  }

  if (parseFloat(invoiceData.taxRate) > 0) {
    yPos += 6;
    doc.text(`Taxe (${invoiceData.taxRate}%) :`, 155, yPos, { align: 'right' });
    doc.text(`${tax.toFixed(2)} FCFA`,           190, yPos, { align: 'right' });
  }

  yPos += 8;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(140, yPos - 2, 190, yPos - 2);

  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Total :',                   155, yPos + 3, { align: 'right' });
  doc.text(`${total.toFixed(2)} FCFA`,  190, yPos + 3, { align: 'right' });

  if (invoiceData.notes) {
    yPos += 15;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'bold');
    doc.text('NOTES', 20, yPos);

    yPos += 5;
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60, 60, 60);
    const splitNotes = doc.splitTextToSize(invoiceData.notes, 170);
    doc.text(splitNotes, 20, yPos);
  }

  return doc;
};

// ─── Télécharger le PDF ───────────────────────────────────────────────────────
export const generatePDF = (invoiceData) => {
  const doc = buildPDFDoc(invoiceData);
  const fileName = `Facture_${invoiceData.invoiceNumber || 'brouillon'}.pdf`;
  doc.save(fileName);
};

// ─── Envoyer la facture sur WhatsApp ─────────────────────────────────────────
// export const sendInvoiceWhatsApp = (invoiceData, toast) => {
//   const rawPhone = invoiceData.client.phone?.trim();

//   if (!rawPhone) {
//     toast({
//       title: "Numéro manquant",
//       description: "Veuillez renseigner le numéro de téléphone du client avant d'envoyer.",
//       variant: "destructive",
//     });
//     return;
//   }

//   const doc = buildPDFDoc(invoiceData);
//   const fileName = `Facture_${invoiceData.invoiceNumber || 'brouillon'}.pdf`;
//   doc.save(fileName);

//   const { total } = calculateInvoiceTotals(invoiceData);
//   const numero = rawPhone.replace(/[\s\-\(\)]/g, '');

//   const message =
// `Bonjour ${invoiceData.client.name || ''},

// Veuillez trouver ci-joint votre facture N° *${invoiceData.invoiceNumber || 'N/A'}*.

// 📋 *Détails de la facture :*
// 🗓️ Date : ${invoiceData.invoiceDate || '-'}
// 📆 Échéance : ${invoiceData.dueDate || '-'}
// 💰 *Total : ${total.toFixed(2)} FCFA*

// Le PDF vient d'être téléchargé sur votre appareil.
// Vous pouvez maintenant l'envoyer ou l'imprimer.

// Merci pour votre confiance ! 🙏
// — ${invoiceData.company.name || ''}`;

//   setTimeout(() => {
//     const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
//     window.open(url, '_blank');
//   }, 500);
// };