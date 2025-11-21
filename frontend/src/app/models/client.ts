export interface ClientI {
  id?: number;
  name: string;
  code: string;
  address: string;
  email: string;
  password: string;
  status: "ACTIVE" | "INACTIVE";
}


export interface ClientResponseI {
  id?: number;
  name: string;
  code: string;
  address: string;
  email: string;
}