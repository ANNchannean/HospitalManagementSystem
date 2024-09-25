import type { TPrescription } from '$lib/type';
import { writable } from 'svelte/store';

export const copyPrescription = writable<TPrescription[]>([]);
