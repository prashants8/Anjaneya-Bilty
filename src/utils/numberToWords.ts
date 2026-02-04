const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

const scales = ['', 'Thousand', 'Lakh', 'Crore'];

function convertTwoDigits(num: number): string {
  if (num < 20) return ones[num];
  const ten = Math.floor(num / 10);
  const one = num % 10;
  return tens[ten] + (one ? ' ' + ones[one] : '');
}

function convertThreeDigits(num: number): string {
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  let result = '';
  if (hundred) result = ones[hundred] + ' Hundred';
  if (remainder) result += (result ? ' ' : '') + convertTwoDigits(remainder);
  return result;
}

export function numberToWords(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num) || num === 0) return '';
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  if (rupees === 0 && paise === 0) return '';
  
  let words = '';
  
  if (rupees > 0) {
    // Indian numbering system: 1,00,00,000 (Crore), 1,00,000 (Lakh), 1,000 (Thousand)
    const crore = Math.floor(rupees / 10000000);
    const lakh = Math.floor((rupees % 10000000) / 100000);
    const thousand = Math.floor((rupees % 100000) / 1000);
    const remainder = rupees % 1000;
    
    if (crore) words += convertTwoDigits(crore) + ' Crore ';
    if (lakh) words += convertTwoDigits(lakh) + ' Lakh ';
    if (thousand) words += convertTwoDigits(thousand) + ' Thousand ';
    if (remainder) words += convertThreeDigits(remainder);
    
    words = words.trim() + ' Rupees';
  }
  
  if (paise > 0) {
    words += (rupees > 0 ? ' and ' : '') + convertTwoDigits(paise) + ' Paise';
  }
  
  return words + ' Only';
}
