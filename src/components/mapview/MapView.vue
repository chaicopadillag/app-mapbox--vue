<template>
  <LocationButton v-if="isMapReady && isUserLocationReady" />
  <div ref="mapDivElement" class="w-full h-screen"></div>
  <SearchBar />
</template>

<script lang="ts" src="./MapView.ts"></script>
