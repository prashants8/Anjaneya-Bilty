import React, { useState } from 'react';
import { LetterData, LETTER_TEMPLATES } from '@/types/letter';
import { FreightBillData } from '@/types/bill';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  FileText,
  Sparkles,
  Sliders,
  Receipt,
  RotateCcw,
  CheckCircle2,
  Building,
  User,
  MapPin,
  Calendar,
  Hash,
} from 'lucide-react';
import { toast } from 'sonner';

interface LetterHeadFormProps {
  letterData: LetterData;
  onChange: (newData: LetterData) => void;
  savedBills?: FreightBillData[];
}

export const LetterHeadForm: React.FC<LetterHeadFormProps> = ({
  letterData,
  onChange,
  savedBills = [],
}) => {
  const [selectedBillNo, setSelectedBillNo] = useState<string>('');

  const updateField = <K extends keyof LetterData>(field: K, value: LetterData[K]) => {
    onChange({
      ...letterData,
      [field]: value,
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = LETTER_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    onChange({
      ...letterData,
      salutation: template.salutation,
      subject: template.subject || '',
      content: template.content,
    });
    toast.success(`Applied "${template.name}" template`);
  };

  const handleImportFromBill = (billNo: string) => {
    const bill = savedBills.find((b) => b.billNo === billNo);
    if (!bill) return;

    const balance = (bill.totalFreight || 0) - (bill.advancePayment || 0);
    const formattedDate = bill.date ? bill.date.split('-').reverse().join('/') : '';

    const generatedContent = `As per our discussion had with you regarding transportation charges, we prepare our freight bill no. ${bill.billNo} date ${formattedDate} amount Rs. ${bill.totalFreight || 0}/- so our total freight charges Rs. ${bill.totalFreight || 0}/-
We have received advance Rs. ${bill.advancePayment || 0}/-
Balance payment pending Rs. ${balance}/-
Now we are very kindly requesting you sir please deposit our balance payment as soon as possible.`;

    onChange({
      ...letterData,
      refNo: `ARC/BILL/${bill.billNo}`,
      recipientName: bill.clientName || letterData.recipientName,
      recipientAddress: bill.clientAddress || letterData.recipientAddress,
      subject: `Regarding pending balance payment for Freight Bill No. ${bill.billNo}`,
      content: generatedContent,
    });

    toast.success(`Imported data from Bill No. ${bill.billNo}!`);
  };

  return (
    <div className="space-y-6">
      {/* Template & Quick Action Toolbar */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--secondary)]" />
            <span className="text-sm font-semibold text-[var(--ink)]">Letter Templates:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {LETTER_TEMPLATES.map((tmpl) => (
              <Button
                key={tmpl.id}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7 border-[var(--line)] bg-[var(--card)] hover:bg-[var(--surface)] text-[var(--ink)]"
                onClick={() => applyTemplate(tmpl.id)}
              >
                {tmpl.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Import from Freight Bill */}
        {savedBills.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--card)] p-3 rounded-lg border border-[var(--line)]">
            <div className="flex items-center gap-2 text-xs text-[var(--ink)]">
              <Receipt className="h-4 w-4 text-[var(--secondary)]" />
              <span className="font-semibold">Auto-fill from existing Freight Bill:</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedBillNo}
                onChange={(e) => setSelectedBillNo(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[var(--secondary)] max-w-[200px]"
              >
                <option value="">Select a bill...</option>
                {savedBills.map((b) => (
                  <option key={b.billNo} value={b.billNo}>
                    Bill #{b.billNo} - {b.clientName}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                size="sm"
                disabled={!selectedBillNo}
                className="text-xs h-8 bg-[var(--secondary)] hover:opacity-90 text-white font-medium"
                onClick={() => handleImportFromBill(selectedBillNo)}
              >
                Import
              </Button>
            </div>
          </div>
        )}

        {/* Print Settings Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Include Header Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--line)]">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold text-[var(--ink)]">
                Digital ARC Letterhead
              </Label>
              <p className="text-[11px] text-[var(--muted)]">
                {letterData.includeHeader
                  ? 'Printing on plain paper with full digital header'
                  : 'Printing on physical pre-printed stationery pad'}
              </p>
            </div>
            <Switch
              checked={letterData.includeHeader}
              onCheckedChange={(checked) => updateField('includeHeader', checked)}
            />
          </div>

          {/* Stationery Top Margin Adjustment (if header is disabled) */}
          {!letterData.includeHeader ? (
            <div className="flex flex-col justify-center p-3 rounded-lg bg-[var(--card)] border border-[var(--line)] space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[var(--ink)]">
                  Pre-Printed Top Spacing:
                </span>
                <span className="font-mono text-[var(--secondary)] font-bold">
                  {letterData.headerMarginMm} mm
                </span>
              </div>
              <Slider
                value={[letterData.headerMarginMm]}
                min={20}
                max={75}
                step={2}
                onValueChange={([val]) => updateField('headerMarginMm', val)}
                className="w-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--line)]">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-[var(--ink)]">
                  Rubber Stamp Box
                </Label>
                <p className="text-[11px] text-[var(--muted)]">
                  Include signature & proprietor stamp placeholder
                </p>
              </div>
              <Switch
                checked={letterData.showSignatureBlock}
                onCheckedChange={(checked) => updateField('showSignatureBlock', checked)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Reference & Recipient */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-[var(--muted)]" /> Ref. No.
              </Label>
              <Input
                value={letterData.refNo}
                onChange={(e) => updateField('refNo', e.target.value)}
                placeholder="e.g. ARC/2021/395"
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[var(--muted)]" /> Date
              </Label>
              <Input
                type="date"
                value={letterData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-[var(--muted)]" /> Recipient / M/s (Company Name)
            </Label>
            <Input
              value={letterData.recipientName}
              onChange={(e) => updateField('recipientName', e.target.value)}
              placeholder="e.g. M/S Jindal Developers"
              className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--muted)]" /> Recipient Address & City
            </Label>
            <Textarea
              rows={3}
              value={letterData.recipientAddress}
              onChange={(e) => updateField('recipientAddress', e.target.value)}
              placeholder="e.g. Bargarh, Orissa"
              className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)]">
                Salutation
              </Label>
              <Input
                value={letterData.salutation}
                onChange={(e) => updateField('salutation', e.target.value)}
                placeholder="e.g. Dear sir,"
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)]">
                Subject (Optional)
              </Label>
              <Input
                value={letterData.subject || ''}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="e.g. Payment deposit request"
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Signatory Information */}
        <div className="space-y-4 bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <div className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider border-b border-[var(--line)] pb-2 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-[var(--secondary)]" /> Signatory & Company Details
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)]">Closing Greeting</Label>
              <Input
                value={letterData.closing}
                onChange={(e) => updateField('closing', e.target.value)}
                placeholder="e.g. Regards,"
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)]">Signatory Name</Label>
              <Input
                value={letterData.signatoryName}
                onChange={(e) => updateField('signatoryName', e.target.value)}
                placeholder="e.g. J.S. Shukla"
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[var(--ink)]">Company Name</Label>
            <Input
              value={letterData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="e.g. Anjaneya Road Carriers"
              className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)]">Location</Label>
              <Input
                value={letterData.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. Chhatral Gujrat"
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--ink)]">Designation</Label>
              <Input
                value={letterData.designation}
                onChange={(e) => updateField('designation', e.target.value)}
                placeholder="e.g. Proprietor"
                className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] h-9 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Letter Description / Body Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--secondary)]" />
            Letter Description / Body Text:
          </Label>
          <span className="text-[11px] text-[var(--muted)]">
            Supports multi-paragraph descriptions & exact spacing
          </span>
        </div>
        <Textarea
          rows={10}
          value={letterData.content}
          onChange={(e) => updateField('content', e.target.value)}
          placeholder="Write your letter text here..."
          className="bg-[var(--card)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] font-serif leading-relaxed text-sm p-4 min-h-[220px]"
        />
      </div>
    </div>
  );
};
