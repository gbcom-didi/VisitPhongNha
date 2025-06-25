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
      
      // Create custom marker with circular background and category icon
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: business.name,
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

  // Handle hovered business zoom with smooth animation
  useEffect(() => {
    if (!hoveredBusiness || !mapRef.current) return;

    const lat = parseFloat(hoveredBusiness.latitude);
    const lng = parseFloat(hoveredBusiness.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const currentZoom = mapRef.current.getZoom() || 10;
      const zoomOutLevel = Math.max(9, currentZoom - 2); // Less dramatic zoom out
      const targetZoom = 16; // Final zoom level
      
      // Phase 1: Zoom out smoothly and quickly
      let zoomOutStep = 0;
      const zoomOutSteps = 5; // Fewer steps for faster animation
      const zoomOutDifference = zoomOutLevel - currentZoom;
      const zoomOutStepSize = zoomOutDifference / zoomOutSteps;
      
      const zoomOutAnimation = () => {
        if (zoomOutStep < zoomOutSteps && mapRef.current) {
          const newZoom = currentZoom + (zoomOutStepSize * zoomOutStep);
          mapRef.current.setZoom(newZoom);
          zoomOutStep++;
          setTimeout(zoomOutAnimation, 25); // Faster timing
        } else if (mapRef.current) {
          // Set exact zoom out level and pan to new location
          mapRef.current.setZoom(zoomOutLevel);
          
          // Minimal pause at zoom out level before panning
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.panTo({ lat, lng });
              
              // Phase 2: Zoom in to target location more smoothly
              setTimeout(() => {
                let zoomInStep = 0;
                const zoomInSteps = 8; // More steps for smoother zoom in
                const zoomInDifference = targetZoom - zoomOutLevel;
                const zoomInStepSize = zoomInDifference / zoomInSteps;
                
                const zoomInAnimation = () => {
                  if (zoomInStep < zoomInSteps && mapRef.current) {
                    const newZoom = zoomOutLevel + (zoomInStepSize * zoomInStep);
                    mapRef.current.setZoom(newZoom);
                    zoomInStep++;
                    setTimeout(zoomInAnimation, 40); // Slower for smoothness
                  } else if (mapRef.current) {
                    mapRef.current.setZoom(targetZoom);
                  }
                };
                
                zoomInAnimation();
              }, 100); // Short pause before zoom in
            }
          }, 50); // Very short pause at zoom out level
        }
      };
      
      zoomOutAnimation();
    }
  }, [hoveredBusiness]);

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
      mapRef.current.panTo(GOOGLE_MAPS_CONFIG.center);
      mapRef.current.setZoom(GOOGLE_MAPS_CONFIG.zoom);
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
const render = (status: Status) => {
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
      return null;
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