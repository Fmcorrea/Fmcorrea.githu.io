import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera a URL pública para um arquivo no Supabase Storage.
 * Substitua 'game-assets' pelo nome do seu bucket se for diferente.
 */
export function getSupabaseUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  
  const PROJECT_ID = "dsqrtngwglvkvcpdilfm";
  const BUCKET = "game-assets"; // Certifique-se de que o bucket é público
  
  return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${path}`;
}