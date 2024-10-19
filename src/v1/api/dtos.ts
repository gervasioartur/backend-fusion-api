export type response = {
  status: number
  message: string
  body?: string
}

export type createPlanetRequest = {
  name: string;
  climate: string;
  terrain: string;
  population?: number;
};
