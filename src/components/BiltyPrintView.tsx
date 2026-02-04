import React, { forwardRef } from 'react';
import { BiltyFormData, BankDetails, defaultBankDetails } from '@/types/bilty';

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
      <div ref={ref} className="bg-white text-black p-4 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
        {/* Top Header Row */}
        <div className="flex justify-between items-start mb-1 text-xs">
          <div>
            <div className="font-semibold">GST Payble by</div>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 border border-black" style={{ background: formData.gstPayableBy === 'consignor' ? '#000' : 'transparent' }}></span>
                Consignor
              </label>
              <label className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 border border-black" style={{ background: formData.gstPayableBy === 'consignee' ? '#000' : 'transparent' }}></span>
                Consignee
              </label>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs">All Subject KALOL (N.G.) Jurisdiction only</div>
            <div className="font-bold text-sm mt-1">CONSIGNMENT NOTE</div>
            <div className="border border-black px-2 py-0.5 inline-block text-xs mt-1">AT OWNERS RISK</div>
          </div>
          <div className="text-right">
            <div className="text-xs">M. 9824724842</div>
            <div className="text-xs">M. 8200141051</div>
            <div className="mt-2">
              <span className="text-sm">G.C.No.: </span>
              <span className="font-bold text-xl">{formData.gcNumber || '____'}</span>
            </div>
          </div>
        </div>

        {/* Company Header */}
        <div className="border-2 border-red-600 mb-2">
          <div className="flex items-center px-2 py-1">
            <div className="flex-shrink-0 mr-3">
              <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center bg-white">
                <span className="text-red-600 font-bold text-sm">ARC</span>
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-red-600 font-bold text-xl tracking-wide">ANJANEYA ROAD CARRIERS</div>
              <div className="text-xs">F/38, 1st floor, D.K.Complex, Near Swastik Petrol Pump, Chhatral, Ta. Kalol, Dist. Gandhinagar (N.G.) 382729 • E-mail: arccht2018@gmail.com</div>
              <div className="text-xs">Description of service: goods transport agency SAC Code: 996791</div>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-800 text-center py-1 text-xs font-semibold border-t border-red-600">
            GSTID No.: 24FBIPS5544B1ZN • PAN No.: FBIPS5544B • UNDER MSME, UDYAM No.: GJ09-0015102
          </div>
        </div>

        {/* From / To / Date Row */}
        <div className="grid grid-cols-3 gap-4 mb-2 text-xs">
          <div>
            <div className="flex">
              <span className="font-semibold">From</span>
              <span className="flex-1 border-b border-black ml-2">{formData.consignorPlace}</span>
            </div>
            <div className="flex mt-1">
              <span className="font-semibold">CONSIGNOR: M/s.</span>
              <span className="flex-1 border-b border-black ml-1">{formData.consignorName}</span>
            </div>
          </div>
          <div>
            <div className="flex">
              <span className="font-semibold">To,</span>
              <span className="flex-1 border-b border-black ml-2">{formData.consigneePlace}</span>
            </div>
            <div className="flex mt-1">
              <span className="font-semibold">CONSIGNEE: M/s.</span>
              <span className="flex-1 border-b border-black ml-1">{formData.consigneeName}</span>
            </div>
          </div>
          <div>
            <div className="flex">
              <span className="font-semibold">Date</span>
              <span className="flex-1 border-b border-black ml-2">{formatDate(formData.date)}</span>
            </div>
          </div>
        </div>

        {/* GSTIN Row */}
        <div className="grid grid-cols-2 gap-4 mb-2 text-xs">
          <div className="flex">
            <span className="font-semibold">GSTIN No.</span>
            <span className="flex-1 border-b border-black ml-2">{formData.consignorGstin}</span>
          </div>
          <div className="flex">
            <span className="font-semibold">GSTIN No.</span>
            <span className="flex-1 border-b border-black ml-2">{formData.consigneeGstin}</span>
          </div>
        </div>

        {/* Main Table */}
        <div className="border border-black mb-2">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="border border-black p-1 text-center w-12" rowSpan={2}>No. of<br/>Articles</th>
                <th className="border border-black p-1 text-center w-16" rowSpan={2}>Method of<br/>Packing</th>
                <th className="border border-black p-1 text-center" rowSpan={2}>Description of Goods<br/>said to contain</th>
                <th className="border border-black p-1 text-center w-16" rowSpan={2}>Actual<br/>Weight<br/>Kg. / Mt.</th>
                <th className="border border-black p-1 text-center w-12" rowSpan={2}>@<br/>Per</th>
                <th className="border border-black p-1 text-center" colSpan={5}>Freight</th>
              </tr>
              <tr>
                <th className="border border-black p-1 text-center w-20" rowSpan={1}></th>
                <th className="border border-black p-1 text-center" colSpan={2}>To Pay</th>
                <th className="border border-black p-1 text-center" colSpan={2}>Paid / Due</th>
              </tr>
              <tr>
                <th className="border-0" colSpan={5}></th>
                <th className="border border-black p-0.5 text-center text-[10px]"></th>
                <th className="border border-black p-0.5 text-center text-[10px]">Rs.</th>
                <th className="border border-black p-0.5 text-center text-[10px]">Ps.</th>
                <th className="border border-black p-0.5 text-center text-[10px]">Rs.</th>
                <th className="border border-black p-0.5 text-center text-[10px]">Ps.</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 - Freight */}
              <tr>
                <td className="border border-black p-1 text-center align-top" rowSpan={7}>{formData.numberOfArticles}</td>
                <td className="border border-black p-1 text-center align-top" rowSpan={7}>{formData.methodOfPacking}</td>
                <td className="border border-black p-1 align-top" rowSpan={7}>
                  <div>{formData.descriptionOfGoods}</div>
                </td>
                <td className="border border-black p-1 text-center align-top" rowSpan={3}>{formData.actualWeightKg}</td>
                <td className="border border-black p-1 text-center align-top" rowSpan={3}>{formData.freightRatePerKg}</td>
                <td className="border border-black p-1 text-right text-[10px]">Freight</td>
                <td className="border border-black p-1 text-right">{formData.freightAmountToPay}</td>
                <td className="border border-black p-1 text-right">{formData.freightAmountToPayPs || '00'}</td>
                <td className="border border-black p-1 text-right">{formData.freightAmountPaid}</td>
                <td className="border border-black p-1 text-right">{formData.freightAmountPaidPs || '00'}</td>
              </tr>
              {/* Row 2 - St. Charge */}
              <tr>
                <td className="border border-black p-1 text-right text-[10px]">St. Charge</td>
                <td className="border border-black p-1 text-right">{formData.stationChargeToPay}</td>
                <td className="border border-black p-1 text-right">{formData.stationChargeToPayPs || '00'}</td>
                <td className="border border-black p-1 text-right">{formData.stationChargePaid}</td>
                <td className="border border-black p-1 text-right">{formData.stationChargePaidPs || '00'}</td>
              </tr>
              {/* Row 3 - Weight Charges / Hamali */}
              <tr>
                <td className="border border-black p-1 text-right text-[10px]">Hamali</td>
                <td className="border border-black p-1 text-right">{formData.hamaliToPay}</td>
                <td className="border border-black p-1 text-right">{formData.hamaliToPayPs || '00'}</td>
                <td className="border border-black p-1 text-right">{formData.hamaliPaid}</td>
                <td className="border border-black p-1 text-right">{formData.hamaliPaidPs || '00'}</td>
              </tr>
              {/* Row 4 - Gross Weight / Ins. Charge */}
              <tr>
                <td className="border border-black p-1 text-center" rowSpan={2}>
                  <div className="text-[10px] text-left">Weight</div>
                  <div className="text-[10px] text-left">Charges</div>
                </td>
                <td className="border border-black p-1 text-center" rowSpan={2}>
                  <div className="text-[10px]">Gross</div>
                  <div className="text-[10px]">Weight</div>
                  <div className="font-semibold">{formData.grossWeight}</div>
                </td>
                <td className="border border-black p-1 text-right text-[10px]">Ins. Charge</td>
                <td className="border border-black p-1 text-right">{formData.insuranceChargeToPay}</td>
                <td className="border border-black p-1 text-right">{formData.insuranceChargeToPayPs || '00'}</td>
                <td className="border border-black p-1 text-right">{formData.insuranceChargePaid}</td>
                <td className="border border-black p-1 text-right">{formData.insuranceChargePaidPs || '00'}</td>
              </tr>
              {/* Row 5 - Bill No / Delivery charge */}
              <tr>
                <td className="border border-black p-1 text-right text-[10px]">Delivery<br/>charge</td>
                <td className="border border-black p-1 text-right">{formData.deliveryChargeToPay}</td>
                <td className="border border-black p-1 text-right">{formData.deliveryChargeToPayPs || '00'}</td>
                <td className="border border-black p-1 text-right">{formData.deliveryChargePaid}</td>
                <td className="border border-black p-1 text-right">{formData.deliveryChargePaidPs || '00'}</td>
              </tr>
              {/* Row 6 - Un Loading By */}
              <tr>
                <td className="border border-black p-1 text-left" colSpan={2}>
                  <div className="font-semibold text-[10px]">Bill No.</div>
                  <div className="text-[10px]">or</div>
                  <div className="text-[10px]">MR No.</div>
                  <div>{formData.billMrNumber}</div>
                </td>
                <td className="border border-black p-1" rowSpan={2} colSpan={5}></td>
              </tr>
              {/* Row 7 - Lorry No */}
              <tr>
                <td className="border border-black p-1" colSpan={2}>
                  <div><span className="font-semibold">Un Loading By:</span> {formData.unloadingBy}</div>
                  <div className="mt-1"><span className="font-semibold">Lorry No.:</span> {formData.lorryNumber}</div>
                </td>
              </tr>
              {/* Row 8 - Disclaimer / Total */}
              <tr>
                <td className="border border-black p-1 font-semibold text-[10px]" colSpan={5}>
                  Not responsible for Leakage & breakage
                </td>
                <td className="border border-black p-1 text-right font-bold text-[10px]">TOTAL</td>
                <td className="border border-black p-1 text-right font-bold">{formData.totalToPay}</td>
                <td className="border border-black p-1 text-right font-bold">{formData.totalToPayPs || '00'}</td>
                <td className="border border-black p-1 text-right font-bold">{formData.totalPaid}</td>
                <td className="border border-black p-1 text-right font-bold">{formData.totalPaidPs || '00'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* Left Column - Value, Invoice, Terms */}
          <div>
            <div className="flex mb-1">
              <span className="font-semibold w-16">Value</span>
              <span className="flex-1 border-b border-black">{formData.invoiceValue}</span>
            </div>
            <div className="flex mb-1">
              <span className="font-semibold w-16">Invoice No.</span>
              <span className="flex-1 border-b border-black">{formData.invoiceNumber}</span>
            </div>
            <div className="text-[9px] mt-2">
              <div>(The Consignment Note is issued to</div>
              <div>Terms & Condition overleaf)</div>
            </div>
            <div className="mt-2 font-bold text-red-600">CONSIGNEE COPY</div>
          </div>

          {/* Middle Column - Bank Details, E-way Bill */}
          <div>
            <div className="flex mb-1">
              <span className="font-semibold">Amount in words</span>
              <span className="flex-1 border-b border-black ml-1 text-[10px]">{formData.amountInWords}</span>
            </div>
            <div className="text-[10px] space-y-0.5 mt-1">
              <div>Bank Name: {bankDetails.bankName}</div>
              <div>Branch Name: {bankDetails.branchName}</div>
              <div>A/c. No.: {bankDetails.accountNumber}</div>
              <div>IFSC Code: {bankDetails.ifscCode}</div>
            </div>
            <div className="flex mt-2">
              <span className="font-semibold text-[10px]">E.way Bill No.:</span>
              <div className="flex ml-1">
                {(formData.ewayBillNumber || '').split('').map((char, i) => (
                  <span key={i} className="w-4 h-5 border border-black text-center text-[10px] flex items-center justify-center">{char}</span>
                ))}
                {Array.from({ length: Math.max(0, 12 - (formData.ewayBillNumber || '').length) }).map((_, i) => (
                  <span key={`empty-${i}`} className="w-4 h-5 border border-black"></span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Delivery, Signature */}
          <div>
            <div className="flex mb-1">
              <span className="font-semibold">Delivery at:</span>
              <span className="flex-1 border-b border-black ml-1">{formData.deliveryLocation}</span>
            </div>
            <div className="mt-4 text-right">
              <div className="font-bold text-blue-800">For, ANJANEYA ROAD CARRIERS</div>
              <div className="h-10"></div>
              <div className="text-red-600 font-semibold italic">Booking Incharge</div>
              <div className="text-[10px]">{formData.bookingIncharge}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BiltyPrintView.displayName = 'BiltyPrintView';
