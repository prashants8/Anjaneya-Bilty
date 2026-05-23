import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FreightBillForm } from '@/components/FreightBillForm';
import { FreightBillPrintView } from '@/components/FreightBillPrintView';
import { FreightBillData, initialBillData } from '@/types/bill';
import { numberToWords } from '@/utils/numberToWords';
import * as supabaseService from '@/lib/supabaseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Truck, Printer, RotateCcw, FileText, Search, Trash2, Edit, Plus, RefreshCw, FileDown, AlertCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

const Index = () => {
  const [formData, setFormData] = useState<FreightBillData>(initialBillData);
  const [isExisting, setIsExisting] = useState(false);
  const [bills, setBills] = useState<FreightBillData[]>([]);
  const [userHandle, setUserHandle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('form');
  const [scale, setScale] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all bills from Database (Supabase with localStorage fallback)
  const fetchBills = async () => {
    try {
      const data = await supabaseService.getFreightBills();
      setBills(data);
    } catch (e: any) {
      toast.error('Failed to load bills: ' + e.message);
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchBills();

    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const email = user.email || '';
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
    };

    if (activeTab === 'preview') {
      const timer = setTimeout(handleResize, 100);
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `FreightBill-${formData.billNo || 'preview'}`,
    onAfterPrint: () => {
      toast.success('Bill sent to printer!');
    }
  });

  const handleFormChange = (newData: FreightBillData) => {
    // Automatically recalculate words when total freight changes
    const words = numberToWords(newData.totalFreight.toString());
    setFormData({
      ...newData,
      rupeesInWords: words
    });
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
    setActiveTab('form');
    toast.success('Form cleared. Ready for new entry.');
  };

  const handleResetForm = () => {
    setFormData({
      ...initialBillData,
      date: new Date().toISOString().split('T')[0]
    });
    setIsExisting(false);
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
        await supabaseService.updateFreightBill(formData);
        toast.success(`Bill No. ${formData.billNo} updated successfully!`);
      } else {
        await supabaseService.createFreightBill(formData);
        setIsExisting(true);
        toast.success(`Bill No. ${formData.billNo} saved successfully!`);
      }
      fetchBills();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save bill');
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Logout failed: ' + error.message);
      } else {
        toast.success('Logged out successfully!');
      }
    }
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
    setActiveTab('form');
    toast.info(`Loaded Bill No. ${bill.billNo}`);
  };

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Sleek Dark Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center rounded-full text-white font-black text-sm w-10 h-10 shrink-0 border border-slate-800 shadow-md select-none"
              style={{ backgroundColor: '#d32f2f' }}
            >
              ARC
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide bg-gradient-to-r from-rose-500 to-rose-300 bg-clip-text text-transparent leading-tight">
                ANJANEYA ROAD CARRIERS
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400">Freight Billing & Consignment Manager</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto border-t border-slate-800/60 sm:border-t-0 pt-2 sm:pt-0">
            {userHandle && (
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full select-none">
                👤 {userHandle}
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <Button 
                onClick={handleNewBill}
                variant="outline"
                size="sm"
                className="gap-1 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs h-8 px-2.5"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </Button>
              <Button 
                onClick={handleSaveBill}
                size="sm"
                className="gap-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-8 px-2.5"
              >
                <FileText className="h-3.5 w-3.5" />
                {isExisting ? 'Update' : 'Save'}
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-1 text-slate-400 hover:text-rose-500 hover:bg-slate-900 h-8 px-2"
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <TabsList className="bg-slate-950 border border-slate-800 p-1 grid grid-cols-3 w-full md:max-w-md">
              <TabsTrigger value="form" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
                Billing Form
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
                Print Preview
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
                Bill History ({bills.length})
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'history' && (
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Bill No, Client, Lorry..."
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            )}
          </div>

          {/* Form Tab */}
          <TabsContent value="form" className="outline-none">
            <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-xl">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Freight Bill Form</CardTitle>
                    <CardDescription className="text-slate-400">
                      Enter invoice header and consignment rows.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={handleResetForm} 
                      size="sm"
                      className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Form
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FreightBillForm formData={formData} onChange={handleFormChange} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="outline-none flex-1 flex flex-col">
            <Card className="bg-slate-950 border-slate-800 text-slate-100 flex-1 flex flex-col shadow-xl">
              <CardHeader className="border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                <div>
                  <CardTitle className="text-lg">Invoice Preview</CardTitle>
                  <CardDescription className="text-slate-400">
                    Verify visual alignment before sending to print.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={() => handlePrint()}
                    className="flex-1 sm:flex-none gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm"
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
                    className="flex-1 sm:flex-none gap-2 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm"
                  >
                    <FileDown className="h-4 w-4" />
                    Save PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent 
                ref={containerRef}
                className="pt-6 flex-1 bg-slate-900/60 p-2 sm:p-6 flex justify-center items-start overflow-y-auto min-h-[300px]"
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
            <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-xl">
              <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Saved Freight Bills</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage and lookup previously created freight bills.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={fetchBills} 
                  className="border-slate-800 hover:bg-slate-800"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {filteredBills.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <AlertCircle className="h-10 w-10 mx-auto mb-3 text-slate-600" />
                    <p>No freight bills found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] sm:text-xs">
                        <tr>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-slate-800">Bill No.</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-slate-800">Date</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-slate-800">Client (M/s)</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-slate-800">Lorry Receipts</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-slate-800 text-right">Total (Rs.)</th>
                          <th className="p-2.5 sm:p-4 font-bold border-b border-slate-800 text-center w-24 sm:w-32">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                        {filteredBills.map((bill, index) => {
                          const billNo = bill?.billNo || `temp-${index}`;
                          const date = typeof bill?.date === 'string' ? bill.date : '';
                          const clientName = bill?.clientName || '—';
                          const entries = Array.isArray(bill?.entries) ? bill.entries : [];
                          const totalFreight = typeof bill?.totalFreight === 'number' ? bill.totalFreight : 0;
                          
                          return (
                            <tr key={billNo} className="hover:bg-slate-900/40">
                              <td className="p-2.5 sm:p-4 font-bold text-rose-400 font-mono">{billNo}</td>
                              <td className="p-2.5 sm:p-4 text-slate-300">
                                {date ? date.split('-').reverse().join('-') : '—'}
                              </td>
                              <td className="p-2.5 sm:p-4 font-semibold">{clientName}</td>
                              <td className="p-2.5 sm:p-4 text-slate-400">
                                <div className="max-w-[120px] sm:max-w-[200px] truncate">
                                  {entries.map(e => e?.lrNoDate).filter(Boolean).join(', ') || '—'}
                                </div>
                              </td>
                              <td className="p-2.5 sm:p-4 text-right font-mono font-bold text-emerald-400">
                                {totalFreight.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="p-2.5 sm:p-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-400 hover:bg-blue-400/10"
                                    onClick={() => handleLoadBill(bill)}
                                    title="Edit Bill"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-rose-400 hover:bg-rose-400/10"
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
                                    className="h-8 w-8 text-red-500 hover:bg-red-500/10"
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
        </Tabs>
      </main>

      {/* Hidden Print View */}
      <div className="hidden print-only">
        <FreightBillPrintView ref={printRef} formData={formData} />
      </div>
    </div>
  );
};

export default Index;
