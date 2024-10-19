export type response = {
  status: number
  message: string
  body?: object
}

export type createPlanetRequest = {
  name: string;
  climate: string;
  terrain: string;
  population?: number;
};
