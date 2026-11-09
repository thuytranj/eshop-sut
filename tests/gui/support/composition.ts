import { type Locator } from '@playwright/test';

export interface CompositionSample {
  type: string;
  data: string;
  isComposing: boolean;
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
  time: number;
}

declare global {
  interface Window {
    __composition_timeline?: CompositionSample[];
  }
}

export async function captureComposition(input: Locator): Promise<void> {
  await input.evaluate((el: HTMLInputElement | HTMLTextAreaElement) => {
    window.__composition_timeline = [];

    const record = (event: Event) => {
      const isComp = (event as any).isComposing ?? (event.type.startsWith('composition') && event.type !== 'compositionend');
      const data = (event as any).data ?? '';
      window.__composition_timeline!.push({
        type: event.type,
        data,
        isComposing: isComp,
        value: el.value,
        selectionStart: el.selectionStart,
        selectionEnd: el.selectionEnd,
        time: Date.now(),
      });
    };

    el.addEventListener('compositionstart', record);
    el.addEventListener('compositionupdate', record);
    el.addEventListener('compositionend', record);
    el.addEventListener('input', record);
  });
}

export async function readComposition(input: Locator): Promise<CompositionSample[]> {
  return await input.evaluate(() => {
    return window.__composition_timeline || [];
  });
}
