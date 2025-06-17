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
      const iconName = getCategoryIcon(categorySlug);
      const categoryColor = getCategoryColor(categorySlug);

      // Create marker element with category color background and Maki icon
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = categoryColor;
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s, box-shadow 0.2s';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.position = 'relative';

      // Create Maki icon using Mapbox's sprite service
      const iconEl = document.createElement('div');
      iconEl.style.width = '20px';
      iconEl.style.height = '20px';
      iconEl.style.backgroundImage = `url('https://api.mapbox.com/styles/v1/mapbox/sprites/bright-v9/sprite.png?access_token=${MAPBOX_CONFIG.accessToken}')`;
      iconEl.style.backgroundSize = '1024px 1024px';
      iconEl.style.filter = 'brightness(0) invert(1)'; // Make icon white
      
      // Set background position based on Maki icon (approximate positions)
      const iconPositions: Record<string, string> = {
        'lodging': '-40px -40px',
        'restaurant': '-60px -40px',
        'water': '-180px -40px',
        'swimming': '-160px -40px',
        'star': '-140px -40px',
        'bank': '-20px -40px',
        'hospital': '-80px -40px',
        'grocery': '-100px -40px',
        'shop': '-120px -40px',
        'car-repair': '-200px -40px',
        'mobile-phone': '-220px -40px',
        'fitness-centre': '-240px -40px',
        'doctor': '-260px -40px',
        'park': '-280px -40px',
        'natural': '-300px -40px',
        'attraction': '-320px -40px',
        'pharmacy': '-340px -40px',
        'telecommunications': '-360px -40px',
        'marker': '-0px -40px'
      };
      
      iconEl.style.backgroundPosition = iconPositions[iconName] || iconPositions['marker'];
      el.appendChild(iconEl);

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

  const getCategoryIcon = (slug: string): string => {
    // Mapbox Maki icon names that best match each category
    const iconMap: Record<string, string> = {
      'stay': 'lodging',
      'food-drink': 'restaurant',
      'kiting': 'water',
      'surf': 'swimming',
      'things-to-do': 'star',
      'atm': 'bank',
      'medical': 'hospital',
      'market': 'grocery',
      'supermarket': 'shop',
      'mechanic': 'car-repair',
      'phone-repair': 'mobile-phone',
      'gym': 'fitness-centre',
      'massage': 'doctor',
      'recreation': 'park',
      'waterfall': 'natural',
      'attractions': 'attraction',
      'pharmacy': 'pharmacy',
      'mobile-phone': 'telecommunications',
    };

    return iconMap[slug] || 'marker';
  };

  const getCategoryColor = (slug: string): string => {
    // Brand colors for each category
    const colorMap: Record<string, string> = {
      'stay': '#DDB097',        // Warm beige
      'food-drink': '#F7BAAD',  // Soft coral
      'kiting': '#3FC1C4',      // Tropical aqua
      'surf': '#35949B',        // Sea blue
      'things-to-do': '#A9D3D2', // Light aqua
      'atm': '#DD4327',         // Chili red
      'medical': '#DC2626',     // Red
      'market': '#059669',      // Green
      'supermarket': '#0891B2', // Blue
      'mechanic': '#7C3AED',    // Purple
      'phone-repair': '#EA580C', // Orange
      'gym': '#BE185D',         // Pink
      'massage': '#9333EA',     // Purple
      'recreation': '#16A34A',  // Green
      'waterfall': '#0284C7',   // Blue
      'attractions': '#C2410C', // Orange
      'pharmacy': '#DC2626',    // Red
      'mobile-phone': '#7C2D12', // Brown
    };

    return colorMap[slug] || '#6B7280';
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

            return (
              <div key={categorySlug} className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: categoryColor }}
                >
                  <div 
                    className="w-3 h-3"
                    style={{
                      backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/sprites/bright-v9/sprite.png?access_token=${MAPBOX_CONFIG.accessToken}')`,
                      backgroundSize: '512px 512px',
                      backgroundPosition: getCategoryIcon(categorySlug) === 'lodging' ? '-20px -20px' : 
                                        getCategoryIcon(categorySlug) === 'restaurant' ? '-30px -20px' :
                                        getCategoryIcon(categorySlug) === 'water' ? '-90px -20px' :
                                        getCategoryIcon(categorySlug) === 'bank' ? '-10px -20px' :
                                        getCategoryIcon(categorySlug) === 'hospital' ? '-40px -20px' :
                                        '-0px -20px',
                      filter: 'brightness(0) invert(1)'
                    }}
                  />
                </div>
                <span className="text-gray-700 truncate text-xs">{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}