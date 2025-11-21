// Para payloads (crear/actualizar)
export interface CategoryI {
  id?: number;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

// Para respuestas (obtener)
export interface CategoryResponseI {
  id: number;
  name: string;
}