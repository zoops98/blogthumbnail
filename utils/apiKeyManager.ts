
const STORAGE_KEY = 'thumbmaster_api_key';
const SECRET = 'THUMBMASTER_SECURE_KEY_2024';

// 간단한 XOR 난독화 (클라이언트 사이드 암호화)
const xorEncrypt = (text: string): string => {
  try {
    const textChars = text.split('').map(c => c.charCodeAt(0));
    const secretChars = SECRET.split('').map(c => c.charCodeAt(0));
    const encrypted = textChars.map((c, i) => c ^ secretChars[i % secretChars.length]);
    return btoa(String.fromCharCode(...encrypted));
  } catch (e) {
    console.error("Encryption failed", e);
    return "";
  }
};

const xorDecrypt = (cipher: string): string => {
  try {
    const encryptedChars = atob(cipher).split('').map(c => c.charCodeAt(0));
    const secretChars = SECRET.split('').map(c => c.charCodeAt(0));
    const decrypted = encryptedChars.map((c, i) => c ^ secretChars[i % secretChars.length]);
    return String.fromCharCode(...decrypted);
  } catch (e) {
    return '';
  }
};

export const saveApiKey = (key: string) => {
  localStorage.setItem(STORAGE_KEY, xorEncrypt(key));
};

export const getStoredApiKey = (): string | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  return xorDecrypt(stored);
};

export const removeApiKey = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasStoredApiKey = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};
