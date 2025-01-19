export type SearchPlacesResponse = {
  type: string;
  features: Feature[];
  attribution: string;
};

export type Feature = {
  type: string;
  id: string;
  geometry: Geometry;
  properties: Properties;
};

export type Geometry = {
  type: string;
  coordinates: number[];
};

export type Properties = {
  mapbox_id: string;
  feature_type: string;
  full_address: string;
  name: string;
  name_preferred: string;
  coordinates: Coordinates;
  place_formatted: string;
  context: Context;
};

export type Context = {
  street: Postcode;
  postcode: Postcode;
  place: Place;
  region: Region;
  country: Country;
};

export type Country = {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
  country_code: string;
  country_code_alpha_3: string;
  translations: Translations;
};

export type Translations = {
  es: Es;
};

export type Es = {
  language: string;
  name: string;
};

export type Place = {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
  translations: Translations;
};

export type Postcode = {
  mapbox_id: string;
  name: string;
};

export type Region = {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
  region_code: string;
  region_code_full: string;
  translations: Translations;
};

export type Coordinates = {
  longitude: number;
  latitude: number;
};
