import { useEffect, useRef, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GOOGLE_MAPS_CONFIG, createCustomMarkerIcon } from '@/lib/googlemaps';
import type { BusinessWithCategory } from '@shared/schema';
import { Button } from './button';
import { Plus, Minus, Target } from 'lucide-react';

interface MapProps {
  businesses: BusinessWithCategory[];
  onBusinessClick?: (business: BusinessWithCategory) => void;
  selectedBusiness?: BusinessWithCategory | null;
  hoveredBusiness?: BusinessWithCategory | null;
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Google Maps component
function GoogleMapComponent({ businesses, onBusinessClick, selectedBusiness, hoveredBusiness, center, zoom }: MapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const businessMarkersRef = useRef<{ [businessId: number]: google.maps.Marker }>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<google.maps.InfoWindow | null>(null);

  // Tooltip helper functions using InfoWindow for simplicity and reliability
  const showTooltip = useCallback((text: string, position: { lat: number; lng: number }) => {
    if (!mapRef.current || !window.google) return;

    // Remove existing tooltip
    if (tooltipRef.current) {
      tooltipRef.current.close();
    }

    // Create new tooltip using InfoWindow with custom styling
    tooltipRef.current = new google.maps.InfoWindow({
      content: `
        <div style="
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          font-family: system-ui, -apple-system, sans-serif;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        ">
          ${text}
        </div>
      `,
      position: { lat: position.lat, lng: position.lng },
      disableAutoPan: true,
      pixelOffset: new google.maps.Size(0, -45)
    });

    tooltipRef.current.open(mapRef.current);
  }, []);

  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.close();
      tooltipRef.current = null;
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || !window.google) return;

    const map = new google.maps.Map(mapContainerRef.current, {
      center: center || GOOGLE_MAPS_CONFIG.center,
      zoom: zoom || GOOGLE_MAPS_CONFIG.zoom,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
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
    
    // Cleanup function
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.setMap(null);
        tooltipRef.current = null;
      }
    };
  }, [initializeMap]);

  // Update markers when businesses change
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    businessMarkersRef.current = {};

    // Add new markers
    businesses.forEach((business) => {
      if (!business.latitude || !business.longitude) return;

      const lat = parseFloat(business.latitude);
      const lng = parseFloat(business.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const categorySlug = business.category?.slug || '';
      
      // Create custom marker with circular background and category icon
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: `${business.name}|${categorySlug}`, // Store category for later use
        icon: {
          url: createCustomMarkerIcon(categorySlug, 36),
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 18),
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

      // Add hover listeners for tooltip
      marker.addListener('mouseover', () => {
        showTooltip(business.name, { lat, lng });
      });

      marker.addListener('mouseout', () => {
        hideTooltip();
      });

      markersRef.current.push(marker);
      businessMarkersRef.current[business.id] = marker;
    });
  }, [businesses, onBusinessClick, showTooltip, hideTooltip]);

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

  // Handle hovered business highlighting
  useEffect(() => {
    // Reset all markers to normal size and color first
    Object.values(businessMarkersRef.current).forEach(marker => {
      const categorySlug = marker.getTitle()?.split('|')[1] || '';
      marker.setIcon({
        url: createCustomMarkerIcon(categorySlug, 36, false),
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 18),
      });
      marker.setZIndex(1);
    });

    // Hide tooltip when no business is hovered
    if (!hoveredBusiness) {
      hideTooltip();
    }

    // Highlight the hovered business marker and zoom to it
    if (hoveredBusiness && businessMarkersRef.current[hoveredBusiness.id] && mapRef.current) {
      const hoveredMarker = businessMarkersRef.current[hoveredBusiness.id];
      const categorySlug = hoveredBusiness.category?.slug || '';
      
      // Create black highlighted marker
      hoveredMarker.setIcon({
        url: createCustomMarkerIcon(categorySlug, 48, true), // Black highlighted marker
        scaledSize: new google.maps.Size(48, 48),
        anchor: new google.maps.Point(24, 24),
      });
      
      // Bring to front
      hoveredMarker.setZIndex(1000);
      
      // Show tooltip for hovered business card
      const lat = parseFloat(hoveredBusiness.latitude);
      const lng = parseFloat(hoveredBusiness.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        showTooltip(hoveredBusiness.name, { lat, lng });
        mapRef.current.panTo({ lat, lng });
        const currentZoom = mapRef.current.getZoom() || 10;
        if (currentZoom < 14) {
          mapRef.current.setZoom(14);
        }
      }
    }
  }, [hoveredBusiness, showTooltip, hideTooltip]);

  // Map controls
  const zoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 10;
      mapRef.current.setZoom(currentZoom + 1);
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 10;
      mapRef.current.setZoom(currentZoom - 1);
    }
  };

  const centerMap = () => {
    if (mapRef.current) {
      mapRef.current.panTo(center || GOOGLE_MAPS_CONFIG.center);
      mapRef.current.setZoom(zoom || GOOGLE_MAPS_CONFIG.zoom);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Custom Map Controls */}
      <div className="absolute top-20 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-white/90 hover:bg-white border-gray-300 shadow-sm"
          onClick={zoomIn}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-white/90 hover:bg-white border-gray-300 shadow-sm"
          onClick={zoomOut}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-white/90 hover:bg-white border-gray-300 shadow-sm"
          onClick={centerMap}
        >
          <Target className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Render function for Google Maps wrapper
const render = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">Failed to load Google Maps</p>
            <p className="text-xs text-gray-500">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <p className="text-sm text-gray-600">Initializing map...</p>
        </div>
      );
  }
};

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