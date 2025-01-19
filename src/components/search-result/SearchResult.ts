/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMaps } from '@/composables/useMaps';
import type { Feature } from '@/store/types/search-places.type';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'SearchResult',
  setup() {
    const { places, isLoadingPlaces, mapBox, addMarkers, getRouteBetweenPoints, userLocation } =
      useMaps();
    const activePlace = ref<string>();

    watch(places, (newPlaces) => {
      addMarkers(newPlaces);
    });

    const handleSelectPlace = (place: Feature) => {
      activePlace.value = place.id;
      mapBox.value?.flyTo({
        center: place.geometry.coordinates as any,
        zoom: 16,
        essential: true,
      });
    };

    const handleDirection = (place: Feature) => {
      const start: [number, number] = [userLocation.value!.lng, userLocation.value!.lat];
      getRouteBetweenPoints(start, place.geometry.coordinates as any);
    };

    return {
      places,
      isLoadingPlaces,
      activePlace,
      handleSelectPlace,
      handleDirection,
    };
  },
});
