/* eslint-disable @typescript-eslint/no-explicit-any */
export type DirectionsResponse = {
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
};

export type Route = {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: Leg[];
  geometry: Geometry;
};

export type Geometry = {
  coordinates: Array<number[]>;
  type: string;
};

export type Leg = {
  via_waypoints: any[];
  admins: Admin[];
  weight: number;
  duration: number;
  sirns: object;
  steps: any[];
  distance: number;
  summary: string;
};

export type Admin = {
  iso_3166_1_alpha3: string;
  iso_3166_1: string;
};

export type Waypoint = {
  distance: number;
  name: string;
  location: number[];
};
