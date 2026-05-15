import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Read persisted theme or default to dark
const stored = browser ? localStorage.getItem('theme') : null;
const initial = stored ?? 'dark';

export const theme = writable(initial);

// Persist & apply on every change
if (browser) {
  theme.subscribe((val) => {
    localStorage.setItem('theme', val);
    document.documentElement.classList.toggle('dark', val === 'dark');
  });
}

export function toggleTheme() {
  theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}
