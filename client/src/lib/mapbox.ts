export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [109.146630, 11.609051] as [number, number], // Ninh Thuan coordinates
  zoom: 10,
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
    'stay': '#DD4327', // chili-red
    'food-drink': '#F97316', // orange-500
    'kiting': '#06B6D4', // cyan-500 (tropical-aqua)
    'surf': '#0EA5E9', // sky-500 (sea-blue)
    'things-to-do': '#8B5CF6', // violet-500
    'atm': '#EF4444', // red-500
    'medical': '#DC2626', // red-600
    'market': '#10B981', // emerald-500
    'supermarket': '#0891B2', // cyan-600
    'mechanic': '#7C3AED', // violet-600
    'phone-repair': '#EA580C', // orange-600
    'gym': '#BE185D', // pink-600
    'massage': '#9333EA', // purple-500
    'recreation': '#16A34A', // green-600
    'waterfall': '#0284C7', // sky-600
    'attractions': '#F59E0B', // amber-500
    'pharmacy': '#DC2626', // red-600
    'mobile-phone': '#7C2D12', // orange-900
  };

  return colorMap[categorySlug] || '#6B7280';
};