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

      // Create custom marker with circular icon and category-specific line art
      const svgIcon = createCategoryIcon(categorySlug, color);
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: business.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
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

// Helper function to create SVG icon with circular background and line art
function createCategoryIcon(slug: string, color: string): string {
  const iconPaths: Record<string, string> = {
    'stay': 'M8 6h8v1H8V6zm0 2h6v1H8V8zm0 2h8v1H8v-1zm0 2h4v1H8v-1z', // Hotel beds
    'food-drink': 'M12 3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 2h2v2h-2V5zm-3 6c0 .55-.45 1-1 1s-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v2zm10 0c0 .55-.45 1-1 1s-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v2z', // Restaurant utensils
    'kiting': 'M5 4l7 7-1.5 1.5L5 7V4zm14 0l-7 7 1.5 1.5L19 7V4zM12 12l-2 2h4l-2-2zm-2 4l2 2 2-2h-4z', // Kite
    'surf': 'M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9zm-18 0c0-1.66.67-3.16 1.76-4.24l5.66 5.66c.39.39.39 1.02 0 1.41l-5.66 5.66C3.67 19.16 3 17.66 3 16zm9 6c-1.66 0-3.16-.67-4.24-1.76l5.66-5.66c.39-.39 1.02-.39 1.41 0l5.66 5.66C19.16 20.33 17.66 21 16 21z', // Wave
    'things-to-do': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', // Star
    'atm': 'M5 6h14v2H5V6zm0 4h14v8H5v-8zm2 2v4h10v-4H7zm2 1h6v2H9v-2z', // ATM machine
    'medical': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm-1 5v3H8v2h3v3h2v-3h3v-2h-3V7h-2z', // Medical cross
    'market': 'M7 4V2c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v2h4v2h-1l-.68 10.21c-.06.88-.8 1.59-1.69 1.59H5.37c-.89 0-1.63-.71-1.69-1.59L3 6H2V4h5zm2-1v1h6V3H9zm-3.32 3L6.38 16h11.24l.7-10H5.68z', // Shopping bag
    'supermarket': 'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z', // Shopping cart
    'mechanic': 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z', // Wrench
    'phone-repair': 'M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C17 2.12 15.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z', // Phone
    'gym': 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z', // Dumbbell
    'massage': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', // Hands/spa
    'recreation': 'M13 7.5c0-.28.22-.5.5-.5s.5.22.5.5-.22.5-.5.5-.5-.22-.5-.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.12.23-2.18.65-3.15L8 11.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5l3.35 2.65C11.82 13.77 11.88 14 12 14s.18-.23.65-.85L16 11.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5l3.35-2.65c.42.97.65 2.03.65 3.15 0 4.41-3.59 8-8 8z', // Activity/play
    'waterfall': 'M12 2l-1.5 1.5L12 5l1.5-1.5L12 2zm0 3l-1.5 1.5L12 8l1.5-1.5L12 5zm0 3l-1.5 1.5L12 11l1.5-1.5L12 8zm0 3l-1.5 1.5L12 14l1.5-1.5L12 11zm0 3l-1.5 1.5L12 17l1.5-1.5L12 14zm0 3l-1.5 1.5L12 20l1.5-1.5L12 17z', // Water drops
    'attractions': 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z', // Star attraction
    'pharmacy': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm-1 5v3H8v2h3v3h2v-3h3v-2h-3V7h-2z', // Pharmacy cross
    'mobile-phone': 'M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C17 2.12 15.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z', // Mobile phone
  };

  const iconPath = iconPaths[slug] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'; // Default circle

  return `
    <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2" opacity="0.9"/>
      <path d="${iconPath}" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>
    </svg>
  `;
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