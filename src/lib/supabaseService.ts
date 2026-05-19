import { supabase } from '../supabaseClient';
import { FreightBillData } from '@/types/bill';

const TABLE = 'freight_bills';
const LOCAL_STORAGE_KEY = 'freight_bills_fallback';

function getLocalBills(): FreightBillData[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading from localStorage', e);
    return [];
  }
}

function saveLocalBills(bills: FreightBillData[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bills));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export async function getFreightBills(): Promise<FreightBillData[]> {
  if (!supabase) {
    console.warn('Supabase is not configured, falling back to localStorage');
    return getLocalBills().sort((a, b) => b.billNo.localeCompare(a.billNo));
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('bill_date', { ascending: false });

    if (error) {
      console.warn('Table might not exist in Supabase yet, querying localStorage instead:', error.message);
      return getLocalBills().sort((a, b) => b.billNo.localeCompare(a.billNo));
    }
    return (data || []).map(row => row.data as FreightBillData);
  } catch (err: any) {
    console.error('Failed to fetch from Supabase, using localStorage:', err);
    return getLocalBills().sort((a, b) => b.billNo.localeCompare(a.billNo));
  }
}

export async function getFreightBillByNo(billNo: string): Promise<FreightBillData | null> {
  if (!supabase) {
    const bills = getLocalBills();
    return bills.find(b => b.billNo === billNo) || null;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('data')
      .eq('bill_no', billNo)
      .maybeSingle();

    if (error) throw error;
    return (data?.data as FreightBillData) || null;
  } catch (err) {
    console.error(`Failed to fetch ${billNo} from Supabase, using localStorage:`, err);
    const bills = getLocalBills();
    return bills.find(b => b.billNo === billNo) || null;
  }
}

export async function createFreightBill(bill: FreightBillData) {
  if (!supabase) {
    // Local fallback mode only
    const bills = getLocalBills();
    if (bills.some(b => b.billNo === bill.billNo)) {
      throw new Error(`Bill Number ${bill.billNo} already exists.`);
    }
    bills.push(bill);
    saveLocalBills(bills);
    return bill;
  }

  try {
    const { error } = await supabase
      .from(TABLE)
      .insert([{
        bill_no: bill.billNo,
        client_name: bill.clientName,
        bill_date: bill.date,
        total_freight: bill.totalFreight,
        data: bill
      }]);

    if (error) {
      if (error.code === '23505') {
        throw new Error(`Bill Number ${bill.billNo} already exists.`);
      }
      if (error.code === '42501') {
        throw new Error(`Supabase RLS Error: Row Level Security is active. Run "ALTER TABLE public.freight_bills DISABLE ROW LEVEL SECURITY;" in your SQL Editor.`);
      }
      if (error.code === '42P01') {
        throw new Error(`Supabase Schema Error: Table "freight_bills" does not exist. Please create it.`);
      }
      throw error;
    }

    // Sync to local fallback
    const bills = getLocalBills();
    const index = bills.findIndex(b => b.billNo === bill.billNo);
    if (index !== -1) {
      bills[index] = bill;
    } else {
      bills.push(bill);
    }
    saveLocalBills(bills);

    return bill;
  } catch (err: any) {
    console.error('Failed to create in Supabase. Error:', err.message || err);
    if (err.message?.includes('already exists') || err.message?.includes('Supabase RLS') || err.message?.includes('Supabase Schema')) {
      throw err;
    }
    // If it is a network error or fetch failure, fall back to purely local storage
    const bills = getLocalBills();
    if (bills.some(b => b.billNo === bill.billNo)) {
      throw new Error(`Bill Number ${bill.billNo} already exists.`);
    }
    bills.push(bill);
    saveLocalBills(bills);
    return bill;
  }
}

export async function updateFreightBill(bill: FreightBillData) {
  // Sync to local fallback
  let bills = getLocalBills();
  const index = bills.findIndex(b => b.billNo === bill.billNo);
  if (index !== -1) {
    bills[index] = bill;
  } else {
    bills.push(bill);
  }
  saveLocalBills(bills);

  if (!supabase) {
    console.warn('Supabase is not configured, updated only in localStorage');
    return bill;
  }

  try {
    const { error } = await supabase
      .from(TABLE)
      .update({
        client_name: bill.clientName,
        bill_date: bill.date,
        total_freight: bill.totalFreight,
        data: bill
      })
      .eq('bill_no', bill.billNo);

    if (error) throw error;
    return bill;
  } catch (err: any) {
    console.error('Failed to update in Supabase, synced to localStorage. Error:', err.message);
    return bill;
  }
}

export async function deleteFreightBill(billNo: string) {
  // Sync to local fallback
  let bills = getLocalBills();
  bills = bills.filter(b => b.billNo !== billNo);
  saveLocalBills(bills);

  if (!supabase) {
    console.warn('Supabase is not configured, deleted only in localStorage');
    return;
  }

  try {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('bill_no', billNo);

    if (error) throw error;
  } catch (err: any) {
    console.error('Failed to delete in Supabase, deleted from localStorage. Error:', err.message);
  }
}
