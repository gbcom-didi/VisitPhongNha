
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

        // First, search for the place to get its Place ID
        const placeId = await searchPlaceByName(business.name, lat, lng);
        
        if (!placeId) {
          throw new Error('Place not found');
        }

        // Then get detailed information
        const details = await getPlaceDetails(placeId);
        setPlaceDetails(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch place details');
        setPlaceDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [business?.id, business?.name, business?.latitude, business?.longitude]);

  return { placeDetails, isLoading, error };
}
