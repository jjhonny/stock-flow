// Serviço utilitário para manipulação de dados no localStorage

export function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function setLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalData(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
} 