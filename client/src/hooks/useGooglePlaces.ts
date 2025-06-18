
import { useState, useEffect } from 'react';
import { searchPlaceByName, getPlaceDetails, PlaceDetails } from '@/lib/googlemaps';
import type { BusinessWithCategory } from '@shared/schema';

export function useGooglePlaces(business: BusinessWithCategory | null) {
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!business || !business.latitude || !business.longitude) {
        setPlaceDetails(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const lat = parseFloat(business.latitude);
        const lng = parseFloat(business.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          throw new Error('Invalid coordinates');
        }

        console.log(`Fetching Google Places data for: ${business.name} at (${lat}, ${lng})`);

        // Wait for Google Maps API to be fully loaded
        let retries = 0;
        const maxRetries = 10;
        
        while ((!window.google || !window.google.maps || !window.google.maps.places) && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500));
          retries++;
        }

        if (!window.google || !window.google.maps || !window.google.maps.places) {
          throw new Error('Google Maps API not loaded');
        }

        // First, search for the place to get its Place ID
        const placeId = await searchPlaceByName(business.name, lat, lng);
        
        if (!placeId) {
          console.log(`No Place ID found for: ${business.name}`);
          throw new Error('Place not found in Google Places');
        }

        console.log(`Found Place ID: ${placeId} for ${business.name}`);

        // Then get detailed information
        const details = await getPlaceDetails(placeId);
        
        if (details) {
          console.log(`Retrieved Google Places details for: ${business.name}`, details);
          setPlaceDetails(details);
        } else {
          throw new Error('Failed to retrieve place details');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch place details';
        console.error(`Google Places error for ${business.name}:`, errorMessage);
        setError(errorMessage);
        setPlaceDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timeoutId = setTimeout(fetchPlaceDetails, 100);
    
    return () => clearTimeout(timeoutId);
  }, [business?.id, business?.name, business?.latitude, business?.longitude]);

  return { placeDetails, isLoading, error };
}
