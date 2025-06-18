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
    'stay': '#DDB097',
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
    'stay': 'M3 21v-6h18v6H3zm3-8V7a4 4 0 118 0v6h-8zm2-6a2 2 0 114 0v6H8V7z', // Bed icon
    'food-drink': 'M8.5 8.5c1.84 0 3.53.5 4.5 1.3.97-.8 2.66-1.3 4.5-1.3s3.53.5 4.5 1.3v9.2h-18v-9.2c.97-.8 2.66-1.3 4.5-1.3z', // Restaurant
    'kiting': 'M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11,4 10.19,4.5 10,5.18L11,5.82L10.82,6L9.82,5.5C10.19,4.5 11,4 12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8H4A1,1 0 0,1 3,7A1,1 0 0,1 4,6H8V8H4M18.5,12.5A1.5,1.5 0 0,1 17,14A1.5,1.5 0 0,1 15.5,12.5A1.5,1.5 0 0,1 17,11A1.5,1.5 0 0,1 18.5,12.5M7,13A1,1 0 0,1 6,14A1,1 0 0,1 5,13A1,1 0 0,1 6,12A1,1 0 0,1 7,13Z', // Wind flow icon
    'surf': 'M17 5.923A1 1 0 0016 5h-4a1 1 0 00-1 .923L10.5 8.5 12 10l1.5-1.5L15 6h1l1 1.923z', // Wave
    'things-to-do': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', // Star
    'atm': 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5v-8h14v8z', // Credit card
    'medical': 'M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h5v5h2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h7v-2H4V6z', // Medical cross
    'market': 'M19 7h-3V6a4 4 0 00-8 0v1H5a1 1 0 00-1 1v11a3 3 0 003 3h10a3 3 0 003-3V8a1 1 0 00-1-1zM10 6a2 2 0 014 0v1h-4V6zm8 13a1 1 0 01-1 1H7a1 1 0 01-1-1V9h2v1a1 1 0 002 0V9h4v1a1 1 0 002 0V9h2v10z', // Shopping bag
    'supermarket': 'M4 7V4a1 1 0 011-1h14a1 1 0 011 1v3h-2V5H6v2H4zm16 4l-1 7H5l-1-7h16zM7 15h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z', // Store
    'mechanic': 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z', // Wrench
    'phone-repair': 'M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4H7V5h10v12z', // Phone
    'gym': 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z', // Dumbbell
    'massage': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', // Spa
    'recreation': 'M17.6 9.48l1.84-3.18c.16-.31.25-.66.25-1.02C19.69 4.01 18.68 3 17.41 3c-.68 0-1.32.37-1.66.96l-.82 1.42-.82-1.42C13.77 3.37 13.13 3 12.45 3 11.18 3 10.17 4.01 10.17 5.28c0 .36.09.71.25 1.02l1.84 3.18L10.4 12 9 11l-3 6 2 1 2.4-4.8 2.6 1.4 2.6-1.4L18 18l2-1-3-6-1.4 1 1.84-3.18z', // Beach umbrella
    'waterfall': 'M12 2l-2 8h1.5l.5-2 .5 2H14l-2-8zm0 10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z', // Drop
    'attractions': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', // Map pin
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