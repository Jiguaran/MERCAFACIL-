// Para payloads (crear/actualizar)
export interface ReviewI {
  id?: number;
  id_product: number;
  id_client: number;
  rating: number;
  comment: string;
  status: "ACTIVE" | "INACTIVE";
}

// Para respuestas (obtener)
export interface ReviewResponseI {
  id: number;
  id_product: number;
  id_client: number;
  rating: number;
  comment: string;
}