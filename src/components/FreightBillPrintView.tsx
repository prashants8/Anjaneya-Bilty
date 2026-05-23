import React from 'react';
import { FreightBillData } from '@/types/bill';

interface FreightBillPrintViewProps {
  formData: FreightBillData;
}

export const FreightBillPrintView = React.forwardRef<HTMLDivElement, FreightBillPrintViewProps>(
  ({ formData }, ref) => {
    // Helper to format currency
    const formatFreight = (val: string) => {
      if (!val) return '';
      const num = parseFloat(val);
      if (isNaN(num)) return val;
      return num.toFixed(0) + '=00'; // formatting matching the photo e.g., 115100=00
    };

    const formatTotalFreight = (val: number) => {
      if (val === 0) return '0=00';
      return val.toFixed(0) + '=00';
    };

    return (
      <div
        ref={ref}
        className="p-6 bg-white text-black font-sans w-[210mm] min-h-[297mm] mx-auto print:p-4 print:mx-0 select-none"
        style={{
          boxSizing: 'border-box',
          color: '#1a1a1a',
        }}
      >
        {/* Print wrapper to enforce exact styling */}
        <div className="border-[2px] border-black p-4 h-full flex flex-col" style={{ minHeight: '275mm' }}>
          {/* Header section & Info boxes */}
          <div className="shrink-0">
            {/* Header section */}
            <div className="flex justify-between items-start border-b border-black pb-3">
              {/* Logo & Slogan */}
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center justify-center rounded-full bg-[#c21820] text-white font-bold text-2xl w-14 h-14 shrink-0 border border-black shadow-sm"
                  style={{ backgroundColor: '#d32f2f' }}
                >
                  ARC
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#d32f2f] uppercase m-0 leading-none">
                    Anjaneya Road Carriers
                  </h1>
                  <p className="text-[10px] font-semibold text-gray-700 italic mt-1 leading-none">
                    (Specialist ODC Heavy Machinery Consignment for All over India)
                  </p>
                  <p className="text-[9px] font-medium text-gray-600 mt-1 leading-normal max-w-[450px]">
                    F/38, 1st Floor, D. K. Complex, Nr. Swastik Petrol Pump, Chhatral, Ta. Kalol, Dist. Gandhinagar (N.G.) 382729
                  </p>
                </div>
              </div>

              {/* Mobile Contacts */}
              <div className="text-right text-[11px] font-bold text-gray-800 leading-tight">
                <div>M. 98247 24842</div>
                <div>M. 82001 41051</div>
              </div>
            </div>

            {/* Bill Info Boxes */}
            <div className="grid grid-cols-3 border-b border-black text-xs">
              {/* M/s Details */}
              <div className="col-span-2 border-r border-black p-2 flex flex-col min-h-[70px]">
                <div className="flex gap-1.5">
                  <span className="font-bold shrink-0">M/s.</span>
                  <div className="underline decoration-dotted font-semibold text-[13px] leading-tight">
                    {formData.clientName || '____________________________________________________'}
                  </div>
                </div>
                <div className="pl-[30px] underline decoration-dotted font-medium text-gray-600 text-xs mt-1">
                  {formData.clientAddress || '____________________________________________________'}
                </div>
              </div>

              {/* Bill Details */}
              <div className="col-span-1 flex flex-col justify-between">
                <div className="border-b border-black p-1.5 flex justify-between items-center">
                  <span className="font-bold">Bill No. :</span>
                  <span className="font-bold text-[14px] underline decoration-dotted">
                    {formData.billNo || '________'}
                  </span>
                </div>
                <div className="p-1.5 flex justify-between items-center">
                  <span className="font-bold">Date :</span>
                  <span className="font-semibold underline decoration-dotted">
                    {formData.date ? formData.date.split('-').reverse().join('-') : '________'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-header Title */}
            <div className="text-center bg-gray-50 border-b border-black py-1.5">
              <h2 className="text-sm font-black tracking-widest text-[#d32f2f] uppercase m-0">
                Freight Bill
              </h2>
            </div>
          </div>

          {/* Table Container - Stretches to fill all remaining height */}
          <div className="flex-grow flex flex-col my-0 min-h-[300px]">
            <table className="w-full border-collapse text-[11px] text-black h-full flex-grow">
              <thead>
                <tr className="border-b border-black font-bold text-center bg-gray-50 text-[10px]">
                  <th className="border-r border-black p-1.5 w-[14%] font-black">L.R.No.<br />& Date</th>
                  <th className="border-r border-black p-1.5 w-[14%] font-black">Lorry No.</th>
                  <th className="border-r border-black p-1.5 w-[30%] font-black">Particulars</th>
                  <th className="border-r border-black p-1.5 w-[10%] font-black">From</th>
                  <th className="border-r border-black p-1.5 w-[10%] font-black">To</th>
                  <th className="border-r border-black p-1.5 w-[8%] font-black">Weight</th>
                  <th className="border-r border-black p-1.5 w-[8%] font-black">Rate</th>
                  <th className="p-1.5 w-[10%] font-black">Freight</th>
                </tr>
              </thead>
              <tbody>
                {formData.entries.map((entry, idx) => (
                  <tr key={idx} className="border-b border-black h-[30px] font-semibold">
                    <td className="border-r border-black p-1.5 text-center leading-snug whitespace-pre-wrap">{entry.lrNoDate}</td>
                    <td className="border-r border-black p-1.5 text-center uppercase whitespace-pre-wrap">{entry.lorryNo}</td>
                    <td className="border-r border-black p-1.5 text-left leading-snug whitespace-pre-wrap">{entry.particulars}</td>
                    <td className="border-r border-black p-1.5 text-center whitespace-pre-wrap">{entry.from}</td>
                    <td className="border-r border-black p-1.5 text-center whitespace-pre-wrap">{entry.to}</td>
                    <td className="border-r border-black p-1.5 text-center whitespace-pre-wrap">{entry.weight}</td>
                    <td className="border-r border-black p-1.5 text-center whitespace-pre-wrap">{entry.rate}</td>
                    <td className="p-1.5 text-right font-mono text-xs whitespace-nowrap">{formatFreight(entry.freight)}</td>
                  </tr>
                ))}
                {formData.insuranceCharges && formData.insuranceCharges > 0 ? (
                  <tr className="h-[30px] font-semibold text-[11px]">
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5 pl-2 text-left" colSpan={2}>
                      Transit insurance charges
                    </td>
                    <td className="p-1.5 text-right font-mono text-xs whitespace-nowrap">
                      {formatFreight(formData.insuranceCharges.toString())}
                    </td>
                  </tr>
                ) : null}
                {/* Single stretching blank row to run vertical lines all the way down to the footer */}
                <tr className="h-full">
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="p-1.5"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Area */}
          <div className="shrink-0">
            {/* Rupees and Total Footer Row */}
            <div className="border-t-2 border-black grid grid-cols-5 text-[11px] font-bold">
              <div className="col-span-4 border-r border-black p-2 flex items-center gap-1 leading-snug">
                <span>Rupees</span>
                <span className="underline font-semibold italic text-xs capitalize text-gray-800">
                  {formData.rupeesInWords || '__________________________________________________________________'}
                </span>
              </div>
              <div className="col-span-1 p-2 flex justify-between items-center bg-gray-50">
                <span className="font-extrabold uppercase text-[10px]">Total</span>
                <span className="font-black text-[13px] font-mono text-[#d32f2f]">
                  {formatTotalFreight(formData.totalFreight)}
                </span>
              </div>
            </div>

            {/* Legal / Notes info */}
            <div className="border-t border-black p-2 grid grid-cols-2 text-[10px] font-bold text-gray-700 leading-tight">
              <div>
                <div>PAN No. : <span className="font-mono text-black">{formData.panNo}</span></div>
                <div>GST ID No. : <span className="font-mono text-black">{formData.gstId}</span></div>
              </div>
              <div className="text-right flex flex-col justify-end">
                <div>Subject to {formData.jurisdiction.toUpperCase()} Jurisdiction.</div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="border-t border-black p-2 flex justify-between items-end text-[10px] font-bold text-gray-800 min-h-[50px] pt-4">
              <div className="italic">E. & O. E.</div>
              <div className="text-center flex flex-col items-center">
                <div className="w-24 border-t border-black/40"></div>
                <div className="mt-1">Checked by</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-[9px] uppercase tracking-wider mb-8 text-[#d32f2f]">
                  For, ANJANEYA ROAD CARRIERS
                </div>
                <div className="w-40 border-t border-black/40"></div>
                <div className="mt-1 font-extrabold text-[9px] uppercase tracking-wide">Authorised Signatory</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FreightBillPrintView.displayName = 'FreightBillPrintView';
