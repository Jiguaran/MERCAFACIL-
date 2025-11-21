// Para payloads (crear/actualizar)
export interface TagI {
  id?: number;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

// Para respuestas (obtener)
export interface TagResponseI {
  id: number;
  name: string;
}