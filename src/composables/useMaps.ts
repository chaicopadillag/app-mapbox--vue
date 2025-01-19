import { useMapsStore } from '@/store/maps.store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

export const useMaps = () => {
  const store = useMapsStore();
  const {
    isLoading,
    places,
    mapBox,
    userLocation,
    isUserLocationReady,
    isMapReady,
    isLoadingPlaces,
  } = storeToRefs(store);

  onMounted(() => {
    if (!isUserLocationReady.value) {
      store.getCurrentLocation();
    }
  });

  return {
    isLoading,
    isLoadingPlaces,
    userLocation,
    isUserLocationReady,
    isMapReady,
    setMapBox: store.setMapBox,
    setCenterMap: store.setCenterMap,
    searchPlaces: store.searchPlaces,
    places,
    mapBox,
    addMarkers: store.addMarkers,
    getRouteBetweenPoints: store.getRouteBetweenPoints,
  };
};
