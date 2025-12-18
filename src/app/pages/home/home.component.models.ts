export interface Icategory{
  id: number,
  title: string,
  imgUrl: string,
  hover: string
}

export interface Icompany{
  id:number,
  imgUrl : string
}
export interface CarModel {
  id: number;
  model: string;
}

export interface GovernorateGroup {
  name: string;
  count: number;
  commonLocations: string[];
}


// interface GovernorateGroup {
//   name: string;
//   count: number;
//   commonLocations: string[];
// }
