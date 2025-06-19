export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  center: { lat: 11.609051, lng: 109.146630 }, // Ninh Thuan coordinates
  zoom: 10,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || '',
};

export interface MapMarker {
  id: number;
  longitude: number;
  latitude: number;
  name: string;
  category: string;
  color: string;
}

export const getCategoryColor = (categorySlug: string): string => {
  const colorMap: Record<string, string> = {
    'accommodation': '#DDB097',
    'food-drink': '#F7BAAD',
    'kiting': '#3FC1C4',
    'surf': '#35949B',
    'things-to-do': '#A9D3D2',
    'atm': '#DD4327',
    'medical': '#DC2626',
    'market': '#059669',
    'supermarket': '#0891B2',
    'mechanic': '#7C3AED',
    'phone-repair': '#EA580C',
    'gym': '#BE185D',
    'massage': '#9333EA',
    'recreation': '#16A34A',
    'waterfall': '#0284C7',
    'attractions': '#C2410C',
    'pharmacy': '#DC2626',
    'mobile-phone': '#7C2D12',
  };

  return colorMap[categorySlug] || '#6B7280';
};

export const getCategoryIconPath = (categorySlug: string): string => {
  const iconPaths: Record<string, string> = {
    'accommodation': 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', // Building icon
    'food-drink': 'M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z', // Knife and fork
    'kiting': 'M12 1l-8 10 8 12 8-12-8-10zm0 4l5 6-5 8-5-8 5-6z', // Diamond kite shape
    'surf': 'M3 12c3-2 6-2 9 0s6 2 9 0M3 16c3-2 6-2 9 0s6 2 9 0M12 6c-1.5 0-3 1-4 3l8 0c-1-2-2.5-3-4-3z', // Surfboard on waves
    'things-to-do': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', // Star
    'atm': 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5v-8h14v8z', // Credit card
    'medical': 'M13 3h-2v8H3v2h8v8h2v-8h8v-2h-8V3z', // Simple medical cross
    'market': 'M19 7h-3V6a4 4 0 00-8 0v1H5a1 1 0 00-1 1v11a3 3 0 003 3h10a3 3 0 003-3V8a1 1 0 00-1-1zM10 6a2 2 0 014 0v1h-4V6zm8 13a1 1 0 01-1 1H7a1 1 0 01-1-1V9h2v1a1 1 0 002 0V9h4v1a1 1 0 002 0V9h2v10z', // Shopping bag
    'supermarket': 'M7 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z', // Shopping cart icon
    'mechanic': 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z', // Wrench
    'phone-repair': 'M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4H7V5h10v12z', // Phone
    'gym': 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z', // Dumbbell
    'massage': 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2zm-6 6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z', // Relaxing person
    'recreation': 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM7 7h3v2l2 7h-2l-1.5-5L7 13v7H5v-8l2-3zm8 0h2v2l1 3v8h-2v-7l-1.5-2L16 16h-2l2-7V7zm-3 2v1l1 1v9h-2v-6l-1-1V9h2z', // Hiking person with backpack and stick
    'waterfall': 'M8 2h8v2H8V2zm0 4h8v2l-2 2v2l-2 2v2l-2 2v4H8v-4l-2-2v-2L4 10V8h4V6zm2 14h4v2h-4v-2zm-2-2h8v2H8v-2z', // Cascading waterfall
    'attractions': 'M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-1.8c1.77 0 3.2-1.43 3.2-3.2 0-1.77-1.43-3.2-3.2-3.2S8.8 10.23 8.8 12c0 1.77 1.43 3.2 3.2 3.2z', // Camera icon
    'pharmacy': 'M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h5v5h2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h7v-2H4V6z', // Plus cross
    'mobile-phone': 'M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4H7V5h10v12z', // Mobile
  };

  return iconPaths[categorySlug] || 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';
};

export const createCustomMarkerIcon = (categorySlug: string, size: number = 40): string => {
  const color = getCategoryColor(categorySlug);
  const iconPath = getCategoryIconPath(categorySlug);

  // Create SVG marker with circular background and vector icon
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${(size-4)/2}" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <g transform="translate(${size * 0.25}, ${size * 0.25}) scale(${size * 0.02})">
        <path d="${iconPath}" fill="white"/>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};