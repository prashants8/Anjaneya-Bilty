export interface BiltyFormData {
  // Header Info
  gstPayableBy: 'consignor' | 'consignee';
  gcNumber: string;
  date: string;
  biltyNumber: string;
  
  // Consignor Details
  consignorName: string;
  consignorPlace: string;
  consignorGstin: string;
  
  // Consignee Details
  consigneeName: string;
  consigneePlace: string;
  consigneeGstin: string;
  
  // Goods Details
  numberOfArticles: string;
  methodOfPacking: string;
  descriptionOfGoods: string;
  actualWeightKg: string;
  grossWeight: string;
  unloadingBy: string;
  lorryNumber: string;
  
  // Freight Details
  freightRatePerKg: string;
  freightAmountToPay: string;
  freightAmountToPayPs: string;
  freightAmountPaid: string;
  freightAmountPaidPs: string;
  
  stationChargeToPay: string;
  stationChargeToPayPs: string;
  stationChargePaid: string;
  stationChargePaidPs: string;
  
  weightChargesToPay: string;
  weightChargesToPayPs: string;
  weightChargesPaid: string;
  weightChargesPaidPs: string;
  
  hamaliToPay: string;
  hamaliToPayPs: string;
  hamaliPaid: string;
  hamaliPaidPs: string;
  
  insuranceChargeToPay: string;
  insuranceChargeToPayPs: string;
  insuranceChargePaid: string;
  insuranceChargePaidPs: string;
  
  deliveryChargeToPay: string;
  deliveryChargeToPayPs: string;
  deliveryChargePaid: string;
  deliveryChargePaidPs: string;
  
  billMrNumber: string;
  
  totalToPay: string;
  totalToPayPs: string;
  totalPaid: string;
  totalPaidPs: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceValue: string;
  amountInWords: string;
  ewayBillNumber: string;
  deliveryLocation: string;
  bookingIncharge: string;
}

export interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
}

export const defaultBankDetails: BankDetails = {
  bankName: "STATE BANK OF INDIA",
  branchName: "MAIN BRANCH",
  accountNumber: "1234567890",
  ifscCode: "SBIN0001234"
};

export const initialBiltyData: BiltyFormData = {
  gstPayableBy: 'consignor',
  gcNumber: '',
  date: new Date().toISOString().split('T')[0],
  biltyNumber: '',
  
  consignorName: '',
  consignorPlace: '',
  consignorGstin: '',
  
  consigneeName: '',
  consigneePlace: '',
  consigneeGstin: '',
  
  numberOfArticles: '',
  methodOfPacking: '',
  descriptionOfGoods: '',
  actualWeightKg: '',
  grossWeight: '',
  unloadingBy: '',
  lorryNumber: '',
  
  freightRatePerKg: '',
  freightAmountToPay: '',
  freightAmountToPayPs: '00',
  freightAmountPaid: '',
  freightAmountPaidPs: '00',
  
  stationChargeToPay: '',
  stationChargeToPayPs: '00',
  stationChargePaid: '',
  stationChargePaidPs: '00',
  
  weightChargesToPay: '',
  weightChargesToPayPs: '00',
  weightChargesPaid: '',
  weightChargesPaidPs: '00',
  
  hamaliToPay: '',
  hamaliToPayPs: '00',
  hamaliPaid: '',
  hamaliPaidPs: '00',
  
  insuranceChargeToPay: '',
  insuranceChargeToPayPs: '00',
  insuranceChargePaid: '',
  insuranceChargePaidPs: '00',
  
  deliveryChargeToPay: '',
  deliveryChargeToPayPs: '00',
  deliveryChargePaid: '',
  deliveryChargePaidPs: '00',
  
  billMrNumber: '',
  
  totalToPay: '',
  totalToPayPs: '00',
  totalPaid: '',
  totalPaidPs: '00',
  
  invoiceNumber: '',
  invoiceValue: '',
  amountInWords: '',
  ewayBillNumber: '',
  deliveryLocation: '',
  bookingIncharge: ''
};
