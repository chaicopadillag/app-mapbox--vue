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
  const duration = ref<number>();
  const distance = ref<number>();
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

    if (mapBox.value.getLayer('route')) {
      mapBox.value.removeLayer('route');
      mapBox.value.removeSource('route');
      duration.value = undefined;
      distance.value = undefined;
    }
  };

  const calculateDurationDistance = (distanceInMts: number, duractionInSeconds: number) => {
    let kms = distanceInMts / 1000;
    kms = Math.round(kms * 100) / 100;
    distance.value = kms;

    duration.value = Math.floor(duractionInSeconds / 60);
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
      const { geometry } = routes[0];
      createPolilyne(geometry.coordinates as [number, number][]);
      calculateDurationDistance(routes[0].distance, routes[0].duration);
    } catch (error) {
      console.log('Error al obtener la ruta', error);
    }
  };

  const createPolilyne = (coordinates: [number, number][]) => {
    if (!mapBox.value) {
      console.error('No se ha inicializado el mapa');
      return;
    }

    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];

    const bounds = new mapboxgl.LngLatBounds([start[0], start[1]], [start[0], start[1]]);

    coordinates.forEach((coord) => {
      bounds.extend([coord[0], coord[1]]);
    });

    mapBox.value.fitBounds(bounds, {
      padding: 100,
    });

    const sourceData: mapboxgl.SourceSpecification = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        ],
      },
    };

    const layerData: mapboxgl.Layer = {
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
      },
    };

    if (mapBox.value.getLayer('route')) {
      mapBox.value.removeLayer('route');
      mapBox.value.removeSource('route');
    }

    mapBox.value.addSource('route', sourceData);
    mapBox.value.addLayer(layerData);
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
    distance: computed(() => distance.value),
    duration: computed(() => duration.value),
    getCurrentLocation,
    setMapBox,
    setCenterMap,
    searchPlaces,
    addMarkers,
    getRouteBetweenPoints,
  };
});
