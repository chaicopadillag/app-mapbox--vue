import { useMapsStore } from '@/store/maps.store';
import { onMounted } from 'vue';

export const useMaps = () => {
  const store = useMapsStore();

  onMounted(() => {
    if (!store.isUserLocationReady) {
      store.getCurrentLocation();
    }
  });

  return {};
};
