import axios from 'axios';

const apiMapBox = axios.create({
  baseURL: 'https://api.mapbox.com',
  params: {
    access_token: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
  },
});

export { apiMapBox };
