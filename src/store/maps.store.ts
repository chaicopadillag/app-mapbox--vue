import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMapsStore = defineStore('maps', () => {
  const isLoading = ref(true);
  const userLocation = ref<[number, number]>([0, 0]);
  const places = ref([]);

  return {
    isLoading,
    userLocation,
    places,
  };
});
