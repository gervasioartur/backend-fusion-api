export type response = {
  status: number
  message: string
  body?: any
}

export type createPlanetRequest = {
  name: string;
  climate: string;
  terrain: string;
  population?: number;
};

export type updatePlanetRequest = {
  name: string;
  climate: string;
  terrain: string;
  population?: number;
};