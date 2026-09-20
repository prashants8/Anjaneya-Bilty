import { supabase } from '../supabaseClient';
import { LetterData } from '@/types/letter';

const TABLE = 'letters';
const LOCAL_STORAGE_KEY_PREFIX = 'letters_';

// Helper to get current user ID safely
async function getCurrentUserId(): Promise<string | undefined> {
  if (!supabase) return undefined;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  } catch (e) {
    return undefined;
  }
}

function getLocalLetters(userId?: string): LetterData[] {
  try {
    const key = userId ? LOCAL_STORAGE_KEY_PREFIX + userId : 'letters_fallback';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading letters from localStorage', e);
    return [];
  }
}

function saveLocalLetters(letters: LetterData[], userId?: string) {
  try {
    const key = userId ? LOCAL_STORAGE_KEY_PREFIX + userId : 'letters_fallback';
    localStorage.setItem(key, JSON.stringify(letters));
  } catch (e) {
    console.error('Error saving letters to localStorage', e);
  }
}

export async function getLetters(): Promise<LetterData[]> {
  const userId = await getCurrentUserId();
  if (!supabase) {
    return getLocalLetters(userId).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Table letters might not exist in Supabase yet, querying localStorage instead:', error.message);
      return getLocalLetters(userId).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    }
    return (data || []).map(row => row.data as LetterData);
  } catch (err: any) {
    console.error('Failed to fetch letters from Supabase, using localStorage:', err);
    return getLocalLetters(userId).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }
}

export async function getLetterById(id: string): Promise<LetterData | null> {
  const userId = await getCurrentUserId();
  if (!supabase) {
    const letters = getLocalLetters(userId);
    return letters.find(l => l.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('data')
      .eq('letter_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return (data?.data as LetterData) || null;
  } catch (err) {
    console.error(`Failed to fetch letter ${id} from Supabase, using localStorage:`, err);
    const letters = getLocalLetters(userId);
    return letters.find(l => l.id === id) || null;
  }
}

export async function saveLetter(letter: LetterData): Promise<LetterData> {
  const userId = await getCurrentUserId();
  const letterToSave: LetterData = {
    ...letter,
    id: letter.id || `letter_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    updatedAt: new Date().toISOString(),
    createdAt: letter.createdAt || new Date().toISOString(),
  };

  // Sync to local fallback first
  const letters = getLocalLetters(userId);
  const index = letters.findIndex(l => l.id === letterToSave.id);
  if (index !== -1) {
    letters[index] = letterToSave;
  } else {
    letters.unshift(letterToSave);
  }
  saveLocalLetters(letters, userId);

  if (!supabase) {
    return letterToSave;
  }

  try {
    const { error } = await supabase
      .from(TABLE)
      .upsert({
        letter_id: letterToSave.id,
        ref_no: letterToSave.refNo,
        recipient_name: letterToSave.recipientName,
        letter_date: letterToSave.date,
        user_id: userId,
        data: letterToSave,
        updated_at: letterToSave.updatedAt,
      }, { onConflict: 'letter_id' });

    if (error) {
      console.warn('Supabase upsert failed, stored in localStorage:', error.message);
    }
  } catch (err: any) {
    console.error('Supabase letter save error (falling back to localStorage):', err);
  }

  return letterToSave;
}

export async function deleteLetter(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const letters = getLocalLetters(userId).filter(l => l.id !== id);
  saveLocalLetters(letters, userId);

  if (!supabase) return;

  try {
    await supabase
      .from(TABLE)
      .delete()
      .eq('letter_id', id)
      .eq('user_id', userId);
  } catch (err: any) {
    console.error('Supabase letter delete error:', err);
  }
}
