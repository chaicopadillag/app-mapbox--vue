import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { MapCoordinates } from './types/maps-store.type';

export const useMapsStore = defineStore('maps', () => {
  const isLoading = ref(true);
  const userLocation = ref<MapCoordinates>();
  const mapBox = ref<mapboxgl.Map>();
  const places = ref([]);

  const setMapBox = (map: mapboxgl.Map) => {
    mapBox.value = map;
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
    mapBox,
    places,
    userLocation,
    isUserLocationReady: computed(() => !!userLocation.value),
    isMapReady: computed(() => !!mapBox.value),
    getCurrentLocation,
    setMapBox,
  };
});
