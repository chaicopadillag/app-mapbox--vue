import { useMaps } from '@/composables/useMaps';
import Mapboxgl from 'mapbox-gl';
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'MapView',
  setup() {
    const { isLoading, places, userLocation, isUserLocationReady } = useMaps();
    const mapDivElement = ref<HTMLDivElement>();

    const initMap = async () => {
      if (mapDivElement.value === undefined) return;
      if (!userLocation.value) return;

      await Promise.resolve();

      const map = new Mapboxgl.Map({
        container: mapDivElement.value,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [userLocation.value.lng, userLocation.value.lat],
        zoom: 15,
      });
    };

    onMounted(() => {
      if (!isUserLocationReady.value) return initMap();
    });

    watch(isUserLocationReady, () => {
      if (isUserLocationReady.value) {
        initMap();
      }
    });

    return {
      isLoading,
      places,
      userLocation,
      mapDivElement,
    };
  },
});
