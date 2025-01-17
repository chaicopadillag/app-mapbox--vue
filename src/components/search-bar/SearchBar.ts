import SearchResult from '@/components/search-result/SearchResult.vue';
import { useMaps } from '@/composables/useMaps';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    SearchResult,
  },
  setup() {
    const { isMapReady } = useMaps();

    return {
      isMapReady,
    };
  },
});
