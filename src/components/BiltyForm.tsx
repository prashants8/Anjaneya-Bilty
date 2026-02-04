import React from 'react';
import { BiltyFormData } from '@/types/bilty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface BiltyFormProps {
  formData: BiltyFormData;
  onChange: (field: keyof BiltyFormData, value: string) => void;
}

export const BiltyForm: React.FC<BiltyFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="bilty-label">GST Payable By</Label>
          <RadioGroup
            value={formData.gstPayableBy}
            onValueChange={(value) => onChange('gstPayableBy', value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="consignor" id="consignor" />
              <Label htmlFor="consignor" className="text-sm">Consignor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="consignee" id="consignee" />
              <Label htmlFor="consignee" className="text-sm">Consignee</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="bilty-label">G.C. Number</Label>
          <Input
            className="bilty-input mt-1"
            value={formData.gcNumber}
            onChange={(e) => onChange('gcNumber', e.target.value)}
          />
        </div>
        <div>
          <Label className="bilty-label">Date</Label>
          <Input
            type="date"
            className="bilty-input mt-1"
            value={formData.date}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>
        <div>
          <Label className="bilty-label">Bilty Number</Label>
          <Input
            className="bilty-input mt-1 bg-bilty-highlight font-semibold"
            value={formData.biltyNumber}
            readOnly
          />
        </div>
      </div>

      {/* Consignor & Consignee Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consignor */}
        <div className="p-4 bg-bilty-section rounded-md border border-bilty-table-border">
          <h3 className="font-semibold text-primary mb-3">Consignor Details</h3>
          <div className="space-y-3">
            <div>
              <Label className="bilty-label">M/s. (Name)</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.consignorName}
                onChange={(e) => onChange('consignorName', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">Place</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.consignorPlace}
                onChange={(e) => onChange('consignorPlace', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">GSTIN</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.consignorGstin}
                onChange={(e) => onChange('consignorGstin', e.target.value.toUpperCase())}
                maxLength={15}
              />
            </div>
          </div>
        </div>

        {/* Consignee */}
        <div className="p-4 bg-bilty-section rounded-md border border-bilty-table-border">
          <h3 className="font-semibold text-primary mb-3">Consignee Details</h3>
          <div className="space-y-3">
            <div>
              <Label className="bilty-label">M/s. (Name)</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.consigneeName}
                onChange={(e) => onChange('consigneeName', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">Place</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.consigneePlace}
                onChange={(e) => onChange('consigneePlace', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">GSTIN</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.consigneeGstin}
                onChange={(e) => onChange('consigneeGstin', e.target.value.toUpperCase())}
                maxLength={15}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Goods Details */}
      <div className="p-4 bg-bilty-section rounded-md border border-bilty-table-border">
        <h3 className="font-semibold text-primary mb-3">Goods Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="bilty-label">No. of Articles</Label>
            <Input
              className="bilty-input mt-1"
              value={formData.numberOfArticles}
              onChange={(e) => onChange('numberOfArticles', e.target.value)}
            />
          </div>
          <div>
            <Label className="bilty-label">Method of Packing</Label>
            <Input
              className="bilty-input mt-1"
              value={formData.methodOfPacking}
              onChange={(e) => onChange('methodOfPacking', e.target.value)}
            />
          </div>
          <div>
            <Label className="bilty-label">Actual Weight (Kg/Mt)</Label>
            <Input
              className="bilty-input mt-1"
              type="number"
              step="0.01"
              value={formData.actualWeightKg}
              onChange={(e) => onChange('actualWeightKg', e.target.value)}
            />
          </div>
          <div>
            <Label className="bilty-label">Gross Weight</Label>
            <Input
              className="bilty-input mt-1"
              type="number"
              step="0.01"
              value={formData.grossWeight}
              onChange={(e) => onChange('grossWeight', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-1">
            <Label className="bilty-label">Description of Goods</Label>
            <Textarea
              className="bilty-input mt-1 min-h-[60px]"
              value={formData.descriptionOfGoods}
              onChange={(e) => onChange('descriptionOfGoods', e.target.value)}
            />
          </div>
          <div>
            <Label className="bilty-label">Unloading By</Label>
            <Input
              className="bilty-input mt-1"
              value={formData.unloadingBy}
              onChange={(e) => onChange('unloadingBy', e.target.value)}
            />
          </div>
          <div>
            <Label className="bilty-label">Lorry Number</Label>
            <Input
              className="bilty-input mt-1"
              value={formData.lorryNumber}
              onChange={(e) => onChange('lorryNumber', e.target.value.toUpperCase())}
            />
          </div>
        </div>
      </div>

      {/* Freight Details Table */}
      <div className="p-4 bg-bilty-section rounded-md border border-bilty-table-border">
        <h3 className="font-semibold text-primary mb-3">Freight Details</h3>
        
        <div className="mb-4">
          <Label className="bilty-label">Freight Rate per Kg/Mt</Label>
          <Input
            className="bilty-input mt-1 w-48"
            type="number"
            step="0.01"
            value={formData.freightRatePerKg}
            onChange={(e) => onChange('freightRatePerKg', e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-bilty-table-header">
                <th className="bilty-table-cell text-left">Particulars</th>
                <th className="bilty-table-cell text-center" colSpan={2}>To Pay (Rs. Ps.)</th>
                <th className="bilty-table-cell text-center" colSpan={2}>Paid/Due (Rs. Ps.)</th>
              </tr>
            </thead>
            <tbody>
              <FreightRow
                label="Freight Amount"
                toPayRs={formData.freightAmountToPay}
                toPayPs={formData.freightAmountToPayPs}
                paidRs={formData.freightAmountPaid}
                paidPs={formData.freightAmountPaidPs}
                onChangeToPayRs={(v) => onChange('freightAmountToPay', v)}
                onChangeToPayPs={(v) => onChange('freightAmountToPayPs', v)}
                onChangePaidRs={(v) => onChange('freightAmountPaid', v)}
                onChangePaidPs={(v) => onChange('freightAmountPaidPs', v)}
              />
              <FreightRow
                label="Station Charge"
                toPayRs={formData.stationChargeToPay}
                toPayPs={formData.stationChargeToPayPs}
                paidRs={formData.stationChargePaid}
                paidPs={formData.stationChargePaidPs}
                onChangeToPayRs={(v) => onChange('stationChargeToPay', v)}
                onChangeToPayPs={(v) => onChange('stationChargeToPayPs', v)}
                onChangePaidRs={(v) => onChange('stationChargePaid', v)}
                onChangePaidPs={(v) => onChange('stationChargePaidPs', v)}
              />
              <FreightRow
                label="Weight Charges"
                toPayRs={formData.weightChargesToPay}
                toPayPs={formData.weightChargesToPayPs}
                paidRs={formData.weightChargesPaid}
                paidPs={formData.weightChargesPaidPs}
                onChangeToPayRs={(v) => onChange('weightChargesToPay', v)}
                onChangeToPayPs={(v) => onChange('weightChargesToPayPs', v)}
                onChangePaidRs={(v) => onChange('weightChargesPaid', v)}
                onChangePaidPs={(v) => onChange('weightChargesPaidPs', v)}
              />
              <FreightRow
                label="Hamali"
                toPayRs={formData.hamaliToPay}
                toPayPs={formData.hamaliToPayPs}
                paidRs={formData.hamaliPaid}
                paidPs={formData.hamaliPaidPs}
                onChangeToPayRs={(v) => onChange('hamaliToPay', v)}
                onChangeToPayPs={(v) => onChange('hamaliToPayPs', v)}
                onChangePaidRs={(v) => onChange('hamaliPaid', v)}
                onChangePaidPs={(v) => onChange('hamaliPaidPs', v)}
              />
              <FreightRow
                label="Insurance Charge"
                toPayRs={formData.insuranceChargeToPay}
                toPayPs={formData.insuranceChargeToPayPs}
                paidRs={formData.insuranceChargePaid}
                paidPs={formData.insuranceChargePaidPs}
                onChangeToPayRs={(v) => onChange('insuranceChargeToPay', v)}
                onChangeToPayPs={(v) => onChange('insuranceChargeToPayPs', v)}
                onChangePaidRs={(v) => onChange('insuranceChargePaid', v)}
                onChangePaidPs={(v) => onChange('insuranceChargePaidPs', v)}
              />
              <FreightRow
                label="Delivery Charge"
                toPayRs={formData.deliveryChargeToPay}
                toPayPs={formData.deliveryChargeToPayPs}
                paidRs={formData.deliveryChargePaid}
                paidPs={formData.deliveryChargePaidPs}
                onChangeToPayRs={(v) => onChange('deliveryChargeToPay', v)}
                onChangeToPayPs={(v) => onChange('deliveryChargeToPayPs', v)}
                onChangePaidRs={(v) => onChange('deliveryChargePaid', v)}
                onChangePaidPs={(v) => onChange('deliveryChargePaidPs', v)}
              />
              <tr className="bg-bilty-highlight font-semibold">
                <td className="bilty-table-cell">TOTAL</td>
                <td className="bilty-table-cell text-right">
                  <Input
                    className="bilty-input h-7 w-20 inline-block"
                    value={formData.totalToPay}
                    onChange={(e) => onChange('totalToPay', e.target.value)}
                  />
                </td>
                <td className="bilty-table-cell text-right">
                  <Input
                    className="bilty-input h-7 w-16 inline-block"
                    value={formData.totalToPayPs}
                    onChange={(e) => onChange('totalToPayPs', e.target.value)}
                    maxLength={2}
                  />
                </td>
                <td className="bilty-table-cell text-right">
                  <Input
                    className="bilty-input h-7 w-20 inline-block"
                    value={formData.totalPaid}
                    onChange={(e) => onChange('totalPaid', e.target.value)}
                  />
                </td>
                <td className="bilty-table-cell text-right">
                  <Input
                    className="bilty-input h-7 w-16 inline-block"
                    value={formData.totalPaidPs}
                    onChange={(e) => onChange('totalPaidPs', e.target.value)}
                    maxLength={2}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Label className="bilty-label">Bill / M.R. Number</Label>
          <Input
            className="bilty-input mt-1 w-48"
            value={formData.billMrNumber}
            onChange={(e) => onChange('billMrNumber', e.target.value)}
          />
        </div>
      </div>

      {/* Invoice & E-way Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-bilty-section rounded-md border border-bilty-table-border">
          <h3 className="font-semibold text-primary mb-3">Invoice Details</h3>
          <div className="space-y-3">
            <div>
              <Label className="bilty-label">Invoice Number</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.invoiceNumber}
                onChange={(e) => onChange('invoiceNumber', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">Value (Rs.)</Label>
              <Input
                className="bilty-input mt-1"
                type="number"
                step="0.01"
                value={formData.invoiceValue}
                onChange={(e) => onChange('invoiceValue', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">Amount in Words</Label>
              <Textarea
                className="bilty-input mt-1 min-h-[60px]"
                value={formData.amountInWords}
                onChange={(e) => onChange('amountInWords', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-bilty-section rounded-md border border-bilty-table-border">
          <h3 className="font-semibold text-primary mb-3">Delivery Details</h3>
          <div className="space-y-3">
            <div>
              <Label className="bilty-label">E-Way Bill Number</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.ewayBillNumber}
                onChange={(e) => onChange('ewayBillNumber', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">Delivery Location</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.deliveryLocation}
                onChange={(e) => onChange('deliveryLocation', e.target.value)}
              />
            </div>
            <div>
              <Label className="bilty-label">Booking Incharge</Label>
              <Input
                className="bilty-input mt-1"
                value={formData.bookingIncharge}
                onChange={(e) => onChange('bookingIncharge', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FreightRowProps {
  label: string;
  toPayRs: string;
  toPayPs: string;
  paidRs: string;
  paidPs: string;
  onChangeToPayRs: (value: string) => void;
  onChangeToPayPs: (value: string) => void;
  onChangePaidRs: (value: string) => void;
  onChangePaidPs: (value: string) => void;
}

const FreightRow: React.FC<FreightRowProps> = ({
  label,
  toPayRs,
  toPayPs,
  paidRs,
  paidPs,
  onChangeToPayRs,
  onChangeToPayPs,
  onChangePaidRs,
  onChangePaidPs,
}) => (
  <tr>
    <td className="bilty-table-cell">{label}</td>
    <td className="bilty-table-cell text-right">
      <Input
        className="bilty-input h-7 w-20 inline-block"
        type="number"
        value={toPayRs}
        onChange={(e) => onChangeToPayRs(e.target.value)}
      />
    </td>
    <td className="bilty-table-cell text-right">
      <Input
        className="bilty-input h-7 w-16 inline-block"
        value={toPayPs}
        onChange={(e) => onChangeToPayPs(e.target.value)}
        maxLength={2}
      />
    </td>
    <td className="bilty-table-cell text-right">
      <Input
        className="bilty-input h-7 w-20 inline-block"
        type="number"
        value={paidRs}
        onChange={(e) => onChangePaidRs(e.target.value)}
      />
    </td>
    <td className="bilty-table-cell text-right">
      <Input
        className="bilty-input h-7 w-16 inline-block"
        value={paidPs}
        onChange={(e) => onChangePaidPs(e.target.value)}
        maxLength={2}
      />
    </td>
  </tr>
);
