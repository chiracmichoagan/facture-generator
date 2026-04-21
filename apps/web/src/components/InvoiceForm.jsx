import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Download } from 'lucide-react';
import { calculateInvoiceTotals } from '@/lib/invoiceCalculations';
import { generatePDF } from '@/lib/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';


const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
  const { toast } = useToast();

  const updateField = (section, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };
  
  const { subtotal, tax, total } = calculateInvoiceTotals(invoiceData);

  const handleDownloadPDF = () => {
    try {
      generatePDF(invoiceData);
      toast({
        title: "Success!",
        description: "Your invoice PDF has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };


  return (
    <div className="bg-white rounded-[16px] shadow-sm p-6 sm:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Détails de l'entreprise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <Label htmlFor="company-name">Nom de l'entreprise</Label>
            <Input
              id="company-name"
              value={invoiceData.company.name}
              onChange={(e) => updateField('company', 'name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company-email">Email</Label>
            <Input
              id="company-email"
              type="email"
              value={invoiceData.company.email}
              onChange={(e) => updateField('company', 'email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company-address">Address</Label>
            <Input
              id="company-address"
              value={invoiceData.company.address}
              onChange={(e) => updateField('company', 'address', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company-phone">Téléphone</Label>
            <Input
              id="company-phone"
              value={invoiceData.company.phone}
              onChange={(e) => updateField('company', 'phone', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company-city">Ville</Label>
            <Input
              id="company-city"
              value={invoiceData.company.city}
              onChange={(e) => updateField('company', 'city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company-zip">Code ZIP</Label>
            <Input
              id="company-zip"
              value={invoiceData.company.zip}
              onChange={(e) => updateField('company', 'zip', e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Client details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <Label htmlFor="client-name">Nom du client</Label>
            <Input
              id="client-name"
              value={invoiceData.client.name}
              onChange={(e) => updateField('client', 'name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              value={invoiceData.client.email}
              onChange={(e) => updateField('client', 'email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-address">Address</Label>
            <Input
              id="client-address"
              value={invoiceData.client.address}
              onChange={(e) => updateField('client', 'address', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-phone">Téléphone</Label>
            <Input
              id="client-phone"
              value={invoiceData.client.phone}
              onChange={(e) => updateField('client', 'phone', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-city">Ville</Label>
            <Input
              id="client-city"
              value={invoiceData.client.city}
              onChange={(e) => updateField('client', 'city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-zip">Code ZIP</Label>
            <Input
              id="client-zip"
              value={invoiceData.client.zip}
              onChange={(e) => updateField('client', 'zip', e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Informations sur la facture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="invoice-number">Numéro de facture</Label>
            <Input
              id="invoice-number"
              value={invoiceData.invoiceNumber}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="invoice-date">Date de la facture</Label>
            <Input
              id="invoice-date"
              type="date"
              value={invoiceData.invoiceDate}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="due-date">Date d'échéance</Label>
            <Input
              id="due-date"
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-900">Items</h2>
        </div>
        <div className="space-y-4">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50/70 rounded-[8px] items-end">
              <div className="md:col-span-5">
                <Label htmlFor={`item-desc-${index}`}>Description</Label>
                <Input
                  id={`item-desc-${index}`}
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`item-qty-${index}`}>Quantité</Label>
                <Input
                  id={`item-qty-${index}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`item-price-${index}`}>Prix</Label>
                <Input
                  id={`item-price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', e.target.value)}
                  onBlur={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Total</Label>
                <div className="h-10 flex items-center px-3 font-semibold text-gray-900">
                  {(item.quantity * item.price).toFixed(2)}FCFA
                </div>
              </div>
              <div className="md:col-span-1 flex justify-end">
                <Button
                  onClick={() => removeItem(index)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all hover:scale-105"
                  disabled={invoiceData.items.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
            onClick={addItem}
            variant="outline"
            className="w-full border-[#cad1dd] hover:bg-gray-50 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un item
          </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex justify-end pt-4">
            <div className="w-full max-w-sm space-y-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                  <Label htmlFor="discount">Remise (FCFA)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoiceData.discount}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, discount: e.target.value }))}
                    onBlur={(e) => setInvoiceData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tax-rate">Taux de taxe (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoiceData.taxRate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: e.target.value }))}
                    onBlur={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold text-gray-900">{subtotal.toFixed(2)}FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remise</span>
                <span className="font-semibold text-gray-900">{(parseFloat(invoiceData.discount) || 0).toFixed(2)}FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({invoiceData.taxRate || 0}%)</span>
                <span className="font-semibold text-gray-900">{tax.toFixed(2)}FCFA</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{total.toFixed(2)}FCFA</span>
              </div>
            </div>
          </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Détails supplémentaires</h2>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={invoiceData.notes}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
            placeholder="Notes complémentaires ou conditions de paiement..."
          />
        </div>
      </motion.div>

      {/* Download button for mobile */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
        }}
        initial="hidden"
        animate="visible"
        className="block sm:hidden mt-8" // Visible on mobile, hidden on small screens and up
      >
        <Button
          onClick={handleDownloadPDF}
          className="w-full bg-[#635bff] hover:bg-[#5248e6] text-white transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </motion.div>
    </div>
  );
};

export default InvoiceForm;