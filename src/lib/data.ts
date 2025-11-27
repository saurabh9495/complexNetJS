import data from './placeholder-images.json';
import type { Ad } from './types';

// The type assertion is safe because we control the JSON structure.
export const adData: Ad = data.ad as Ad;
