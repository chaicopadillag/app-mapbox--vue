import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { MapCoordinates } from './types/maps-store.type';

export const useMapsStore = defineStore('maps', () => {
  const isLoading = ref(true);
  const userLocation = ref<MapCoordinates>();
  const places = ref([]);

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
    isLoading: computed(() => isLoading.value),
    places: computed(() => places.value),
    userLocation: computed(() => userLocation.value),
    isUserLocationReady: computed(() => !!userLocation.value),

    getCurrentLocation,
  };
});
