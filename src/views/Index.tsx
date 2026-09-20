import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FreightBillForm } from '@/components/FreightBillForm';
import { FreightBillPrintView } from '@/components/FreightBillPrintView';
import { LetterHeadForm } from '@/components/LetterHeadForm';
import { LetterHeadPrintView } from '@/components/LetterHeadPrintView';
import { ProfileSection } from '@/components/ProfileSection';
import { FreightBillData, initialBillData } from '@/types/bill';
import { LetterData, initialLetterData } from '@/types/letter';
import { numberToWords } from '@/utils/numberToWords';
import * as supabaseService from '@/lib/supabaseService';
import * as letterService from '@/lib/letterService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Truck, Printer, RotateCcw, FileText, Search, Trash2, Edit, Plus, RefreshCw, FileDown, AlertCircle, LogOut, CheckCircle, Clock, ArrowUpRight, Mail, Eye, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';
import { useTheme } from 'next-themes';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FreightBillData>(initialBillData);
  const [isExisting, setIsExisting] = useState(false);
  const [originalBillNo, setOriginalBillNo] = useState<string | null>(null);
  const [bills, setBills] = useState<FreightBillData[]>([]);
  const [userHandle, setUserHandle] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scale, setScale] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Letter Head States
  const [letterData, setLetterData] = useState<LetterData>(initialLetterData);
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [isExistingLetter, setIsExistingLetter] = useState(false);
  const [letterSubTab, setLetterSubTab] = useState<'compose' | 'preview' | 'history'>('compose');
  const [letterSearchQuery, setLetterSearchQuery] = useState('');
  const [letterScale, setLetterScale] = useState(1);
  const letterPrintRef = useRef<HTMLDivElement>(null);
  const letterContainerRef = useRef<HTMLDivElement>(null);

  // Fetch all bills from Database (Supabase with localStorage fallback)
  const fetchBills = async () => {
    try {
      const data = await supabaseService.getFreightBills();
      setBills(data);
    } catch (e: any) {
      toast.error('Failed to load bills: ' + e.message);
    }
  };

  // Fetch all letters from Database (Supabase with localStorage fallback)
  const fetchLetters = async () => {
    try {
      const data = await letterService.getLetters();
      setLetters(data);
    } catch (e: any) {
      toast.error('Failed to load letters: ' + e.message);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchBills();
    fetchLetters();

    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const email = user.email || '';
          setUserEmail(email);
          if (email.endsWith('@arc-bilty.com')) {
            setUserHandle(email.split('@')[0]);
          } else {
            setUserHandle(email);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        const targetWidth = 794; 
        const padding = 16;
        const availableWidth = parentWidth - padding;
        if (availableWidth < targetWidth) {
          setScale(availableWidth / targetWidth);
        } else {
          setScale(0.95);
        }
      }
      if (letterContainerRef.current) {
        const parentWidth = letterContainerRef.current.clientWidth;
        const targetWidth = 794;
        const padding = 16;
        const availableWidth = parentWidth - padding;
        if (availableWidth < targetWidth) {
          setLetterScale(availableWidth / targetWidth);
        } else {
          setLetterScale(0.95);
        }
      }
    };

    if (activeTab === 'preview' || (activeTab === 'letterhead' && letterSubTab === 'preview')) {
      const timer = setTimeout(handleResize, 100);
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, letterSubTab]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `FreightBill-${formData.billNo || 'preview'}`,
    onAfterPrint: () => {
      toast.success('Bill sent to printer!');
    }
  });

  const handleLetterPrint = useReactToPrint({
    contentRef: letterPrintRef,
    documentTitle: `Letter-${letterData.recipientName || 'ARC'}-${letterData.date}`,
    onAfterPrint: () => {
      toast.success('Letter sent to printer!');
    }
  });

  const handleExportLetterPdf = () => {
    if (!letterPrintRef.current) { toast.error('Nothing to export'); return; }

    const filename = `Letter-${letterData.recipientName || 'ARC'}-${letterData.date}`;
    const contentHtml = letterPrintRef.current.outerHTML;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error('Popup blocked. Please allow popups for this site and try again.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${filename}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;900&family=Noto+Serif:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; }
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  ${contentHtml}
  <script>
    // Wait for fonts to load then print
    document.fonts.ready.then(function() {
      setTimeout(function() {
        window.print();
        setTimeout(function() { window.close(); }, 500);
      }, 300);
    });
  </script>
</body>
</html>`);
    printWindow.document.close();
    toast.success('Print dialog opened — choose "Save as PDF" to download.');
  };



  const handleSaveLetter = async () => {
    if (!letterData.recipientName && !letterData.content) {
      toast.error('Please enter a recipient name or letter description');
      return;
    }
    try {
      const saved = await letterService.saveLetter(letterData);
      setLetterData(saved);
      setIsExistingLetter(true);
      toast.success('Letter saved successfully!');
      fetchLetters();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save letter');
    }
  };

  const handleNewLetter = () => {
    setLetterData({
      ...initialLetterData,
      id: `letter_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    });
    setIsExistingLetter(false);
    setLetterSubTab('compose');
    toast.success('New letter ready for writing.');
  };

  const handleDeleteLetter = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this letter?')) {
      try {
        await letterService.deleteLetter(id);
        toast.success('Letter deleted successfully.');
        if (letterData.id === id) {
          handleNewLetter();
        }
        fetchLetters();
      } catch (e: any) {
        toast.error('Failed to delete letter');
      }
    }
  };

  const handleLoadLetter = (letter: LetterData) => {
    setLetterData(letter);
    setIsExistingLetter(true);
    setLetterSubTab('compose');
    setActiveTab('letterhead');
    toast.info(`Loaded letter for ${letter.recipientName || 'recipient'}`);
  };

  const handleFormChange = (newData: FreightBillData) => {
    const totalChanged = newData.totalFreight !== formData.totalFreight;
    const advanceChanged = newData.advancePayment !== formData.advancePayment;
    
    if (totalChanged || advanceChanged) {
      const balance = newData.totalFreight - (newData.advancePayment || 0);
      const words = numberToWords(balance.toString());
      setFormData({
        ...newData,
        rupeesInWords: words
      });
    } else {
      setFormData(newData);
    }
  };

  const handleNewBill = () => {
    // Auto-calculate the next bill number based on history
    let nextBillNo = '';
    if (bills.length > 0) {
      // Find the highest numeric bill number to increment
      const numericBills = bills
        .map(b => parseInt(b.billNo))
        .filter(n => !isNaN(n));
      if (numericBills.length > 0) {
        nextBillNo = (Math.max(...numericBills) + 1).toString();
      }
    }

    setFormData({
      ...initialBillData,
      billNo: nextBillNo,
      date: new Date().toISOString().split('T')[0]
    });
    setIsExisting(false);
    setOriginalBillNo(null);
    setActiveTab('form');
    toast.success('Form cleared. Ready for new entry.');
  };

  const handleResetForm = () => {
    setFormData({
      ...initialBillData,
      date: new Date().toISOString().split('T')[0]
    });
    setIsExisting(false);
    setOriginalBillNo(null);
    toast.info('Form cleared.');
  };

  const handleSaveBill = async () => {
    if (!formData.billNo) {
      toast.error('Please enter a Bill Number');
      return;
    }
    if (!formData.clientName) {
      toast.error('Please enter a Client Name (M/s)');
      return;
    }

    try {
      if (isExisting) {
        await supabaseService.updateFreightBill(formData, originalBillNo || formData.billNo);
        setOriginalBillNo(formData.billNo);
        toast.success(`Bill No. ${formData.billNo} updated successfully!`);
      } else {
        await supabaseService.createFreightBill(formData);
        setIsExisting(true);
        setOriginalBillNo(formData.billNo);
        toast.success(`Bill No. ${formData.billNo} saved successfully!`);
      }
      fetchBills();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save bill');
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('arc_guest_mode');
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Logout failed: ' + error.message);
      } else {
        toast.success('Logged out successfully!');
      }
    }
    window.location.reload();
  };

  const handleDeleteBill = async (billNo: string) => {
    if (window.confirm(`Are you sure you want to delete Bill Number: ${billNo}?`)) {
      try {
        await supabaseService.deleteFreightBill(billNo);
        toast.success(`Bill No. ${billNo} deleted successfully.`);
        if (formData.billNo === billNo) {
          handleNewBill();
        }
        fetchBills();
      } catch (e: any) {
        toast.error('Failed to delete bill');
      }
    }
  };

  const handleLoadBill = (bill: FreightBillData) => {
    setFormData(bill);
    setIsExisting(true);
    setOriginalBillNo(bill.billNo);
    setActiveTab('form');
    toast.info(`Loaded Bill No. ${bill.billNo}`);
  };

  const handleTogglePaymentStatus = async (billNo: string, currentStatus?: 'pending' | 'received') => {
    const newStatus = currentStatus === 'received' ? 'pending' : 'received';
    try {
      await supabaseService.updatePaymentStatus(billNo, newStatus);
      toast.success(`Bill No. ${billNo} marked as ${newStatus}`);
      fetchBills();
      if (formData.billNo === billNo) {
        setFormData(prev => ({ ...prev, paymentStatus: newStatus }));
      }
    } catch (e: any) {
      toast.error('Failed to update status: ' + e.message);
    }
  };

  // Dashboard Calculations
  const totalBillsCount = bills.length;
  const totalFreightAmount = bills.reduce((sum, b) => sum + (b.totalFreight || 0), 0);
  
  const receivedBills = bills.filter(b => b.paymentStatus === 'received');
  const pendingBills = bills.filter(b => !b.paymentStatus || b.paymentStatus === 'pending');

  const totalReceivedAmount = bills.reduce((sum, b) => {
    if (b.paymentStatus === 'received') {
      return sum + (b.totalFreight || 0);
    } else {
      return sum + (b.advancePayment || 0);
    }
  }, 0);

  const totalPendingAmount = bills.reduce((sum, b) => {
    if (b.paymentStatus === 'received') {
      return sum;
    } else {
      return sum + ((b.totalFreight || 0) - (b.advancePayment || 0));
    }
  }, 0);

  const receivedPercent = totalFreightAmount > 0 
    ? Math.round((totalReceivedAmount / totalFreightAmount) * 100) 
    : 0;

  // Filter list based on search term
  const filteredBills = bills.filter(b => {
    if (!b) return false;
    const billNo = String(b.billNo || '').toLowerCase();
    const clientName = String(b.clientName || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesHeader = billNo.includes(query) || clientName.includes(query);
    
    const entries = Array.isArray(b.entries) ? b.entries : [];
    const matchesEntries = entries.some(e => {
      if (!e) return false;
      const lorryNo = String(e.lorryNo || '').toLowerCase();
      const lrNoDate = String(e.lrNoDate || '').toLowerCase();
      return lorryNo.includes(query) || lrNoDate.includes(query);
    });
    
    return matchesHeader || matchesEntries;
  });

  // Filter letters based on search term
  const filteredLetters = letters.filter(l => {
    if (!l) return false;
    const query = (letterSearchQuery || '').toLowerCase();
    const refNo = String(l.refNo || '').toLowerCase();
    const recipient = String(l.recipientName || '').toLowerCase();
    const content = String(l.content || '').toLowerCase();
    const date = String(l.date || '').toLowerCase();
    return refNo.includes(query) || recipient.includes(query) || content.includes(query) || date.includes(query);
  });

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)] flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--line)] sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center rounded-full text-white font-black text-sm w-10 h-10 shrink-0 border border-[var(--line)] shadow-md select-none"
              style={{ backgroundColor: '#E11D3C' }}
            >
              ARC
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide text-[#E11D3C] leading-tight">
                ANJANEYA ROAD CARRIERS
              </h1>
              <p className="text-[10px] sm:text-xs text-[var(--muted)]">Freight Billing & Consignment Manager</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto border-t border-[var(--line)] sm:border-t-0 pt-2 sm:pt-0">
            {userHandle && (
              <ProfileSection userHandle={userHandle} userEmail={userEmail} />
            )}

            {/* Theme Toggle (Light / Dark) */}
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              variant="outline"
              size="sm"
              className="gap-1.5 border-[var(--line)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs h-8 px-2.5 transition-all select-none"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {mounted && theme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[var(--warning)]" />
                  <span className="text-xs font-semibold">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[var(--secondary)]" />
                  <span className="text-xs font-semibold">Dark</span>
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              {activeTab === 'letterhead' ? (
                <>
                  <Button 
                    onClick={handleNewLetter}
                    variant="outline"
                    size="sm"
                    className="gap-1 border-[var(--line)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs h-8 px-2.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Letter
                  </Button>
                  <Button 
                    onClick={handleSaveLetter}
                    size="sm"
                    className="gap-1 bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white font-semibold text-xs h-8 px-2.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {isExistingLetter ? 'Update Letter' : 'Save Letter'}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleNewBill}
                    variant="outline"
                    size="sm"
                    className="gap-1 border-[var(--line)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs h-8 px-2.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New
                  </Button>
                  <Button 
                    onClick={handleSaveBill}
                    size="sm"
                    className="gap-1 bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white font-semibold text-xs h-8 px-2.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {isExisting ? 'Update' : 'Save'}
                  </Button>
                </>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-1 text-[var(--muted)] hover:text-[var(--arc-red)] hover:bg-[var(--surface)] h-8 px-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
            <TabsList className="bg-[var(--surface)] border border-[var(--line)] p-1 grid grid-cols-2 sm:grid-cols-5 w-full md:max-w-2xl">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-[var(--secondary)] data-[state=active]:text-white text-[var(--muted)] hover:text-[var(--ink)]">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="form" className="data-[state=active]:bg-[var(--secondary)] data-[state=active]:text-white text-[var(--muted)] hover:text-[var(--ink)]">
                Billing Form
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-[var(--secondary)] data-[state=active]:text-white text-[var(--muted)] hover:text-[var(--ink)]">
                Bill Preview
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-[var(--secondary)] data-[state=active]:text-white text-[var(--muted)] hover:text-[var(--ink)]">
                History ({bills.length})
              </TabsTrigger>
              <TabsTrigger value="letterhead" className="data-[state=active]:bg-[var(--secondary)] data-[state=active]:text-white text-[var(--muted)] hover:text-[var(--ink)] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Letter Head ({letters.length})
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'history' && (
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Bill No, Client, Lorry..."
                  className="pl-9 bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)]"
                />
              </div>
            )}
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="outline-none space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Bills */}
              <Card className="bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-[var(--muted)]">Total Bills</CardTitle>
                  <FileText className="h-4 w-4 text-[var(--secondary)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--ink)]">{totalBillsCount}</div>
                  <p className="text-[10px] text-[var(--muted)] mt-1">All-time generated invoices</p>
                </CardContent>
              </Card>

              {/* Card 2: Total Billing Amount */}
              <Card className="bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-[var(--muted)]">Total Billing</CardTitle>
                  <Truck className="h-4 w-4 text-[var(--secondary)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--ink)]">
                    ₹{totalFreightAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-1">Cumulative freight value</p>
                </CardContent>
              </Card>

              {/* Card 3: Payments Received */}
              <Card className="bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-[var(--muted)]">Payments Received</CardTitle>
                  <CheckCircle className="h-4 w-4 text-[var(--positive)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--positive)]">
                    ₹{totalReceivedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-1">{receivedPercent}% of total volume collected</p>
                </CardContent>
              </Card>

              {/* Card 4: Payments Pending */}
              <Card className="bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-[var(--muted)]">Payments Pending</CardTitle>
                  <Clock className="h-4 w-4 text-[var(--warning)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--warning)]">
                    ₹{totalPendingAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-1">{100 - receivedPercent}% outstanding amount</p>
                </CardContent>
              </Card>
            </div>

            {/* Collection Progress & Pending Bills list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Collection Progress Bar */}
              <Card className="bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[var(--ink)]">Payment Collection Ratio</CardTitle>
                  <CardDescription className="text-[var(--muted)]">Visual breakdown of payments collected vs outstanding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                    <span className="text-[var(--positive)]">Received: ₹{totalReceivedAmount.toLocaleString('en-IN')} ({receivedPercent}%)</span>
                    <span className="text-[var(--warning)]">Pending: ₹{totalPendingAmount.toLocaleString('en-IN')} ({100 - receivedPercent}%)</span>
                  </div>
                  <div className="w-full bg-[var(--surface)] rounded-full h-5 overflow-hidden border border-[var(--line)] flex">
                    <div 
                      className="bg-[var(--positive)] h-full transition-all duration-500 ease-out" 
                      style={{ width: `${receivedPercent}%` }}
                      title={`Received: ${receivedPercent}%`}
                    />
                    <div 
                      className="bg-[var(--warning)] h-full transition-all duration-500 ease-out" 
                      style={{ width: `${100 - receivedPercent}%` }}
                      title={`Pending: ${100 - receivedPercent}%`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs bg-[var(--surface)] p-4 rounded-lg border border-[var(--line)]">
                    <div>
                      <span className="text-[var(--muted)] block mb-1">Paid Invoices</span>
                      <span className="font-mono font-bold text-[var(--positive)] text-lg">{receivedBills.length}</span>
                      <span className="text-[var(--muted)] text-[10px] block">bills cleared</span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)] block mb-1">Pending Invoices</span>
                      <span className="font-mono font-bold text-[var(--warning)] text-lg">{pendingBills.length}</span>
                      <span className="text-[var(--muted)] text-[10px] block">bills unpaid</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Bills checklist */}
              <Card className="bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[var(--ink)]">Quick Payment Checklist</CardTitle>
                  <CardDescription className="text-[var(--muted)]">Mark pending bills as received from here ({pendingBills.length})</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {pendingBills.length === 0 ? (
                    <div className="text-center py-12 text-[var(--muted)] text-sm flex flex-col items-center justify-center gap-2">
                      <CheckCircle className="h-8 w-8 text-[var(--positive)]/60" />
                      <span>🎉 All payments are collected!</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {pendingBills.slice(0, 5).map((bill, index) => (
                        <div 
                          key={bill.billNo || index} 
                          className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--secondary)]/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-[var(--warning)]/10 text-[var(--warning)] rounded p-2 text-xs font-mono font-bold">
                              #{bill.billNo}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-semibold truncate max-w-[140px] sm:max-w-[200px] text-[var(--ink)]">
                                {bill.clientName}
                              </p>
                              <p className="text-[10px] text-[var(--muted)]">
                                {bill.date.split('-').reverse().join('-')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex flex-col items-end">
                              <span className="font-mono font-bold text-[var(--ink)] text-xs sm:text-sm">
                                ₹{(bill.totalFreight - (bill.advancePayment || 0)).toLocaleString('en-IN')}
                              </span>
                              {bill.advancePayment ? bill.advancePayment > 0 && (
                                <span className="text-[9px] text-[var(--muted)]">
                                  Adv: ₹{bill.advancePayment.toLocaleString('en-IN')}
                                </span>
                              ) : null}
                            </div>
                            <Button
                              size="sm"
                              className="bg-[var(--positive)] hover:opacity-90 text-white font-semibold text-[10px] sm:text-xs h-7 px-2.5 rounded flex items-center gap-1"
                              onClick={() => handleTogglePaymentStatus(bill.billNo, 'pending')}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Receive
                            </Button>
                          </div>
                        </div>
                      ))}
                      {pendingBills.length > 5 && (
                        <div 
                          className="text-center pt-2 text-[11px] text-[var(--secondary)] hover:underline font-medium cursor-pointer"
                          onClick={() => setActiveTab('history')}
                        >
                          And {pendingBills.length - 5} more pending bills in History...
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Form Tab */}
          <TabsContent value="form" className="outline-none">
            <Card className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] shadow-xl">
              <CardHeader className="border-b border-[var(--line)]">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-[var(--ink)]">Freight Bill Form</CardTitle>
                    <CardDescription className="text-[var(--muted)]">
                      Enter invoice header and consignment rows.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={handleResetForm} 
                      size="sm"
                      className="text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Form
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FreightBillForm formData={formData} onChange={handleFormChange} isExisting={isExisting} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="outline-none flex-1 flex flex-col">
            <Card className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] flex-1 flex flex-col shadow-xl">
              <CardHeader className="border-b border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                <div>
                  <CardTitle className="text-lg text-[var(--ink)]">Invoice Preview</CardTitle>
                  <CardDescription className="text-[var(--muted)]">
                    Verify visual alignment before sending to print.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={() => handlePrint()}
                    className="flex-1 sm:flex-none gap-2 bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white font-semibold text-xs sm:text-sm"
                  >
                    <Printer className="h-4 w-4" />
                    Print Invoice
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!printRef.current) { toast.error('Nothing to export'); return; }
                      try {
                        const element = printRef.current;
                        const opt = {
                          margin: 0,
                          filename: `FreightBill-${formData.billNo || 'preview'}.pdf`,
                          image: { type: 'jpeg', quality: 0.98 },
                          html2canvas: { scale: 2, useCORS: true },
                          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        };
                        const mod = (await import('html2pdf.js')) as any;
                        const html2pdfFactory = mod.default || mod;
                        await html2pdfFactory().set(opt).from(element).save();
                        toast.success('PDF saved successfully');
                      } catch (err: any) {
                        toast.error(err?.message || 'Failed to save PDF');
                      }
                    }}
                    variant="outline"
                    className="flex-1 sm:flex-none gap-2 border-[var(--line)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs sm:text-sm"
                  >
                    <FileDown className="h-4 w-4" />
                    Save PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent 
                ref={containerRef}
                className="pt-6 flex-1 bg-[var(--surface)] p-2 sm:p-6 flex justify-center items-start overflow-y-auto min-h-[300px]"
              >
                <div 
                  className="overflow-hidden flex justify-center items-start"
                  style={{
                    width: '100%',
                    height: `${1123 * scale + 32}px`,
                  }}
                >
                  <div 
                    className="bg-white shadow-2xl origin-top transition-transform duration-200"
                    style={{
                      transform: `scale(${scale})`,
                      width: '210mm',
                      minHeight: '297mm',
                    }}
                  >
                    <FreightBillPrintView ref={printRef} formData={formData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="outline-none">
            <Card className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] shadow-xl">
              <CardHeader className="border-b border-[var(--line)] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-[var(--ink)]">Saved Freight Bills</CardTitle>
                  <CardDescription className="text-[var(--muted)]">
                    Manage and lookup previously created freight bills.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={fetchBills} 
                  className="border-[var(--line)] hover:bg-[var(--surface)] text-[var(--ink)]"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {filteredBills.length === 0 ? (
                  <div className="text-center py-12 text-[var(--muted)]">
                    <AlertCircle className="h-10 w-10 mx-auto mb-3 text-[var(--muted)]" />
                    <p>No freight bills found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
                    <table className="w-full text-left">
                      <thead className="bg-[var(--secondary)] text-white uppercase text-[10px] sm:text-xs">
                        <tr>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-[var(--line)] text-white">Bill No.</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-[var(--line)] text-white">Date</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-[var(--line)] text-white">Client (M/s)</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-[var(--line)] text-white">Lorry Receipts</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-[var(--line)] text-right text-white">Total (Rs.)</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-[var(--line)] text-center w-24 sm:w-28 text-white">Status</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-[var(--line)] text-center w-24 sm:w-32 text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)] text-xs sm:text-sm">
                        {filteredBills.map((bill, index) => {
                          const billNo = bill?.billNo || `temp-${index}`;
                          const date = typeof bill?.date === 'string' ? bill.date : '';
                          const clientName = bill?.clientName || '—';
                          const entries = Array.isArray(bill?.entries) ? bill.entries : [];
                          const totalFreight = typeof bill?.totalFreight === 'number' ? bill.totalFreight : 0;
                          
                          return (
                            <tr key={billNo} className="hover:bg-[var(--surface)] transition-colors">
                              <td className="p-2.5 sm:p-4 font-bold text-[var(--ink)] font-mono">{billNo}</td>
                              <td className="p-2.5 sm:p-4 text-[var(--ink)]">
                                {date ? date.split('-').reverse().join('-') : '—'}
                              </td>
                              <td className="p-2.5 sm:p-4 font-semibold text-[var(--ink)]">{clientName}</td>
                              <td className="p-2.5 sm:p-4 text-[var(--muted)]">
                                <div className="max-w-[120px] sm:max-w-[200px] truncate">
                                  {entries.map(e => e?.lrNoDate).filter(Boolean).join(', ') || '—'}
                                </div>
                              </td>
                              <td className="p-2.5 sm:p-4 text-right font-mono">
                                <div className="font-bold text-[var(--ink)]">
                                  ₹{totalFreight.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                                {bill.advancePayment ? bill.advancePayment > 0 && (
                                  <div className="text-[10px] text-[var(--arc-red)] font-semibold">
                                    Bal: ₹{(totalFreight - bill.advancePayment).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </div>
                                ) : null}
                              </td>
                              <td className="p-2.5 sm:p-4 text-center">
                                <button
                                  onClick={() => handleTogglePaymentStatus(billNo, bill?.paymentStatus)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider select-none cursor-pointer transition-all focus:outline-none hover:scale-105 active:scale-95 ${
                                    bill?.paymentStatus === 'received'
                                      ? 'bg-[var(--positive)]/10 text-[var(--positive)] border border-[var(--positive)]/20 hover:bg-[var(--positive)]/20'
                                      : 'bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20 hover:bg-[var(--warning)]/20'
                                  }`}
                                  title="Click to toggle status"
                                >
                                  {bill?.paymentStatus === 'received' ? (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--positive)]"></span>
                                      Received
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] animate-pulse"></span>
                                      Pending
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="p-2.5 sm:p-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[var(--secondary)] hover:bg-[var(--secondary)]/10"
                                    onClick={() => handleLoadBill(bill)}
                                    title="Edit Bill"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[var(--secondary)] hover:bg-[var(--secondary)]/10"
                                    onClick={() => {
                                      setFormData(bill);
                                      setIsExisting(true);
                                      setActiveTab('preview');
                                      setTimeout(() => handlePrint(), 100);
                                    }}
                                    title="Print Bill"
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[var(--arc-red)] hover:bg-[var(--arc-red)]/10"
                                    onClick={() => handleDeleteBill(billNo)}
                                    title="Delete Bill"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Letter Head Tab */}
          <TabsContent value="letterhead" className="outline-none space-y-6">
            <Card className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] shadow-xl">
              <CardHeader className="border-b border-[var(--line)] pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20">
                        <Mail className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-lg font-bold text-[var(--ink)]">ARC Letter Head Document Generator</CardTitle>
                    </div>
                    <CardDescription className="text-[var(--muted)] mt-1">
                      Write custom descriptions, payment reminders, and quotations to print on official letterhead stationery.
                    </CardDescription>
                  </div>

                  {/* Sub-navigation inside Letterhead */}
                  <div className="flex items-center gap-1.5 bg-[var(--surface)] p-1 rounded-lg border border-[var(--line)]">
                    <Button
                      type="button"
                      variant={letterSubTab === 'compose' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setLetterSubTab('compose')}
                      className={`text-xs h-7 px-3 ${letterSubTab === 'compose' ? 'bg-[var(--secondary)] text-white font-semibold' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
                    >
                      Compose
                    </Button>
                    <Button
                      type="button"
                      variant={letterSubTab === 'preview' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setLetterSubTab('preview')}
                      className={`text-xs h-7 px-3 ${letterSubTab === 'preview' ? 'bg-[var(--secondary)] text-white font-semibold' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
                    >
                      Print Preview
                    </Button>
                    <Button
                      type="button"
                      variant={letterSubTab === 'history' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setLetterSubTab('history')}
                      className={`text-xs h-7 px-3 ${letterSubTab === 'history' ? 'bg-[var(--secondary)] text-white font-semibold' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
                    >
                      Saved Letters ({letters.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {letterSubTab === 'compose' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--line)]">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNewLetter}
                          className="text-xs h-8 border-[var(--line)] hover:bg-[var(--card)] text-[var(--ink)] gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          New Letter
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveLetter}
                          className="text-xs h-8 bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white font-semibold gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {isExistingLetter ? 'Update Letter' : 'Save Letter'}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLetterSubTab('preview')}
                          className="text-xs h-8 border-[var(--line)] hover:bg-[var(--card)] text-[var(--ink)] gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview & Print
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleLetterPrint()}
                          className="text-xs h-8 bg-[var(--surface)] hover:bg-[var(--card)] text-[var(--ink)] border border-[var(--line)] font-semibold gap-1.5"
                        >
                          <Printer className="h-3.5 w-3.5 text-[var(--secondary)]" />
                          Quick Print
                        </Button>
                      </div>
                    </div>

                    <LetterHeadForm
                      letterData={letterData}
                      onChange={setLetterData}
                      savedBills={bills}
                    />
                  </div>
                )}

                {letterSubTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--line)]">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLetterSubTab('compose')}
                          className="text-xs h-8 text-[var(--muted)] hover:text-[var(--ink)] gap-1.5"
                        >
                          ← Back to Edit
                        </Button>
                        <span className="text-xs text-[var(--muted)]">|</span>
                        <span className="text-xs font-semibold text-[var(--ink)]">
                          Mode: {letterData.includeHeader ? 'Digital Letterhead' : `Pre-Printed Stationery (${letterData.headerMarginMm}mm space)`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleLetterPrint()}
                          className="text-xs sm:text-sm h-9 bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white font-semibold gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Print Letter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleExportLetterPdf}
                          className="text-xs sm:text-sm h-9 border-[var(--line)] hover:bg-[var(--card)] text-[var(--ink)] gap-2"
                        >
                          <FileDown className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>

                    {/* Scaled Preview Frame */}
                    <div
                      ref={letterContainerRef}
                      className="flex-1 bg-[var(--surface)] p-2 sm:p-6 flex justify-center items-start overflow-y-auto rounded-xl border border-[var(--line)] min-h-[400px]"
                    >
                      <div
                        className="overflow-hidden flex justify-center items-start"
                        style={{
                          width: '100%',
                          height: `${1123 * letterScale + 32}px`,
                        }}
                      >
                        <div
                          className="bg-white shadow-2xl origin-top transition-transform duration-200 rounded-sm"
                          style={{
                            transform: `scale(${letterScale})`,
                            width: '210mm',
                            minHeight: '297mm',
                          }}
                        >
                          <LetterHeadPrintView ref={letterPrintRef} letterData={letterData} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {letterSubTab === 'history' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
                        <Input
                          value={letterSearchQuery}
                          onChange={(e) => setLetterSearchQuery(e.target.value)}
                          placeholder="Search by recipient, ref no, or text..."
                          className="pl-9 bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] h-9 text-xs"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchLetters}
                        className="border-[var(--line)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs h-9 gap-1.5"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Refresh
                      </Button>
                    </div>

                    {filteredLetters.length === 0 ? (
                      <div className="text-center py-16 text-[var(--muted)] bg-[var(--surface)] rounded-xl border border-[var(--line)]">
                        <Mail className="h-10 w-10 mx-auto mb-3 text-[var(--muted)]" />
                        <p className="font-semibold text-sm text-[var(--ink)]">No letters found</p>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          Compose your first official letter from the "Compose" tab!
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
                        <table className="w-full text-left">
                          <thead className="bg-[var(--secondary)] text-white uppercase text-[10px] sm:text-xs">
                            <tr>
                              <th className="p-3 sm:p-4 font-bold border-b border-[var(--line)] text-white">Ref. No.</th>
                              <th className="p-3 sm:p-4 font-bold border-b border-[var(--line)] text-white">Date</th>
                              <th className="p-3 sm:p-4 font-bold border-b border-[var(--line)] text-white">Recipient (M/s)</th>
                              <th className="p-3 sm:p-4 font-bold border-b border-[var(--line)] text-white">Description Preview</th>
                              <th className="p-3 sm:p-4 font-bold border-b border-[var(--line)] text-center w-28 text-white">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--line)] text-xs sm:text-sm">
                            {filteredLetters.map((letter) => (
                              <tr key={letter.id} className="hover:bg-[var(--surface)] transition-colors">
                                <td className="p-3 sm:p-4 font-bold text-[var(--ink)] font-mono">
                                  {letter.refNo || '—'}
                                </td>
                                <td className="p-3 sm:p-4 text-[var(--ink)]">
                                  {letter.date ? letter.date.split('-').reverse().join('-') : '—'}
                                </td>
                                <td className="p-3 sm:p-4 font-semibold text-[var(--ink)]">
                                  {letter.recipientName || '—'}
                                </td>
                                <td className="p-3 sm:p-4 text-[var(--muted)]">
                                  <div className="max-w-[280px] sm:max-w-[360px] truncate text-xs font-serif">
                                    {letter.content.slice(0, 80)}...
                                  </div>
                                </td>
                                <td className="p-3 sm:p-4 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-[var(--secondary)] hover:bg-[var(--secondary)]/10"
                                      onClick={() => handleLoadLetter(letter)}
                                      title="Edit Letter"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-[var(--secondary)] hover:bg-[var(--secondary)]/10"
                                      onClick={() => {
                                        setLetterData(letter);
                                        setIsExistingLetter(true);
                                        setLetterSubTab('preview');
                                        setTimeout(() => handleLetterPrint(), 100);
                                      }}
                                      title="Print Letter"
                                    >
                                      <Printer className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-[var(--arc-red)] hover:bg-[var(--arc-red)]/10"
                                      onClick={() => handleDeleteLetter(letter.id)}
                                      title="Delete Letter"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Hidden Print View */}
      <div className="hidden print-only">
        <FreightBillPrintView ref={printRef} formData={formData} />
        <LetterHeadPrintView ref={letterPrintRef} letterData={letterData} />
      </div>
    </div>
  );
};

export default Index;
