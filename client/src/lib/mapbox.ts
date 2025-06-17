export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [109.15, 11.65] as [number, number], // Centered on Ninh Thuan businesses
  zoom: 11,
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