import React from 'react';
import { Helmet } from 'react-helmet';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Générateur de facture - Create Professional Invoices</title>
        <meta name="description" content="Generate professional PDF invoices with ease. Add Détails de l'entreprise, client information, items, and download instantly." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 pt-12 pb-[120px] px-4 sm:px-6 lg:px-8">
        <InvoiceGenerator />
        <Toaster />
      </div>
    </>
  );
}

export default App;