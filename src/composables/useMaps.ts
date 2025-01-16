import { useMapsStore } from '@/store/maps.store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

export const useMaps = () => {
  const store = useMapsStore();
  const { isLoading, places, userLocation, isUserLocationReady } = storeToRefs(store);

  onMounted(() => {
    if (!isUserLocationReady.value) {
      store.getCurrentLocation();
    }
  });

  return {
    isLoading,
    places,
    userLocation,
    isUserLocationReady,
  };
};
