export interface LetterData {
  id: string;
  refNo: string;
  date: string;
  recipientName: string;
  recipientAddress: string;
  salutation: string;
  subject?: string;
  content: string;
  closing: string;
  signatoryName: string;
  companyName: string;
  location: string;
  designation: string;
  includeHeader: boolean;
  headerMarginMm: number;
  showSignatureBlock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  subject?: string;
  salutation: string;
  content: string;
}

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'payment_reminder',
    name: 'Payment Request / Follow-up',
    description: 'Request pending balance payment for freight bills (as in sample)',
    salutation: 'Dear sir,',
    subject: 'Request for deposit of pending freight bill payment',
    content: `As per our discussion had with you regarding transportation charges, we prepare our freight bill(s) as below:

Bill No. [Bill No] date [Date] amount Rs. [Amount]/-
Total Freight Charges: Rs. [Total]/-
We have received advance: Rs. [Advance]/-
Balance payment pending: Rs. [Balance]/-

Now we are very kindly requesting you sir please deposit our balance payment as soon as possible.`,
  },
  {
    id: 'freight_quotation',
    name: 'Freight Rate Quotation',
    description: 'Provide transport / freight rate quote for consignments',
    salutation: 'Dear sir,',
    subject: 'Quotation for Transportation Services',
    content: `With reference to your inquiry regarding transportation charges, we are pleased to offer our best competitive rates as follows:

1. Origin: [Origin]
2. Destination: [Destination]
3. Vehicle Type: [Vehicle Type]
4. Quoted Freight Rate: Rs. [Rate]/-
5. Loading / Unloading terms: By Consignor / Consignee

Transit insurance and toll taxes as per terms discussed. We assure you our best and prompt service at all times.`,
  },
  {
    id: 'consignment_intimation',
    name: 'Vehicle & Consignment Intimation',
    description: 'Intimate dispatch and transit details of goods/machinery',
    salutation: 'Dear sir,',
    subject: 'Intimation of Consignment Dispatch',
    content: `We would like to inform you that your valued consignment has been loaded and dispatched from [From] to [To] under the following details:

- L.R. No. & Date: [LR No & Date]
- Vehicle / Lorry No: [Lorry No]
- Driver Contact No: [Driver Mobile]
- Description of Material: [Material Particulars]

The consignment is in transit and expected to reach safely on or before [Expected Date].`,
  },
  {
    id: 'blank_letter',
    name: 'Blank Letterhead',
    description: 'Start with a clean sheet for any custom official letter',
    salutation: 'Dear sir,',
    subject: '',
    content: '',
  },
];

export const initialLetterData: LetterData = {
  id: '',
  refNo: '',
  date: new Date().toISOString().split('T')[0],
  recipientName: 'Jindal Developers',
  recipientAddress: 'Bargarh Orissa',
  salutation: 'Dear sir',
  subject: '',
  content: `As per our discussion had with you regarding transportation charges from Mehsana to Bargarh we prepare our freight bill no. 395 date. 15/03/2021 amount Rs. 400000/ and bill no. 396 date. 15/03/2021 amount Rs.265000/ so our total freight charges Rs.665000/
We have received advance Rs.400000/
Balance payment pending Rs. 265000/
Now we are very kindly requesting you sir please deposit our balance payment as soon as possible`,
  closing: 'Regards',
  signatoryName: 'J.S. Shukla',
  companyName: 'Anjaneya Road Carriers',
  location: 'Chhatral Gujrat',
  designation: 'Proprietor',
  includeHeader: true,
  headerMarginMm: 52,
  showSignatureBlock: true,
};
