import { useEffect, useRef, useState } from 'react';
import type { BusinessWithCategory } from '@shared/schema';
import { Button } from './button';
import { Plus, Minus, Target } from 'lucide-react';

interface MapProps {
  businesses: BusinessWithCategory[];
  onBusinessClick?: (business: BusinessWithCategory) => void;
  selectedBusiness?: BusinessWithCategory | null;
}

export function Map({ businesses, onBusinessClick, selectedBusiness }: MapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(11);
  const [center, setCenter] = useState({ lat: 11.65, lng: 109.15 });

  // Coordinate conversion
  const latLngToPixel = (lat: number, lng: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const scale = Math.pow(2, zoom - 8);
    const x = ((lng - center.lng) * scale * 300) + canvas.width / 2;
    const y = ((center.lat - lat) * scale * 300) + canvas.height / 2;
    
    return { x, y };
  };

  const getCategoryIcon = (slug: string): { color: string } => {
    const iconMap: Record<string, { color: string }> = {
      'stay': { color: '#DD4327' },
      'food-drink': { color: '#3FC1C4' },
      'kiting': { color: '#DD4327' },
      'surf': { color: '#3FC1C4' },
      'things-to-do': { color: '#A9D3D2' },
      'atm': { color: '#DD4327' },
      'medical': { color: '#DD4327' },
      'market': { color: '#3FC1C4' },
      'supermarket': { color: '#3FC1C4' },
      'mechanic': { color: '#A9D3D2' },
      'phone-repair': { color: '#DD4327' },
      'gym': { color: '#3FC1C4' },
      'massage': { color: '#A9D3D2' },
      'recreation': { color: '#3FC1C4' },
      'waterfall': { color: '#3FC1C4' },
      'attractions': { color: '#DD4327' },
      'pharmacy': { color: '#DD4327' },
      'mobile-phone': { color: '#A9D3D2' },
    };

    return iconMap[slug] || { color: '#6B7280' };
  };

  // Draw map
  const drawMap = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ocean background
    ctx.fillStyle = '#a8dadc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw simplified landmass for Vietnam coastline
    ctx.fillStyle = '#f1faee';
    ctx.strokeStyle = '#457b9d';
    ctx.lineWidth = 2;
    
    // Simple coastline shape
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.3, canvas.height * 0.1);
    ctx.quadraticCurveTo(canvas.width * 0.4, canvas.height * 0.3, canvas.width * 0.35, canvas.height * 0.6);
    ctx.quadraticCurveTo(canvas.width * 0.3, canvas.height * 0.8, canvas.width * 0.4, canvas.height * 0.9);
    ctx.lineTo(canvas.width * 0.7, canvas.height * 0.9);
    ctx.quadraticCurveTo(canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.75, canvas.height * 0.4);
    ctx.quadraticCurveTo(canvas.width * 0.7, canvas.height * 0.2, canvas.width * 0.6, canvas.height * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw businesses
    businesses.forEach((business) => {
      if (!business.latitude || !business.longitude) return;

      const lat = Number(business.latitude);
      const lng = Number(business.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const { x, y } = latLngToPixel(lat, lng);
      
      // Only draw if within canvas bounds
      if (x < -20 || x > canvas.width + 20 || y < -20 || y > canvas.height + 20) return;

      const categorySlug = business.category?.slug || '';
      const iconData = getCategoryIcon(categorySlug);

      // Draw marker shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 16, 0, 2 * Math.PI);
      ctx.fill();

      // Draw marker
      ctx.fillStyle = iconData.color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw inner dot
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Highlight selected business
      if (selectedBusiness && selectedBusiness.id === business.id) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };

  // Initialize and draw
  useEffect(() => {
    drawMap();
  }, [businesses, zoom, center, selectedBusiness]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => drawMap();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [businesses, zoom, center]);

  // Handle clicks
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find clicked business
      businesses.forEach((business) => {
        if (!business.latitude || !business.longitude) return;

        const lat = Number(business.latitude);
        const lng = Number(business.longitude);
        const pixel = latLngToPixel(lat, lng);

        const distance = Math.sqrt(Math.pow(x - pixel.x, 2) + Math.pow(y - pixel.y, 2));
        if (distance <= 16) {
          onBusinessClick?.(business);
        }
      });
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [businesses, onBusinessClick, zoom, center]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 16));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 8));
  };

  const handleFitBounds = () => {
    if (businesses.length === 0) return;

    const validBusinesses = businesses.filter(b => b.latitude && b.longitude);
    if (validBusinesses.length === 0) return;

    const lats = validBusinesses.map(b => Number(b.latitude));
    const lngs = validBusinesses.map(b => Number(b.longitude));

    const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
    const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;

    setCenter({ lat: centerLat, lng: centerLng });
    setZoom(12);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
          setZoom(14);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Auto-fit on mount
  useEffect(() => {
    if (businesses.length > 0) {
      setTimeout(handleFitBounds, 500);
    }
  }, [businesses.length]);

  const categories = businesses.map(b => b.category).filter((category, index, self) =>
    index === self.findIndex((t) => (
      t && category && t.id === category.id
    ))
  ).filter(Boolean) as BusinessWithCategory['category'][];

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
        style={{ background: '#a8dadc' }}
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
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

      {/* Bottom Controls */}
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
        </div>
        
        {/* All Places Summary */}
        <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
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
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 border-2 border-white shadow-sm"
                    style={{ backgroundColor: iconData.color }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
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