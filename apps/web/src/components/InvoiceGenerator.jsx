import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText } from 'lucide-react';
import { generatePDF, sendInvoiceWhatsApp } from '@/lib/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

// ─── Icône WhatsApp SVG (pas besoin d'une lib externe) ───────────────────────
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InvoiceGenerator = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    company: { name: '', address: '', city: '', zip: '', email: '', phone: '' },
    client:  { name: '', address: '', city: '', zip: '', email: '', phone: '' },
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 0,
    discount: 0,
    notes: ''
  });

  const initialInvoiceData = {
  company: { name: '', address: '', city: '', zip: '', email: '', phone: '' },
  client:  { name: '', address: '', city: '', zip: '', email: '', phone: '' },
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [{ description: '', quantity: 1, price: 0 }],
  taxRate: 0,
  discount: 0,
  notes: ''
};

  useEffect(() => {
    const handleScroll = () => setIsHeaderVisible(window.scrollY > 150);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadPDF = () => {
    try {
      generatePDF(invoiceData);
      toast({ title: "Succès !", description: "Votre facture PDF a été téléchargée." });
      // window.location.reload();
           // Vider le formulaire proprement sans recharger la page
    setTimeout(() => {
      setInvoiceData(initialInvoiceData);
        // window.location.reload();
    }, 1000);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de générer le PDF.", variant: "destructive" });
    }
  };

  const handleSendWhatsApp = () => {
    try {
      sendInvoiceWhatsApp(invoiceData, toast);
      toast({
        title: "WhatsApp ouvert !",
        description: "Le PDF a été téléchargé et WhatsApp s'est ouvert avec le message.",
      });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'envoyer sur WhatsApp.", variant: "destructive" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  // ── Boutons d'action réutilisés dans le header ET dans la page ──────────────
  const ActionButtons = () => (
    <>
      {/* Aperçu */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="transition-all hover:scale-105 border-[#cad1dd]">
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full h-full max-w-full max-h-full p-16 overflow-y-auto border-none bg-transparent">
          <InvoicePreview invoiceData={invoiceData} />
        </DialogContent>
      </Dialog>

      {/* Télécharger PDF */}
      <Button
        onClick={handleDownloadPDF}
        className="bg-[#635bff] hover:bg-[#5248e6] text-white transition-all hover:scale-105"
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger
      </Button>

      {/* ── Envoyer sur WhatsApp ── */}
      {/* <Button
        onClick={handleSendWhatsApp}
        className="text-white transition-all hover:scale-105"
        style={{ backgroundColor: '#25D366' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1ebe5d')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#25D366')}
      >
        <WhatsAppIcon />
        <span className="ml-2">Envoyer WhatsApp</span>
      </Button> */}
    </>
  );

  return (
    <>
      <Helmet>
        <title>Générateur de facture - Create Professional Invoices</title>
        <meta name="description" content="Generate professional PDF invoices with ease." />
      </Helmet>

      {/* ── Header sticky desktop ── */}
      <AnimatePresence>
        {isHeaderVisible && (
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="hidden sm:flex fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm"
          >
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#635bff]" />
                  Générateur de facture
                </h1>
                <div className="flex flex-wrap gap-3 justify-end">
                  <ActionButtons />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page principale ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-[#635bff]" />
              Générateur de facture
            </h1>
            <p className="text-gray-500 mt-1">Créez des factures professionnelles en quelques secondes</p>
          </div>
          <div className="hidden sm:flex flex-wrap gap-3 justify-end">
            <ActionButtons />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
        </motion.div>
      </motion.div>
    </>
  );
};

export default InvoiceGenerator;