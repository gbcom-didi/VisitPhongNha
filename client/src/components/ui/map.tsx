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

      // Create marker element with branded circular background and SVG icon
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = iconData.color;
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 3px 12px rgba(0,0,0,0.15)';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.position = 'relative';
      el.innerHTML = iconData.svg;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1) translateY(-2px)';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateY(0)';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
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

  const getCategoryIcon = (slug: string): { svg: string; color: string } => {
    const iconMap: Record<string, { svg: string; color: string }> = {
      'stay': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
        color: '#DD4327' 
      },
      'food-drink': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
        color: '#3FC1C4' 
      },
      'kiting': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4.5L12 2L10 4.5"/><path d="M12 2v6l-3 1 10 13-1-10-3-2z"/></svg>',
        color: '#E85A4F' 
      },
      'surf': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20c.6-4.4 2.1-8.4 4.6-11.5 2.5-3.1 5.9-5 9.4-5s6.9 1.9 9.4 5c2.5 3.1 4 7.1 4.6 11.5"/><path d="M2 16c.6-3.2 1.5-6.2 2.8-8.8 1.3-2.6 3-4.8 5.2-6.4"/></svg>',
        color: '#2E8B8B' 
      },
      'things-to-do': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        color: '#C49991' 
      },
      'atm': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="12" r="2"/><line x1="16" y1="12" x2="18" y2="12"/></svg>',
        color: '#DD4327' 
      },
      'medical': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h6"/><path d="M12 9v6"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>',
        color: '#B83D3D' 
      },
      'market': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        color: '#4A9B9B' 
      },
      'supermarket': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM9 9h6v6H9z"/><line x1="9" y1="1" x2="9" y2="3"/><line x1="15" y1="1" x2="15" y2="3"/><line x1="9" y1="21" x2="9" y2="23"/><line x1="15" y1="21" x2="15" y2="23"/></svg>',
        color: '#6BA6A6' 
      },
      'mechanic': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        color: '#8AA6A6' 
      },
      'phone-repair': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
        color: '#C2726E' 
      },
      'gym': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6.5 12h11"/><circle cx="12" cy="12" r="2"/></svg>',
        color: '#5E9B9B' 
      },
      'massage': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5S15.7 9 16.5 9s1.5.7 1.5 1.5zM9 10.5c0 .8-.7 1.5-1.5 1.5S6 11.3 6 10.5 6.7 9 7.5 9s1.5.7 1.5 1.5z"/><path d="M12 2a8 8 0 1 0 8 8"/></svg>',
        color: '#96A6A6' 
      },
      'recreation': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
        color: '#7EB0B0' 
      },
      'waterfall': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.11 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2.04 4.6 4.14 6.12s3.83 2.96 4.14 5.48c0 3.31-2.69 6-6 6"/></svg>',
        color: '#52A6A6' 
      },
      'attractions': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11z"/><circle cx="12" cy="13" r="4"/></svg>',
        color: '#DD4327' 
      },
      'pharmacy': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 20.5c-.28 0-.5-.22-.5-.5V10l7-7 7 7v10c0 .28-.22.5-.5.5h-13z"/><path d="M12 9v6m-3-3h6"/></svg>',
        color: '#B83D3D' 
      },
      'mobile-phone': { 
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        color: '#A68A8A' 
      },
    };

    return iconMap[slug] || { svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>', color: '#6B7280' };
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

            return (
              <div key={categorySlug} className="flex items-center">
                <div 
                  className="w-5 h-5 rounded bg-white border border-gray-200 shadow-sm mr-2 flex-shrink-0 flex items-center justify-center text-xs"
                >
                  {getCategoryIcon(categorySlug)}
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