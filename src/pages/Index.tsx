import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { BiltyForm } from '@/components/BiltyForm';
import { BiltyPrintView } from '@/components/BiltyPrintView';
import { BiltyFormData, initialBiltyData, defaultBankDetails } from '@/types/bilty';
import { useBiltyNumber } from '@/hooks/useBiltyNumber';
import { numberToWords } from '@/utils/numberToWords';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Printer, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [formData, setFormData] = useState<BiltyFormData>(initialBiltyData);
  const { biltyNumber, getNextBiltyNumber, getCurrentPreviewNumber } = useBiltyNumber();
  const printRef = useRef<HTMLDivElement>(null);

  // Initialize bilty number
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      biltyNumber: getCurrentPreviewNumber()
    }));
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Bilty-${formData.biltyNumber}`,
    onAfterPrint: () => {
      toast.success('Bilty printed successfully!');
    }
  });

  const handleChange = useCallback((field: keyof BiltyFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate totals when charge fields change
      const chargeFields = [
        'freightAmount', 'stationCharge', 'weightCharges',
        'hamali', 'insuranceCharge', 'deliveryCharge'
      ];
      
      const isToPayField = chargeFields.some(f => field === `${f}ToPay` || field === `${f}ToPayPs`);
      const isPaidField = chargeFields.some(f => field === `${f}Paid` || field === `${f}PaidPs`);
      
      if (isToPayField) {
        let totalRs = 0;
        let totalPs = 0;
        chargeFields.forEach(f => {
          totalRs += parseFloat(newData[`${f}ToPay` as keyof BiltyFormData] as string) || 0;
          totalPs += parseInt(newData[`${f}ToPayPs` as keyof BiltyFormData] as string) || 0;
        });
        totalRs += Math.floor(totalPs / 100);
        totalPs = totalPs % 100;
        newData.totalToPay = totalRs.toString();
        newData.totalToPayPs = totalPs.toString().padStart(2, '0');
      }
      
      if (isPaidField) {
        let totalRs = 0;
        let totalPs = 0;
        chargeFields.forEach(f => {
          totalRs += parseFloat(newData[`${f}Paid` as keyof BiltyFormData] as string) || 0;
          totalPs += parseInt(newData[`${f}PaidPs` as keyof BiltyFormData] as string) || 0;
        });
        totalRs += Math.floor(totalPs / 100);
        totalPs = totalPs % 100;
        newData.totalPaid = totalRs.toString();
        newData.totalPaidPs = totalPs.toString().padStart(2, '0');
      }
      
      // Auto-update amount in words when invoice value changes
      if (field === 'invoiceValue') {
        newData.amountInWords = numberToWords(value);
      }
      
      return newData;
    });
  }, []);

  const handleNewBilty = useCallback(() => {
    const newNumber = getNextBiltyNumber();
    setFormData({
      ...initialBiltyData,
      biltyNumber: newNumber,
      date: new Date().toISOString().split('T')[0]
    });
    toast.success(`New Bilty created: ${newNumber}`);
  }, [getNextBiltyNumber]);

  const handleReset = useCallback(() => {
    setFormData({
      ...initialBiltyData,
      biltyNumber: formData.biltyNumber,
      date: new Date().toISOString().split('T')[0]
    });
    toast.info('Form has been reset');
  }, [formData.biltyNumber]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold tracking-wide">BILLTY</h1>
                <p className="text-sm opacity-90">Transport Consignment Note System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleNewBilty}
                variant="secondary"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                New Bilty
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button 
                onClick={() => handlePrint()}
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Printer className="h-4 w-4" />
                Print Bilty
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="form" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="form" className="gap-2">
              <FileText className="h-4 w-4" />
              Entry Form
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card>
              <CardHeader className="bg-bilty-section border-b border-bilty-table-border">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Bilty Entry Form
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    Current Bilty: <span className="font-semibold text-primary">{formData.biltyNumber}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <BiltyForm formData={formData} onChange={handleChange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader className="bg-bilty-section border-b border-bilty-table-border">
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5 text-primary" />
                  Print Preview
                  <Button 
                    onClick={() => handlePrint()}
                    size="sm"
                    className="ml-auto gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 overflow-auto">
                <div className="border border-bilty-table-border rounded-lg overflow-hidden shadow-lg">
                  <BiltyPrintView 
                    ref={printRef} 
                    formData={formData} 
                    bankDetails={defaultBankDetails}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Hidden Print View */}
      <div className="hidden print-only">
        <BiltyPrintView 
          ref={printRef} 
          formData={formData} 
          bankDetails={defaultBankDetails}
        />
      </div>
    </div>
  );
};

export default Index;
