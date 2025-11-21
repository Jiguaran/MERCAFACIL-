// Para payloads (crear/actualizar)
export interface ProductTagI {
  id_product: number;
  id_tag: number;
  status: "ACTIVE" | "INACTIVE";
}

// Para respuestas (obtener)
export interface ProductTagResponseI {
  id_product: number;
  id_tag: number;
}