<template>
  <div v-if="!isUserLocationReady" class="flex flex-col items-center justify-center h-screen">
    <SpinnerSquare />
    <p class="mt-4 text-lg font-semibold title">Loading...</p>
  </div>

  <MapView v-show="isUserLocationReady" />
</template>
<script lang="ts" setup>
import MapView from '@/components/mapview/MapView.vue';
import { useMaps } from '@/composables/useMaps';
import SpinnerSquare from '@/icons/SpinnerSquare.vue';

const { isUserLocationReady } = useMaps();
</script>

<style scoped>
.title {
  color: #34495e;
}
</style>
