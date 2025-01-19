import SearchResult from '@/components/search-result/SearchResult.vue';
import { useMaps } from '@/composables/useMaps';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    SearchResult,
  },
  setup() {
    const { isMapReady, searchPlaces } = useMaps();

    const debounceTimeOut = ref();
    const searchTerm = ref('');

    const inputSearch = computed({
      get: () => searchTerm.value,
      set: (value) => {
        if (debounceTimeOut.value) clearTimeout(debounceTimeOut.value);

        debounceTimeOut.value = setTimeout(() => {
          searchTerm.value = value;
          searchPlaces(searchTerm.value);
        }, 500);
      },
    });

    const handleSearch = () => {
      if (searchTerm.value.length > 3) {
        searchPlaces(searchTerm.value);
      }
    };

    return {
      isMapReady,
      inputSearch,
      handleSearch,
    };
  },
});
