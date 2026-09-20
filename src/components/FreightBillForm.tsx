import React, { useState } from 'react';
import { FreightBillData, BillEntry, initialBillEntry } from '@/types/bill';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Lock, Unlock } from 'lucide-react';

interface FreightBillFormProps {
  formData: FreightBillData;
  onChange: (newData: FreightBillData) => void;
  isExisting?: boolean;
}

export const FreightBillForm: React.FC<FreightBillFormProps> = ({ formData, onChange, isExisting = false }) => {
  const [isBillNoUnlocked, setIsBillNoUnlocked] = useState(false);

  const handleFieldChange = (field: keyof FreightBillData, value: any) => {
    const updated = { ...formData, [field]: value };
    onChange(updated);
  };

  const calculateTotal = (entries: BillEntry[], insurance: number) => {
    const entriesSum = entries.reduce((sum, entry) => {
      const val = parseFloat(entry.freight) || 0;
      return sum + val;
    }, 0);
    return entriesSum + insurance;
  };

  const handleEntryChange = (index: number, field: keyof BillEntry, value: string) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };

    const insurance = formData.insuranceCharges || 0;
    const newTotal = calculateTotal(updatedEntries, insurance);

    const updated = {
      ...formData,
      entries: updatedEntries,
      totalFreight: newTotal,
    };
    onChange(updated);
  };

  const addEntryRow = () => {
    const updatedEntries = [...formData.entries, { ...initialBillEntry }];
    const insurance = formData.insuranceCharges || 0;
    const newTotal = calculateTotal(updatedEntries, insurance);
    const updated = {
      ...formData,
      entries: updatedEntries,
      totalFreight: newTotal,
    };
    onChange(updated);
  };

  const removeEntryRow = (index: number) => {
    if (formData.entries.length <= 1) {
      // Keep at least one row
      const insurance = formData.insuranceCharges || 0;
      const updated = {
        ...formData,
        entries: [{ ...initialBillEntry }],
        totalFreight: insurance,
      };
      onChange(updated);
      return;
    }
    const updatedEntries = formData.entries.filter((_, i) => i !== index);
    const insurance = formData.insuranceCharges || 0;
    const newTotal = calculateTotal(updatedEntries, insurance);

    const updated = {
      ...formData,
      entries: updatedEntries,
      totalFreight: newTotal,
    };
    onChange(updated);
  };

  const handleInsuranceChange = (value: string) => {
    const insurance = parseFloat(value) || 0;
    const newTotal = calculateTotal(formData.entries, insurance);
    const updated = {
      ...formData,
      insuranceCharges: insurance,
      totalFreight: newTotal,
    };
    onChange(updated);
  };

  const handleAdvanceChange = (value: string) => {
    const advance = parseFloat(value) || 0;
    const updated = {
      ...formData,
      advancePayment: advance,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Bill Number, Date, PAN, GST, Jurisdiction */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-[var(--surface)]/50 rounded-lg border border-[var(--line)]">
        <div className="col-span-1">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-[var(--ink)]">Bill No.</Label>
            {isExisting && (
              <button
                type="button"
                onClick={() => setIsBillNoUnlocked(!isBillNoUnlocked)}
                className="text-[10px] text-[var(--secondary)] hover:underline flex items-center gap-0.5 focus:outline-none select-none transition-colors"
                title={isBillNoUnlocked ? "Lock Bill No." : "Unlock to Edit Bill No."}
              >
                {isBillNoUnlocked ? (
                  <>
                    <Lock className="h-3 w-3" /> Lock
                  </>
                ) : (
                  <>
                    <Unlock className="h-3 w-3 text-[var(--secondary)]" /> Edit
                  </>
                )}
              </button>
            )}
          </div>
          <Input
            className="mt-1 bg-[var(--card)] border-[var(--line)] text-[var(--ink)]"
            value={formData.billNo}
            placeholder="e.g. 1082"
            disabled={isExisting && !isBillNoUnlocked}
            onChange={(e) => handleFieldChange('billNo', e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <Label className="text-sm font-semibold text-[var(--ink)]">Bill Date</Label>
          <Input
            type="date"
            className="mt-1 bg-[var(--card)] border-[var(--line)] text-[var(--ink)]"
            value={formData.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <Label className="text-sm font-semibold text-[var(--ink)]">Payment Status</Label>
          <select
            className="mt-1 flex h-10 w-full rounded-md border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[var(--ink)] font-medium cursor-pointer"
            value={formData.paymentStatus || 'pending'}
            onChange={(e) => handleFieldChange('paymentStatus', e.target.value as 'pending' | 'received')}
          >
            <option value="pending" className="bg-[var(--card)] text-[var(--warning)] font-semibold">Pending</option>
            <option value="received" className="bg-[var(--card)] text-[var(--positive)] font-semibold">Received</option>
          </select>
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className="text-sm font-semibold text-[var(--ink)]">PAN No.</Label>
          <Input
            className="mt-1 bg-[var(--card)] border-[var(--line)] text-[var(--ink)]"
            value={formData.panNo}
            onChange={(e) => handleFieldChange('panNo', e.target.value.toUpperCase())}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className="text-sm font-semibold text-[var(--ink)]">GST ID No.</Label>
          <Input
            className="mt-1 bg-[var(--card)] border-[var(--line)] text-[var(--ink)]"
            value={formData.gstId}
            onChange={(e) => handleFieldChange('gstId', e.target.value.toUpperCase())}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className="text-sm font-semibold text-[var(--ink)]">Jurisdiction</Label>
          <Input
            className="mt-1 bg-[var(--card)] border-[var(--line)] text-[var(--ink)]"
            value={formData.jurisdiction}
            onChange={(e) => handleFieldChange('jurisdiction', e.target.value)}
          />
        </div>
      </div>

      {/* Client / M/s Details */}
      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--line)]">
        <h3 className="font-semibold text-[var(--secondary)] mb-3">Client Details (M/s.)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-[var(--muted)]">Company Name (M/s.)</Label>
            <Input
              className="mt-1 bg-[var(--surface)]/50 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)]"
              value={formData.clientName}
              placeholder="e.g. Q Green Techon Ltd."
              onChange={(e) => handleFieldChange('clientName', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-[var(--muted)]">Address / Place</Label>
            <Input
              className="mt-1 bg-[var(--surface)]/50 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)]"
              value={formData.clientAddress}
              placeholder="e.g. Padhariya Mehsana"
              onChange={(e) => handleFieldChange('clientAddress', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Consignments / Entries Table */}
      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--line)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex flex-col">
            <h3 className="font-semibold text-[var(--secondary)]">Consignment Entries</h3>
            <span className="text-[10px] text-[var(--muted)] block sm:hidden">← Swipe horizontally to see all columns →</span>
          </div>
          <Button onClick={addEntryRow} size="sm" className="gap-1 bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Add Row
          </Button>
        </div>

        <div className="overflow-x-auto border border-[var(--line)] rounded-md bg-[var(--card)]">
          <table className="w-full border-collapse border border-[var(--line)] text-sm">
            <thead>
              <tr className="bg-[var(--secondary)] text-white">
                <th className="border border-[var(--line)] p-2 text-left min-w-[120px] text-white">L.R. No. & Date</th>
                <th className="border border-[var(--line)] p-2 text-left min-w-[120px] text-white">Lorry No.</th>
                <th className="border border-[var(--line)] p-2 text-left min-w-[150px] text-white">Particulars</th>
                <th className="border border-[var(--line)] p-2 text-left min-w-[100px] text-white">From</th>
                <th className="border border-[var(--line)] p-2 text-left min-w-[100px] text-white">To</th>
                <th className="border border-[var(--line)] p-2 text-left min-w-[100px] text-white">Weight</th>
                <th className="border border-[var(--line)] p-2 text-left min-w-[80px] text-white">Rate</th>
                <th className="border border-[var(--line)] p-2 text-right min-w-[100px] text-white">Freight (Rs.)</th>
                <th className="border border-[var(--line)] p-2 text-center w-12 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-[var(--surface)]/50">
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
                      value={entry.lrNoDate}
                      placeholder="e.g. 1608 31.1.26"
                      onChange={(e) => handleEntryChange(idx, 'lrNoDate', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
                      value={entry.lorryNo}
                      placeholder="e.g. GJ-01 KT 5922"
                      onChange={(e) => handleEntryChange(idx, 'lorryNo', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
                      value={entry.particulars}
                      placeholder="e.g. QGH25 32'x8'x9'"
                      onChange={(e) => handleEntryChange(idx, 'particulars', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
                      value={entry.from}
                      placeholder="e.g. Padhariya"
                      onChange={(e) => handleEntryChange(idx, 'from', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
                      value={entry.to}
                      placeholder="e.g. Sarangarh"
                      onChange={(e) => handleEntryChange(idx, 'to', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
                      value={entry.weight}
                      placeholder="e.g. FTL 10 M.T."
                      onChange={(e) => handleEntryChange(idx, 'weight', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
                      value={entry.rate}
                      placeholder="e.g. fixed"
                      onChange={(e) => handleEntryChange(idx, 'rate', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1">
                    <Input
                      type="number"
                      className="h-8 text-xs text-right bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-[var(--secondary)] font-mono"
                      value={entry.freight}
                      placeholder="0.00"
                      onChange={(e) => handleEntryChange(idx, 'freight', e.target.value)}
                    />
                  </td>
                  <td className="border border-[var(--line)] p-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[var(--arc-red)] hover:bg-[var(--arc-red)]/10"
                      onClick={() => removeEntryRow(idx)}
                      title="Delete Row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Summary */}
      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--line)]">
        <h3 className="font-semibold text-[var(--secondary)] mb-3">Freight Bill Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
          <div className="col-span-1 md:col-span-2 md:row-span-2 flex flex-col justify-between">
            <Label className="text-sm font-semibold text-[var(--ink)]">Rupees in Words</Label>
            <Textarea
              className="mt-1 bg-[var(--surface)]/50 border-[var(--line)] flex-1 min-h-[80px] resize-none text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)]"
              value={formData.rupeesInWords}
              placeholder="Auto-calculated word form of total..."
              onChange={(e) => handleFieldChange('rupeesInWords', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-[var(--muted)]">Transit Insurance Charges (Rs.)</Label>
            <Input
              type="number"
              className="mt-1 bg-[var(--surface)]/50 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--secondary)]"
              value={formData.insuranceCharges || ''}
              placeholder="0.00"
              onChange={(e) => handleInsuranceChange(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-[var(--muted)]">Advance Payment Received (Rs.)</Label>
            <Input
              type="number"
              className="mt-1 bg-[var(--surface)]/50 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--secondary)]"
              value={formData.advancePayment || ''}
              placeholder="0.00"
              onChange={(e) => handleAdvanceChange(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm font-bold text-[var(--ink)]">TOTAL FREIGHT (Rs.)</Label>
            <div className="mt-1 text-lg font-bold font-mono tracking-tight text-[var(--ink)] bg-[var(--surface)] border border-[var(--line)] p-2 rounded-md text-right h-10 flex items-center justify-end">
              {formData.totalFreight.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <Label className="text-sm font-bold text-[var(--ink)]">BALANCE DUE (Rs.)</Label>
            <div className="mt-1 text-xl font-bold font-mono tracking-tight text-[var(--arc-red)] bg-[var(--surface)] border border-[var(--line)] p-2.5 rounded-md text-right h-10 flex items-center justify-end">
              {(formData.totalFreight - (formData.advancePayment || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
