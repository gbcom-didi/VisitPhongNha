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

      // Convert decimal coordinates to numbers
      const lat = Number(business.latitude);
      const lng = Number(business.longitude);

      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        console.warn(`Invalid coordinates for ${business.name}: lat=${business.latitude}, lng=${business.longitude}, parsed: lat=${lat}, lng=${lng}`);
        return;
      }

      // Debug logging for coordinate issues
      console.log(`Creating marker for ${business.name}: lat=${lat}, lng=${lng}, [lng, lat]=[${lng}, ${lat}]`);

      // Additional validation for realistic coordinates in Vietnam
      if (lat < 8 || lat > 24 || lng < 102 || lng > 112) {
        console.warn(`Coordinates outside Vietnam for ${business.name}: lat=${lat}, lng=${lng}`);
        return;
      }

      const categorySlug = business.category?.slug || '';
      const iconData = getCategoryIcon(categorySlug);

      // Create marker element with smaller icon
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = iconData.color;
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.position = 'relative';
      el.innerHTML = iconData.svg;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
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

    let lat, lng;
    
    if (typeof selectedBusiness.latitude === 'string') {
      lat = parseFloat(selectedBusiness.latitude.replace(',', '.'));
    } else if (typeof selectedBusiness.latitude === 'number') {
      lat = selectedBusiness.latitude;
    } else {
      lat = parseFloat(String(selectedBusiness.latitude));
    }
    
    if (typeof selectedBusiness.longitude === 'string') {
      lng = parseFloat(selectedBusiness.longitude.replace(',', '.'));
    } else if (typeof selectedBusiness.longitude === 'number') {
      lng = selectedBusiness.longitude;
    } else {
      lng = parseFloat(String(selectedBusiness.longitude));
    }

    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
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

  const getCategoryIcon = (slug: string): { svg: string; color: string } => {
    const iconMap: Record<string, { svg: string; color: string }> = {
      'stay': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>', 
        color: '#DDB097' 
      },
      'food-drink': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M6 2L6 8c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V2"/><path d="M6 5h9"/><path d="m17 2-1 20h-2"/></svg>', 
        color: '#F7BAAD' 
      },
      'kiting': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>', 
        color: '#3FC1C4' 
      },
      'surf': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M2 18a10 10 0 0 0 20 0"/><path d="M2 12a10 10 0 0 0 20 0"/><path d="M2 6a10 10 0 0 0 20 0"/></svg>', 
        color: '#35949B' 
      },
      'things-to-do': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>', 
        color: '#A9D3D2' 
      },
      'atm': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', 
        color: '#DD4327' 
      },
      'medical': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>', 
        color: '#DC2626' 
      },
      'market': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/><path d="M5 4h14l-1 10H6L5 4Z"/><path d="M9 9v6"/><path d="M15 9v6"/></svg>', 
        color: '#059669' 
      },
      'supermarket': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', 
        color: '#0891B2' 
      },
      'mechanic': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', 
        color: '#7C3AED' 
      },
      'phone-repair': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>', 
        color: '#EA580C' 
      },
      'gym': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6.5 12h11"/><path d="M16 6.5v11"/><path d="M8 6.5v11"/></svg>', 
        color: '#BE185D' 
      },
      'massage': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2a3 3 0 0 0-3 3c0 1.5 0 2.5 0 4a3 3 0 0 0 6 0c0-1.5 0-2.5 0-4a3 3 0 0 0-3-3z"/><path d="M19 13H5"/><path d="M19 17H5"/><path d="M19 21H5"/></svg>', 
        color: '#9333EA' 
      },
      'recreation': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', 
        color: '#16A34A' 
      },
      'waterfall': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2.26 4.89 4.56 6.68a7.58 7.58 0 0 1 2.79 5.98c0 2.9-2.18 5.32-5.35 5.32s-5.35-2.42-5.35-5.32a7.58 7.58 0 0 1 1.91-4.08z"/></svg>', 
        color: '#0284C7' 
      },
      'attractions': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11z"/><circle cx="12" cy="13" r="3"/></svg>', 
        color: '#C2410C' 
      },
      'pharmacy': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>', 
        color: '#DC2626' 
      },
      'mobile-phone': { 
        svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>', 
        color: '#7C2D12' 
      },
    };

    return iconMap[slug] || { svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg>', color: '#6B7280' };
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
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
                    dangerouslySetInnerHTML={{ __html: iconData.svg }}
                  >
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