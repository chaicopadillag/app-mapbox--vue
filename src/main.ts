import 'mapbox-gl/dist/mapbox-gl.css';
import './assets/main.css';

import mapboxgl from 'mapbox-gl';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

if (!navigator.geolocation) {
  alert('Geolocation is not supported by your browser');
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
