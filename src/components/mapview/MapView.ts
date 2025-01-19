import DistanceDuration from '@/components/distance-durantion/DistanceDuration.vue';
import LocationButton from '@/components/location-button/LocationButton.vue';
import SearchBar from '@/components/search-bar/SearchBar.vue';
import { useMaps } from '@/composables/useMaps';
import Mapboxgl from 'mapbox-gl';
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'MapView',
  components: {
    LocationButton,
    SearchBar,
    DistanceDuration,
  },
  setup() {
    const { isLoading, places, userLocation, isUserLocationReady, isMapReady, setMapBox } =
      useMaps();
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

      const markerPopup = new Mapboxgl.Popup()
        .setLngLat([userLocation.value.lng, userLocation.value.lat])
        .setHTML(`<h2>Estoy aquí</h2><p>Actualmente en Perú</p>`);

      const markerLocation = new Mapboxgl.Marker()
        .setLngLat([userLocation.value.lng, userLocation.value.lat])
        .setPopup(markerPopup)
        .addTo(map);

      setMapBox(map);
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
      isMapReady,
      isUserLocationReady,
      places,
      userLocation,
      mapDivElement,
    };
  },
});
