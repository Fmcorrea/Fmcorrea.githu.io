import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve URLs do protocolo dyad-media:// para URLs HTTPS acessíveis pelo navegador.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return "";
  
  if (url.startsWith("dyad-media://")) {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    // Formato padrão de API para assets do projeto
    return `https://api.dyad.sh/v1/projects/peaceful-shiba-flip/media/${fileName}`;
  }
  
  return url;
}