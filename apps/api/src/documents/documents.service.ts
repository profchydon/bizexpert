import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';
import { formatNGN } from '../common/utils/decimal.util';
import { dec } from '../common/utils/prisma-decimal.util';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateSaleInvoicePdf(saleId: string, businessId: string): Promise<Buffer> {
    const sale = await this.prisma.sale.findFirst({
      where: { id: saleId, businessId },
      include: { saleItems: true, payments: true, location: true },
    });
    if (!sale) throw new NotFoundException('Sale not found');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text('TAX INVOICE / DELIVERY NOTE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(11).text(`Sale: ${sale.saleNumber}`);
      doc.text(`Date: ${sale.createdAt.toISOString().slice(0, 16).replace('T', ' ')}`);
      doc.text(`Location: ${sale.location?.name ?? '—'}`);
      if (sale.customerName) doc.text(`Customer: ${sale.customerName}`);
      doc.moveDown();
      doc.text('Items', { underline: true });
      for (const item of sale.saleItems ?? []) {
        doc.text(
          `${item.productName} · ${item.quantity} ${item.unitName} @ ${formatNGN(dec(item.unitPrice))} = ${formatNGN(dec(item.lineTotal))}`,
        );
      }
      doc.moveDown();
      doc.text(`Subtotal: ${formatNGN(dec(sale.subtotal))}`);
      doc.text(`Discount: ${formatNGN(dec(sale.discountAmount))}`);
      doc.fontSize(13).text(`Total: ${formatNGN(dec(sale.totalAmount))}`, { continued: false });
      doc.fontSize(11).text(`Payment: ${sale.paymentStatus}`);
      doc.moveDown();
      doc.text('Thank you for your business.', { align: 'center' });
      doc.end();
    });
  }
}
