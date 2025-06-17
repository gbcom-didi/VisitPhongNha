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

      let lat, lng;
      
      if (typeof business.latitude === 'string') {
        lat = parseFloat(business.latitude.replace(',', '.'));
      } else if (typeof business.latitude === 'number') {
        lat = business.latitude;
      } else {
        lat = parseFloat(String(business.latitude));
      }
      
      if (typeof business.longitude === 'string') {
        lng = parseFloat(business.longitude.replace(',', '.'));
      } else if (typeof business.longitude === 'number') {
        lng = business.longitude;
      } else {
        lng = parseFloat(String(business.longitude));
      }

      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        console.warn(`Invalid coordinates for ${business.name}: lat=${business.latitude}, lng=${business.longitude}, parsed: lat=${lat}, lng=${lng}`);
        return;
      }

      // Additional validation for realistic coordinates in Vietnam
      if (lat < 8 || lat > 24 || lng < 102 || lng < 110) {
        console.warn(`Coordinates outside Vietnam for ${business.name}: lat=${lat}, lng=${lng}`);
        return;
      }

      console.log(`Creating marker for ${business.name}: lat=${lat}, lng=${lng}, [lng, lat]=[${lng}, ${lat}]`);

      const categorySlug = business.category?.slug || '';
      const categoryColor = getCategoryColor(categorySlug);
      const icon = getCategoryIcon(categorySlug);

      // Create marker element with colored circle and line art icon
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = categoryColor;
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.2s ease-in-out';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.position = 'relative';
      el.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${icon}
        </svg>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15) translateY(-3px)';
        el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateY(0)';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
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

  const getCategoryIcon = (slug: string): string => {
    const iconMap: Record<string, string> = {
      'stay': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
      'food-drink': '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
      'kiting': '<path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.16.21 2.84.21 4 0 5.16-1 9-5.45 9-11V7l-10-5z"/><path d="m9 12 2 2 4-4"/>',
      'surf': '<path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/>',
      'things-to-do': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      'atm': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
      'medical': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      'market': '<path d="m7 7 10-4-4 7h7l-7.5 7.5L15 13H8l-1-6Z"/>',
      'supermarket': '<path d="M3 3h18l-2 13H5L3 3Z"/><path d="M5 3 4 2H2"/><circle cx="9" cy="20" r="1"/><circle cx="20" cy="20" r="1"/>',
      'mechanic': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      'phone-repair': '<path d="m22 2-3 3m-2.5-2.5L11 8 2 9.5l3.5 3.5L8 11l5.5-5.5Z"/><path d="m18 6 4 4"/>',
      'gym': '<path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M4 8l8-2 8 2"/><path d="M4 16l8 2 8-2"/>',
      'massage': '<circle cx="12" cy="5" r="3"/><path d="m2 21 16-4"/><path d="m16 17-4 4"/>',
      'recreation': '<circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16 10,8"/>',
      'waterfall': '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A13.1 13.1 0 0 0 14 3.02c.5 2.5 2.04 4.6 4.14 5.5a13.1 13.1 0 0 0-1.44 3.56c-.43 1.94-.8 3.92-.8 5.92 0 1.94.2 3.84.6 5.6H12.56c-.4-1.8-.6-3.7-.6-5.6 0-2-.37-3.98-.8-5.92z"/>',
      'attractions': '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>',
      'pharmacy': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      'mobile-phone': '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    };

    return iconMap[slug] || '<circle cx="12" cy="12" r="10"/>';
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
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 max-w-52">
        <h5 className="font-semibold text-gray-900 mb-3 text-sm">Map Legend</h5>
        <div className="space-y-2 text-xs max-h-40 overflow-y-auto">
          {Array.from(new Set(businesses.map(b => b.category?.slug).filter(Boolean))).map((categorySlug) => {
            const category = businesses.find(b => b.category?.slug === categorySlug)?.category;
            if (!category) return null;
            const categoryColor = getCategoryColor(categorySlug);
            const icon = getCategoryIcon(categorySlug);

            return (
              <div key={categorySlug} className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: categoryColor }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <g dangerouslySetInnerHTML={{ __html: icon }} />
                  </svg>
                </div>
                <span className="text-gray-700 truncate">{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}