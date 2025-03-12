export interface ISighting {
  id: number;
  witnessName: string;
  location: ILocation;
  description: string;
  picture: string;
  status: string;
  dateTime: string;
  witnessContact: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}
