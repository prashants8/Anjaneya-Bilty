import React, { forwardRef } from 'react';
import { BiltyFormData, BankDetails, defaultBankDetails } from '@/types/bilty';
import { Truck } from 'lucide-react';

interface BiltyPrintViewProps {
  formData: BiltyFormData;
  bankDetails?: BankDetails;
}

export const BiltyPrintView = forwardRef<HTMLDivElement, BiltyPrintViewProps>(
  ({ formData, bankDetails = defaultBankDetails }, ref) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    return (
      <div ref={ref} className="bg-white text-black p-6 max-w-4xl mx-auto font-serif text-sm" style={{ minHeight: '297mm' }}>
        {/* Header */}
        <div className="border-2 border-black">
          <div className="bg-primary text-primary-foreground text-center py-3">
            <div className="flex items-center justify-center gap-3">
              <Truck className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold tracking-wider">BILLTY</h1>
                <p className="text-xs">CONSIGNMENT NOTE / BILTY</p>
              </div>
              <Truck className="h-8 w-8" />
            </div>
          </div>

          {/* GST and Bilty Info Row */}
          <div className="grid grid-cols-4 border-t border-black">
            <div className="p-2 border-r border-black">
              <span className="font-semibold">GST Payable By:</span>
              <div className="mt-1">{formData.gstPayableBy === 'consignor' ? '☑ Consignor' : '☐ Consignor'}</div>
              <div>{formData.gstPayableBy === 'consignee' ? '☑ Consignee' : '☐ Consignee'}</div>
            </div>
            <div className="p-2 border-r border-black">
              <span className="font-semibold">G.C. No.:</span>
              <div className="mt-1 font-medium">{formData.gcNumber || '-'}</div>
            </div>
            <div className="p-2 border-r border-black">
              <span className="font-semibold">Date:</span>
              <div className="mt-1">{formatDate(formData.date)}</div>
            </div>
            <div className="p-2 bg-bilty-highlight">
              <span className="font-semibold">Bilty No.:</span>
              <div className="mt-1 font-bold text-primary text-lg">{formData.biltyNumber}</div>
            </div>
          </div>

          {/* Consignor & Consignee */}
          <div className="grid grid-cols-2 border-t border-black">
            <div className="border-r border-black">
              <div className="bg-bilty-table-header font-semibold p-2 border-b border-black">CONSIGNOR</div>
              <div className="p-2 space-y-1">
                <div><span className="font-semibold">M/s.:</span> {formData.consignorName || '-'}</div>
                <div><span className="font-semibold">Place:</span> {formData.consignorPlace || '-'}</div>
                <div><span className="font-semibold">GSTIN:</span> {formData.consignorGstin || '-'}</div>
              </div>
            </div>
            <div>
              <div className="bg-bilty-table-header font-semibold p-2 border-b border-black">CONSIGNEE</div>
              <div className="p-2 space-y-1">
                <div><span className="font-semibold">M/s.:</span> {formData.consigneeName || '-'}</div>
                <div><span className="font-semibold">Place:</span> {formData.consigneePlace || '-'}</div>
                <div><span className="font-semibold">GSTIN:</span> {formData.consigneeGstin || '-'}</div>
              </div>
            </div>
          </div>

          {/* Goods Details */}
          <div className="border-t border-black">
            <div className="bg-bilty-table-header font-semibold p-2 border-b border-black text-center">GOODS DETAILS</div>
            <table className="w-full">
              <thead>
                <tr className="bg-bilty-table-header text-xs">
                  <th className="border-r border-b border-black p-1">No. of Articles</th>
                  <th className="border-r border-b border-black p-1">Method of Packing</th>
                  <th className="border-r border-b border-black p-1">Description of Goods</th>
                  <th className="border-r border-b border-black p-1">Actual Wt. (Kg/Mt)</th>
                  <th className="border-r border-b border-black p-1">Gross Weight</th>
                  <th className="border-r border-b border-black p-1">Unloading By</th>
                  <th className="border-b border-black p-1">Lorry No.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-black p-2 text-center">{formData.numberOfArticles || '-'}</td>
                  <td className="border-r border-black p-2 text-center">{formData.methodOfPacking || '-'}</td>
                  <td className="border-r border-black p-2">{formData.descriptionOfGoods || '-'}</td>
                  <td className="border-r border-black p-2 text-center">{formData.actualWeightKg || '-'}</td>
                  <td className="border-r border-black p-2 text-center">{formData.grossWeight || '-'}</td>
                  <td className="border-r border-black p-2 text-center">{formData.unloadingBy || '-'}</td>
                  <td className="p-2 text-center font-semibold">{formData.lorryNumber || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Freight Details */}
          <div className="border-t border-black">
            <div className="grid grid-cols-3">
              <div className="border-r border-black p-2">
                <span className="font-semibold">Freight Rate per Kg/Mt:</span>
                <span className="ml-2">{formData.freightRatePerKg || '-'}</span>
              </div>
              <div className="border-r border-black p-2">
                <span className="font-semibold">Bill/M.R. No.:</span>
                <span className="ml-2">{formData.billMrNumber || '-'}</span>
              </div>
              <div className="p-2">
                <span className="font-semibold">E-Way Bill No.:</span>
                <span className="ml-2">{formData.ewayBillNumber || '-'}</span>
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="border-t border-black">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-bilty-table-header">
                  <th className="border-r border-b border-black p-1">Particulars</th>
                  <th className="border-r border-b border-black p-1" colSpan={2}>To Pay (Rs. Ps.)</th>
                  <th className="border-b border-black p-1" colSpan={2}>Paid/Due (Rs. Ps.)</th>
                </tr>
              </thead>
              <tbody>
                <ChargeRow label="Freight Amount" toPayRs={formData.freightAmountToPay} toPayPs={formData.freightAmountToPayPs} paidRs={formData.freightAmountPaid} paidPs={formData.freightAmountPaidPs} />
                <ChargeRow label="Station Charge" toPayRs={formData.stationChargeToPay} toPayPs={formData.stationChargeToPayPs} paidRs={formData.stationChargePaid} paidPs={formData.stationChargePaidPs} />
                <ChargeRow label="Weight Charges" toPayRs={formData.weightChargesToPay} toPayPs={formData.weightChargesToPayPs} paidRs={formData.weightChargesPaid} paidPs={formData.weightChargesPaidPs} />
                <ChargeRow label="Hamali" toPayRs={formData.hamaliToPay} toPayPs={formData.hamaliToPayPs} paidRs={formData.hamaliPaid} paidPs={formData.hamaliPaidPs} />
                <ChargeRow label="Insurance Charge" toPayRs={formData.insuranceChargeToPay} toPayPs={formData.insuranceChargeToPayPs} paidRs={formData.insuranceChargePaid} paidPs={formData.insuranceChargePaidPs} />
                <ChargeRow label="Delivery Charge" toPayRs={formData.deliveryChargeToPay} toPayPs={formData.deliveryChargeToPayPs} paidRs={formData.deliveryChargePaid} paidPs={formData.deliveryChargePaidPs} />
                <tr className="bg-bilty-highlight font-bold">
                  <td className="border-r border-black p-2">TOTAL</td>
                  <td className="border-r border-black p-2 text-right">{formData.totalToPay || '-'}</td>
                  <td className="border-r border-black p-2 text-right">{formData.totalToPayPs || '00'}</td>
                  <td className="border-r border-black p-2 text-right">{formData.totalPaid || '-'}</td>
                  <td className="p-2 text-right">{formData.totalPaidPs || '00'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Invoice Details */}
          <div className="border-t border-black grid grid-cols-2">
            <div className="border-r border-black">
              <div className="grid grid-cols-2 text-xs">
                <div className="p-2 border-r border-b border-black">
                  <span className="font-semibold">Invoice No.:</span>
                  <div>{formData.invoiceNumber || '-'}</div>
                </div>
                <div className="p-2 border-b border-black">
                  <span className="font-semibold">Value (Rs.):</span>
                  <div>{formData.invoiceValue || '-'}</div>
                </div>
              </div>
              <div className="p-2">
                <span className="font-semibold">Amount in Words:</span>
                <div className="italic mt-1">{formData.amountInWords || '-'}</div>
              </div>
            </div>
            <div>
              <div className="p-2 border-b border-black">
                <span className="font-semibold">Delivery Location:</span>
                <div>{formData.deliveryLocation || '-'}</div>
              </div>
              <div className="p-2">
                <span className="font-semibold">Booking Incharge:</span>
                <div>{formData.bookingIncharge || '-'}</div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="border-t border-black">
            <div className="bg-bilty-table-header font-semibold p-2 border-b border-black">BANK DETAILS</div>
            <div className="grid grid-cols-4 text-xs">
              <div className="p-2 border-r border-black">
                <span className="font-semibold">Bank Name:</span>
                <div>{bankDetails.bankName}</div>
              </div>
              <div className="p-2 border-r border-black">
                <span className="font-semibold">Branch:</span>
                <div>{bankDetails.branchName}</div>
              </div>
              <div className="p-2 border-r border-black">
                <span className="font-semibold">A/C No.:</span>
                <div>{bankDetails.accountNumber}</div>
              </div>
              <div className="p-2">
                <span className="font-semibold">IFSC:</span>
                <div>{bankDetails.ifscCode}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-black">
            <div className="grid grid-cols-2">
              <div className="p-4 border-r border-black">
                <div className="text-xs text-muted-foreground mb-2">Consignor/Consignee Signature</div>
                <div className="h-12 border-b border-dashed border-black"></div>
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-2">For Transport Company</div>
                <div className="h-12 border-b border-dashed border-black"></div>
                <div className="text-xs text-right mt-1">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-4 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Terms & Conditions:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Goods are carried at owner's risk.</li>
            <li>Company is not responsible for delay due to accident, breakdown, or any unforeseen circumstances.</li>
            <li>All disputes subject to local jurisdiction.</li>
          </ol>
        </div>
      </div>
    );
  }
);

BiltyPrintView.displayName = 'BiltyPrintView';

interface ChargeRowProps {
  label: string;
  toPayRs: string;
  toPayPs: string;
  paidRs: string;
  paidPs: string;
}

const ChargeRow: React.FC<ChargeRowProps> = ({ label, toPayRs, toPayPs, paidRs, paidPs }) => (
  <tr>
    <td className="border-r border-b border-black p-1">{label}</td>
    <td className="border-r border-b border-black p-1 text-right w-20">{toPayRs || '-'}</td>
    <td className="border-r border-b border-black p-1 text-right w-16">{toPayPs || '00'}</td>
    <td className="border-r border-b border-black p-1 text-right w-20">{paidRs || '-'}</td>
    <td className="border-b border-black p-1 text-right w-16">{paidPs || '00'}</td>
  </tr>
);
