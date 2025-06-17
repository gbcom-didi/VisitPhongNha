import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG, getCategoryColor } from '@/lib/mapbox';
import type { BusinessWithCategory } from '@shared/schema';
import { Button } from './button';
import { Plus, Minus, Target } from 'lucide-react';

interface MapProps {
  businesses: BusinessWithCategory[];
  onBusinessClick?: (business: BusinessWithCategory) => void;
  selectedBusiness?: BusinessWithCategory | null;
}

export function Map({ businesses, onBusinessClick, selectedBusiness }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const initializeMap = () => {
      if (!mapContainer.current) {
        console.log('Map container not ready');
        return;
      }

      try {
        mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: MAPBOX_CONFIG.style,
          center: MAPBOX_CONFIG.center,
          zoom: MAPBOX_CONFIG.zoom,
        });

        map.current.on('load', () => {
          setIsLoaded(true);
        });

        map.current.on('error', (error) => {
          console.error('Map error:', error);
        });
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    // Add a small delay to ensure the container is ready
    const timer = setTimeout(initializeMap, 200);

    return () => {
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when businesses change
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    businesses.forEach((business) => {
      if (!business.latitude || !business.longitude) return;

      const lat = parseFloat(business.latitude);
      const lng = parseFloat(business.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const categorySlug = business.category?.slug || '';
      const iconData = getCategoryIcon(categorySlug);

      // Create marker element with minimal Material Design style
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = iconData.color;
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '14px';
      el.style.fontWeight = '600';
      el.style.color = 'white';
      el.style.position = 'relative';
      el.innerHTML = iconData.symbol;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
        el.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
        el.style.zIndex = 'auto';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        onBusinessClick?.(business);
      });

      markers.current.push(marker);
    });
  }, [businesses, isLoaded, onBusinessClick]);

  // Highlight selected business
  useEffect(() => {
    if (!selectedBusiness || !map.current) return;

    const lat = parseFloat(selectedBusiness.latitude);
    const lng = parseFloat(selectedBusiness.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 1000
      });
    }
  }, [selectedBusiness]);

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const handleFitBounds = () => {
    if (!map.current || businesses.length === 0) return;

    const coordinates = businesses
      .filter(b => b.latitude && b.longitude)
      .map(b => [parseFloat(b.longitude), parseFloat(b.latitude)] as [number, number]);

    if (coordinates.length === 0) return;

    const bounds = coordinates.reduce(
      (bounds, coord) => bounds.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    );

    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            duration: 1000
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const categories = businesses.map(b => b.category).filter((category, index, self) =>
    index === self.findIndex((t) => (
      t && category && t.id === category.id
    ))
  ).filter(Boolean) as BusinessWithCategory['category'][];

  const getCategoryIcon = (slug: string): { symbol: string; color: string } => {
    const iconMap: Record<string, { symbol: string; color: string }> = {
      'stay': { symbol: '⌂', color: '#DD4327' },
      'food-drink': { symbol: '○', color: '#3FC1C4' },
      'kiting': { symbol: '◊', color: '#DD4327' },
      'surf': { symbol: '~', color: '#3FC1C4' },
      'things-to-do': { symbol: '★', color: '#A9D3D2' },
      'atm': { symbol: '$', color: '#DD4327' },
      'medical': { symbol: '+', color: '#DD4327' },
      'market': { symbol: '■', color: '#3FC1C4' },
      'supermarket': { symbol: '▲', color: '#3FC1C4' },
      'mechanic': { symbol: '⚙', color: '#A9D3D2' },
      'phone-repair': { symbol: '●', color: '#DD4327' },
      'gym': { symbol: '◉', color: '#3FC1C4' },
      'massage': { symbol: '✋', color: '#A9D3D2' },
      'recreation': { symbol: '◈', color: '#3FC1C4' },
      'waterfall': { symbol: '◦', color: '#3FC1C4' },
      'attractions': { symbol: '◐', color: '#DD4327' },
      'pharmacy': { symbol: '⊕', color: '#DD4327' },
      'mobile-phone': { symbol: '◑', color: '#A9D3D2' },
    };

    return iconMap[slug] || { symbol: '●', color: '#6B7280' };
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-1">
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-white hover:bg-gray-50"
          onClick={handleZoomIn}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-white hover:bg-gray-50"
          onClick={handleZoomOut}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      {/* Current Location Button */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-white hover:bg-gray-50"
          onClick={handleCurrentLocation}
          title="Go to current location"
        >
          <Target className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="px-2 py-1 text-xs bg-white hover:bg-gray-50"
          onClick={handleFitBounds}
          title="Fit all businesses"
        >
          Fit All
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10 min-w-48">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold text-gray-900 text-sm">Map Legend</h5>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* All Places Summary */}
        <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-3">
              <span className="text-white text-xs">📍</span>
            </div>
            <span className="text-gray-700 text-sm font-medium">All Places</span>
          </div>
          <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">{businesses.length}</span>
        </div>

        <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
          {Array.from(new Set(businesses.map(b => b.category?.slug).filter(Boolean))).map((categorySlug) => {
            if (!categorySlug) return null;
            const category = businesses.find(b => b.category?.slug === categorySlug)?.category;
            const count = businesses.filter(b => b.category?.slug === categorySlug).length;
            if (!category) return null;

            const iconData = getCategoryIcon(categorySlug as string);

            return (
              <div key={categorySlug} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 text-xs font-semibold border-2 border-white shadow-sm"
                    style={{ backgroundColor: iconData.color, color: 'white' }}
                  >
                    {iconData.symbol}
                  </div>
                  <span className="text-gray-700 truncate font-medium">{category.name}</span>
                </div>
                <span 
                  className="text-white text-xs px-2 py-1 rounded-full ml-2 font-medium"
                  style={{ backgroundColor: iconData.color }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}