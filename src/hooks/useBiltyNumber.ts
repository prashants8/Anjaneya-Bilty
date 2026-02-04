import { useState, useEffect } from 'react';

const BILTY_COUNTER_KEY = 'bilty_counter';
const BILTY_PREFIX = 'BLT';

export const useBiltyNumber = () => {
  const [biltyNumber, setBiltyNumber] = useState<string>('');

  const generateBiltyNumber = (): string => {
    const currentCounter = parseInt(localStorage.getItem(BILTY_COUNTER_KEY) || '0', 10);
    const newCounter = currentCounter + 1;
    localStorage.setItem(BILTY_COUNTER_KEY, newCounter.toString());
    
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const paddedCounter = newCounter.toString().padStart(5, '0');
    
    return `${BILTY_PREFIX}${year}${month}${paddedCounter}`;
  };

  const getNextBiltyNumber = (): string => {
    const newNumber = generateBiltyNumber();
    setBiltyNumber(newNumber);
    return newNumber;
  };

  const getCurrentPreviewNumber = (): string => {
    const currentCounter = parseInt(localStorage.getItem(BILTY_COUNTER_KEY) || '0', 10);
    const nextCounter = currentCounter + 1;
    
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const paddedCounter = nextCounter.toString().padStart(5, '0');
    
    return `${BILTY_PREFIX}${year}${month}${paddedCounter}`;
  };

  useEffect(() => {
    setBiltyNumber(getCurrentPreviewNumber());
  }, []);

  return {
    biltyNumber,
    getNextBiltyNumber,
    getCurrentPreviewNumber
  };
};
