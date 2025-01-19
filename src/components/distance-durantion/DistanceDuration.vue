<template>
  <a
    v-if="distance && duration"
    href="#"
    class="fixed z-10 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 bottom-2 left-4"
  >
    <h5 class="mb-2 text-xl tracking-tight text-gray-900">Distancia: {{ distance }} Kms</h5>
    <p class="font-semibold text-gray-700">Duración: {{ duration }} Minutos</p>
  </a>
</template>

<script lang="ts" setup>
import { useMaps } from '@/composables/useMaps';

const { distance, duration } = useMaps();
</script>
