import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import { EVENT_MODES, type EventMode } from "./models/event.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function getFormString(formData: FormData, key: string) {
//   return ((formData.get(key) as string) ?? "").trim();
// }

// export function isEventMode(value: string): value is EventMode {
//   return (EVENT_MODES as string[]).includes(value);
// }

export async function fileToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
