import { apiMapBox } from '@/api/api-mapbox';
import mapboxgl from 'mapbox-gl';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { DirectionsResponse } from './types/directions.types';
import type { MapCoordinates } from './types/maps-store.type';
import type { Feature, SearchPlacesResponse } from './types/search-places.type';

export const useMapsStore = defineStore('maps', () => {
  const isLoading = ref(true);
  const isLoadingPlaces = ref(false);
  const userLocation = ref<MapCoordinates>();
  const mapBox = ref<mapboxgl.Map>();
  const places = ref<Feature[]>([]);
  const markers = ref<mapboxgl.Marker[]>([]);

  const setMapBox = (map: mapboxgl.Map) => {
    mapBox.value = map;
  };

  const setCenterMap = () => {
    if (!userLocation.value) return;

    if (mapBox.value) {
      mapBox.value.flyTo({
        center: [userLocation.value.lng, userLocation.value.lat],
        zoom: 14,
      });
      // mapBox.value.setCenter([userLocation.value.lng, userLocation.value.lat]);
      // mapBox.value.setZoom(14);
    }
  };

  const addMarkers = (places: Feature[]) => {
    if (!mapBox.value) {
      console.error('No se ha inicializado el mapa');
      return;
    }

    markers.value.forEach((marker) => marker.remove());
    markers.value = [];

    const newMarkers: mapboxgl.Marker[] = places.map((place) => {
      const markerPopup = new mapboxgl.Popup()
        .setLngLat(place.geometry.coordinates as [number, number])
        .setHTML(`<h2>${place.properties.name}</h2><p>${place.properties.full_address}</p>`);

      const marker = new mapboxgl.Marker()
        .setLngLat(place.geometry.coordinates as [number, number])
        .setPopup(markerPopup)
        .addTo(mapBox.value!);

      return marker;
    });

    markers.value = newMarkers;
  };

  const searchPlaces = async (term: string) => {
    places.value = [];
    if (term.length < 3) {
      return;
    }

    if (!userLocation.value) {
      console.error('No se ha obtenido la ubicación del usuario');
      return;
    }

    try {
      isLoadingPlaces.value = true;
      const { data } = await apiMapBox.get<SearchPlacesResponse>('/search/geocode/v6/forward', {
        params: {
          language: 'es',
          country: 'pe',
          limit: 10,
          q: term,
          proximity: `${userLocation.value.lng},${userLocation.value.lat}`,
        },
      });

      places.value = data.features;
      isLoadingPlaces.value = false;
    } catch (error) {
      console.log('Error al buscar lugares', error);
    }
  };

  const getRouteBetweenPoints = async (start: [number, number], end: [number, number]) => {
    try {
      const { data } = await apiMapBox.get<DirectionsResponse>(
        `/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}`,
        {
          params: {
            alternatives: false,
            continue_straight: false,
            geometries: 'geojson',
            overview: 'simplified',
            steps: false,
          },
        },
      );
      const { routes } = data;
      console.log({ routes });
    } catch (error) {
      console.log('Error al obtener la ruta', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Por favor active la ubicación en tu navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        userLocation.value = {
          lng: coords.longitude,
          lat: coords.latitude,
        };
        isLoading.value = false;
      },
      (error) => {
        console.error(error);
        throw new Error('Error al obtener la ubicación');
      },
    );
  };

  return {
    isLoading,
    isLoadingPlaces,
    mapBox,
    userLocation,
    isUserLocationReady: computed(() => !!userLocation.value),
    isMapReady: computed(() => !!mapBox.value),
    places: computed(() => places.value),
    getCurrentLocation,
    setMapBox,
    setCenterMap,
    searchPlaces,
    addMarkers,
    getRouteBetweenPoints,
  };
});
