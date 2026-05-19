export interface BillEntry {
  lrNoDate: string;      // L.R. No. & Date (e.g. "1608 31.1.26")
  lorryNo: string;       // Lorry No. (e.g. "GJ-01 KT 5922")
  particulars: string;   // Particulars (e.g. "QGH25 32' x 8' x 9'")
  from: string;          // From (e.g. "Padhariya")
  to: string;            // To (e.g. "Sarangarh")
  weight: string;        // Weight (e.g. "FTL 10 M.T.")
  rate: string;          // Rate (e.g. "fixed")
  freight: string;       // Freight (e.g. "115100")
}

export interface FreightBillData {
  billNo: string;
  date: string;
  clientName: string;
  clientAddress: string;
  entries: BillEntry[];
  totalFreight: number;
  rupeesInWords: string;
  panNo: string;
  gstId: string;
  jurisdiction: string;
}

export interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
}

export const defaultBankDetails: BankDetails = {
  bankName: "Axis Bank",
  branchName: "KALOL",
  accountNumber: "913020041403247",
  ifscCode: "UTIB0000452"
};

export const initialBillEntry: BillEntry = {
  lrNoDate: '',
  lorryNo: '',
  particulars: '',
  from: '',
  to: '',
  weight: '',
  rate: '',
  freight: ''
};

export const initialBillData: FreightBillData = {
  billNo: '',
  date: new Date().toISOString().split('T')[0],
  clientName: '',
  clientAddress: '',
  entries: [{ ...initialBillEntry }],
  totalFreight: 0,
  rupeesInWords: '',
  panNo: 'FBIPS5544B',
  gstId: '24FBIPS5544B1ZN',
  jurisdiction: 'KALOL'
};
