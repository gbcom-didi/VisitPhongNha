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
  hoveredBusiness?: BusinessWithCategory | null;
}

export function Map({ businesses, onBusinessClick, selectedBusiness, hoveredBusiness }: MapProps) {
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

      // Create marker element with location pin icon
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#DC2626'; // Red background
      el.style.width = '24px';
      el.style.height = '32px';
      el.style.borderRadius = '12px 12px 12px 0';
      el.style.transform = 'rotate(-45deg)';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      el.style.cursor = 'pointer';
      el.style.transition = 'box-shadow 0.2s';
      el.style.position = 'relative';
      
      // Add white dot in center
      const dot = document.createElement('div');
      dot.style.position = 'absolute';
      dot.style.top = '50%';
      dot.style.left = '50%';
      dot.style.transform = 'translate(-50%, -50%) rotate(45deg)';
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.backgroundColor = 'white';
      dot.style.borderRadius = '50%';
      el.appendChild(dot);

      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.innerHTML = business.name;
      tooltip.style.position = 'absolute';
      tooltip.style.bottom = '40px';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '6px 10px';
      tooltip.style.borderRadius = '6px';
      tooltip.style.fontSize = '12px';
      tooltip.style.whiteSpace = 'nowrap';
      tooltip.style.display = 'none';
      tooltip.style.zIndex = '1000';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      // Add small arrow to tooltip
      const arrow = document.createElement('div');
      arrow.style.position = 'absolute';
      arrow.style.top = '100%';
      arrow.style.left = '50%';
      arrow.style.transform = 'translateX(-50%)';
      arrow.style.width = '0';
      arrow.style.height = '0';
      arrow.style.borderLeft = '4px solid transparent';
      arrow.style.borderRight = '4px solid transparent';
      arrow.style.borderTop = '4px solid rgba(0, 0, 0, 0.8)';
      tooltip.appendChild(arrow);
      
      el.appendChild(tooltip);

      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        tooltip.style.display = 'block';
      });

      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        tooltip.style.display = 'none';
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

  // Handle hovered business zoom
  useEffect(() => {
    if (!hoveredBusiness || !map.current) return;

    const lat = parseFloat(hoveredBusiness.latitude);
    const lng = parseFloat(hoveredBusiness.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 800
      });
    }
  }, [hoveredBusiness]);

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

      
    </div>
  );
}