import { useEffect, useRef, useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GOOGLE_MAPS_CONFIG, getCategoryColor } from '@/lib/googlemaps';
import type { BusinessWithCategory } from '@shared/schema';
import { Button } from './button';
import { Plus, Minus, Target } from 'lucide-react';

interface MapProps {
  businesses: BusinessWithCategory[];
  onBusinessClick?: (business: BusinessWithCategory) => void;
  selectedBusiness?: BusinessWithCategory | null;
  hoveredBusiness?: BusinessWithCategory | null;
}

// Google Maps component
function GoogleMapComponent({ businesses, onBusinessClick, selectedBusiness, hoveredBusiness }: MapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || !window.google) return;

    const map = new google.maps.Map(mapContainerRef.current, {
      center: GOOGLE_MAPS_CONFIG.center,
      zoom: GOOGLE_MAPS_CONFIG.zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapRef.current = map;
  }, []);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // Update markers when businesses change
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    businesses.forEach((business) => {
      if (!business.latitude || !business.longitude) return;

      const lat = parseFloat(business.latitude);
      const lng = parseFloat(business.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const categorySlug = business.category?.slug || '';
      const color = getCategoryColor(categorySlug);
      const iconPath = getCategoryIconPath(categorySlug);

      // Create custom marker with circular icon
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: business.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3,
          scale: 12,
        },
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-weight: 600; margin-bottom: 4px;">${business.name}</div>
            <div style="font-size: 12px; color: #666;">${business.category?.name || ''}</div>
            ${business.address ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">${business.address}</div>` : ''}
          </div>
        `
      });

      // Add click listener
      marker.addListener('click', () => {
        onBusinessClick?.(business);
        infoWindow.open(mapRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [businesses, onBusinessClick]);

  // Highlight selected business
  useEffect(() => {
    if (!selectedBusiness || !mapRef.current) return;

    const lat = parseFloat(selectedBusiness.latitude);
    const lng = parseFloat(selectedBusiness.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  }, [selectedBusiness]);

  // Handle hovered business zoom
  useEffect(() => {
    if (!hoveredBusiness || !mapRef.current) return;

    const lat = parseFloat(hoveredBusiness.latitude);
    const lng = parseFloat(hoveredBusiness.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(16);
    }
  }, [hoveredBusiness]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 10;
      mapRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 10;
      mapRef.current.setZoom(currentZoom - 1);
    }
  };

  const handleFitBounds = () => {
    if (!mapRef.current || businesses.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    businesses.forEach((business) => {
      if (!business.latitude || !business.longitude) return;
      
      const lat = parseFloat(business.latitude);
      const lng = parseFloat(business.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend({ lat, lng });
      }
    });

    mapRef.current.fitBounds(bounds);
  };

  return (
    <div className="relative h-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white shadow-md hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white shadow-md hover:bg-gray-50"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleFitBounds}
          className="bg-white shadow-md hover:bg-gray-50"
          title="Fit all markers"
        >
          <Target className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Render function for wrapper status
const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">Failed to load Google Maps</p>
            <p className="text-xs text-gray-500">Please check your API key configuration</p>
          </div>
        </div>
      );
    case Status.SUCCESS:
      return null;
  }
};

// Helper function to get category-specific SVG icon paths
function getCategoryIconPath(slug: string): string {
  const iconPaths: Record<string, string> = {
    'stay': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M8 14h8v1H8v-1z M8 16h6v1H8v-1z', // Hotel icon
    'food-drink': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M8.5 8.5h7c.28 0 .5.22.5.5s-.22.5-.5.5h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z M10 10h4v1h-4v-1z', // Restaurant icon
    'kiting': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M12 6l3 3-3 1-3-1 3-3z M9 11l6 0v1l-6 0v-1z', // Kite icon
    'surf': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M8 8c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1V8z', // Surf icon
    'things-to-do': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M12 7l1.5 3h2l-1.5 2.5L12 10l-2 2.5L8.5 10h2L12 7z', // Activity icon
    'atm': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M8 8h8v4H8V8z M9 9v2h6V9H9z M10 10h4v1h-4v-1z', // ATM icon
    'medical': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M11 7h2v2h2v2h-2v2h-2V11H9V9h2V7z', // Medical cross icon
    'market': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M8 7h8l-1 5H9l-1-5z M9 8v1h6V8H9z', // Shopping bag icon
    'supermarket': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M7 7h10v1H7V7z M8 9h8v3H8V9z M9 10h6v1H9v-1z', // Store icon
    'mechanic': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M10 7h4l-1 4h-2l-1-4z M11 8v2h2V8h-2z', // Wrench icon
    'phone-repair': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M9 6h6v6H9V6z M10 7v4h4V7h-4z M11 8h2v2h-2V8z', // Phone icon
    'gym': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M8 9h2v2H8V9z M14 9h2v2h-2V9z M10 8h4v4h-4V8z', // Dumbbell icon
    'massage': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M10 7c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z M14 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z', // Spa icon
    'recreation': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z M9 9h6v1H9V9z M10 11h4v1h-4v-1z', // Recreation icon
    'waterfall': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M11 6h2v2h-2V6z M10 8h4v1h-4V8z M9 9h6v1H9V9z M10 10h4v1h-4v-1z', // Water drop icon
    'attractions': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M12 7l2 2-2 2-2-2 2-2z M9 10h6v1H9v-1z', // Star icon
    'pharmacy': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M11 7h2v2h2v2h-2v2h-2V11H9V9h2V7z M9 12h6v1H9v-1z', // Pharmacy cross icon
    'mobile-phone': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z M10 6h4v6h-4V6z M11 7v4h2V7h-2z M11.5 11.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z', // Mobile phone icon
  };

  // Default pin shape for unknown categories
  const defaultPath = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

  return iconPaths[slug] || defaultPath;
}

// Helper function to get category icons (kept for compatibility)
function getCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    'stay': '🏨',
    'food-drink': '🍽️',
    'kiting': '🪁',
    'surf': '🏄',
    'things-to-do': '🎯',
    'atm': '🏧',
    'medical': '🏥',
    'market': '🛒',
    'supermarket': '🏪',
    'mechanic': '🔧',
    'phone-repair': '📱',
    'gym': '💪',
    'massage': '💆',
    'recreation': '🎮',
    'waterfall': '💧',
    'attractions': '🎡',
    'pharmacy': '💊',
    'mobile-phone': '📞',
  };

  return iconMap[slug] || '📍';
}

// Main Map component with Google Maps wrapper
export function Map(props: MapProps) {
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Google Maps API key not configured</p>
          <p className="text-xs text-gray-500">Please set VITE_GOOGLE_MAPS_API_KEY environment variable</p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={GOOGLE_MAPS_CONFIG.apiKey} render={render}>
      <GoogleMapComponent {...props} />
    </Wrapper>
  );
}