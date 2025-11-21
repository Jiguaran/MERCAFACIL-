// Para payloads (crear/actualizar)
export interface SellerI {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string; // Es opcional al crear/actualizar
  status: "ACTIVE" | "INACTIVE";
}

// Para respuestas (obtener)
export interface SellerResponseI {
  id: number;
  name: string;
  email: string;
  phone: string;
}