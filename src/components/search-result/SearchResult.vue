<template>
  <div
    v-if="isLoadingPlaces"
    class="z-5 relative flex flex-col rounded bg-white bg-clip-border shadow-3xl shadow-shadow-500 w-full p-4 max-w-sm"
  >
    <p class="text-base text-gray-700 w-full">Espere por favor...</p>
  </div>
  <div
    v-if="places.length > 0"
    class="z-5 relative flex flex-col rounded bg-white bg-clip-border shadow-3xl shadow-shadow-500 w-full p-4 max-w-sm"
  >
    <div class="w-full">
      <div
        v-for="place in places"
        :key="place.id"
        :class="[
          'flex items-center justify-between p-2 cursor-pointer',
          {
            'bg-green-600 text-white rounded': place.id === activePlace,
            'text-gray-700': place.id !== activePlace,
          },
        ]"
      >
        <div @click="handleSelectPlace(place)" class="flex items-center justify-center w-3/4">
          <p class="text-base w-full">{{ place.properties.name }}</p>
        </div>
        <div class="flex-1 flex justify-end">
          <button
            class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none rounded text-sm px-3 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            @click.self="handleDirection(place)"
          >
            Direcciones
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./SearchResult.ts"></script>
