import React from 'react';
import { motion } from 'framer-motion';
import { calculateInvoiceTotals } from '@/lib/invoiceCalculations';

const InvoicePreview = ({ invoiceData }) => {
  const { subtotal, tax, total } = calculateInvoiceTotals(invoiceData);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-8 space-y-6"
    >
      <div className="border-b-2 border-[#635bff] pb-4">
        <h2 className="text-3xl font-bold text-gray-900">FACTURE</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">DEPUIS</h3>
          <div className="text-gray-900">
            <p className="font-semibold">{invoiceData.company.name || 'Nom de l\'entreprise'}</p>
            <p className="text-sm">{invoiceData.company.address}</p>
            <p className="text-sm">{invoiceData.company.city} {invoiceData.company.zip}</p>
            <p className="text-sm">{invoiceData.company.email}</p>
            <p className="text-sm">{invoiceData.company.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">À</h3>
          <div className="text-gray-900">
            <p className="font-semibold">{invoiceData.client.name || 'Nom du client'}</p>
            <p className="text-sm">{invoiceData.client.address}</p>
            <p className="text-sm">{invoiceData.client.city} {invoiceData.client.zip}</p>
            <p className="text-sm">{invoiceData.client.email}</p>
            <p className="text-sm">{invoiceData.client.phone}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 font-semibold">Numéro de Facture</p>
          <p className="text-sm font-semibold text-gray-900">{invoiceData.invoiceNumber || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold">Date de facture</p>
          <p className="text-sm font-semibold text-gray-900">{invoiceData.invoiceDate || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold">Date d'Échéance</p>
          <p className="text-sm font-semibold text-gray-900">{invoiceData.dueDate || 'N/A'}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 border-b pb-2">
          <div className="col-span-6">DESCRIPTION</div>
          <div className="col-span-2 text-right">quantité</div>
          <div className="col-span-2 text-right">PRIX</div>
          <div className="col-span-2 text-right">TOTAL</div>
        </div>
        {invoiceData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 text-sm text-gray-900 py-2 border-b">
            <div className="col-span-6">{item.description || 'Item description'}</div>
            <div className="col-span-2 text-right">{item.quantity}</div>
            <div className="col-span-2 text-right">{item.price.toFixed(2)} FCFA</div>
            <div className="col-span-2 text-right font-semibold">{(item.quantity * item.price).toFixed(2)} FCFA</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total</span>
          <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} FCFA</span>
        </div>
        {invoiceData.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remise</span>
            <span className="font-semibold text-red-600">-{invoiceData.discount.toFixed(2)} FCFA</span>
          </div>
        )}
        {invoiceData.taxRate > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax ({invoiceData.taxRate}%)</span>
            <span className="font-semibold text-gray-900">{tax.toFixed(2)} FCFA</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-[#635bff]">
          <span className="text-gray-900">Total</span>
          <span className="text-[#635bff]">{total.toFixed(2)} FCFA</span>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">NOTES</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoiceData.notes}</p>
        </div>
      )}
    </motion.div>
  );
};

export default InvoicePreview;