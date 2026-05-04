import jsPDF from 'jspdf';
import { Donation } from '../types';
import { CHURCH_NAME } from '../constants';

export const generateDonationReceipt = (donation: Donation, userRole?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const timestamp = donation.timestamp?.seconds 
    ? new Date(donation.timestamp.seconds * 1000)
    : new Date();

  const dateStr = timestamp.toLocaleDateString('en-GB'); // Ghanaian format DD/MM/YYYY
  const timeStr = timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // styling
  const brandInk = '#1A1A1A';
  const brandGold = '#D4AF37';
  const brandCream = '#FDFCF9';
  const brandOlive = '#1A2B23';

  // Background
  doc.setFillColor(brandCream);
  doc.rect(0, 0, 148, 210, 'F');

  // Header Bar
  doc.setFillColor(brandInk);
  doc.rect(0, 0, 148, 50, 'F');
  
  doc.setTextColor('#FFFFFF');
  doc.setFont('serif', 'italic');
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(CHURCH_NAME, 120);
  doc.text(titleLines, 74, 18, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(brandGold);
  doc.text('OFFICIAL STEWARDSHIP RECEIPT', 74, 38, { align: 'center', charSpace: 1 });

  // Decorative Line
  doc.setDrawColor(brandGold);
  doc.setLineWidth(0.5);
  doc.line(54, 42, 94, 42);

  // Content Area
  doc.setTextColor(brandInk);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Left Column: Donor
  doc.setTextColor(brandInk);
  doc.setFont('helvetica', 'bold');
  doc.text(userRole === 'admin' ? 'ADMINISTRATIVE LOG' : 'FAITHFUL STEWARD', 20, 65);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(donation.userName, 20, 72);
  doc.setTextColor('#666666');
  doc.text(donation.userEmail, 20, 78);

  // Right Column: Receipt Info
  doc.setTextColor(brandInk);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RECEIPT DETAILS', 90, 65);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#666666');
  doc.text(`Receipt #: ${donation.id?.slice(-8).toUpperCase() || 'GH-NEW-ENTRY'}`, 90, 72);
  doc.text(`Date: ${dateStr}`, 90, 78);
  doc.text(`Time: ${timeStr} (GMT)`, 90, 84);

  // Table
  doc.setFillColor(brandOlive);
  doc.rect(20, 100, 108, 12, 'F');
  
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DESCRIPTION', 25, 107.5);
  doc.text('AMOUNT', 110, 107.5);

  // Row
  doc.setTextColor(brandInk);
  doc.setFont('helvetica', 'normal');
  doc.text(donation.category, 25, 124);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`GHS ${donation.amount.toLocaleString()}`, 110, 124);

  // Border for amount cell
  doc.setDrawColor('#EFEFEF');
  doc.line(20, 134, 128, 134);

  // Message
  doc.setTextColor(brandInk);
  doc.setFont('serif', 'italic');
  doc.setFontSize(11);
  
  let message = "Your sacrificial gift sustains our digital sanctuary and sanctifies our collective mission in Ghana and beyond.";
  if (userRole === 'admin') {
    message = "This record has been officially logged into the congregation's stewardship ledger. Thank you for your faithful administration.";
  }
  
  const splitMessage = doc.splitTextToSize(message, 100);
  doc.text(splitMessage, 74, 155, { align: 'center', lineHeightFactor: 1.5 });

  // Signature Area
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#999999');
  doc.text('__________________________', 74, 185, { align: 'center' });
  doc.text('Finance Department - Accra, Ghana', 74, 190, { align: 'center' });

  // Final Footer
  doc.setFontSize(7);
  doc.text(`This document is for internal verification and tax-deductible reference in Ghana. Generated on: ${dateStr} ${timeStr}`, 74, 202, { align: 'center' });

  doc.save(`Receipt_${donation.id?.slice(-6) || 'donation'}_GH.pdf`);
};
