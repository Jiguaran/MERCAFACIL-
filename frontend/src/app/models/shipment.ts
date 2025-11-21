// Para payloads (crear/actualizar)
export interface ShipmentI {
  id?: number;
  id_order: number;
  tracking_number: string;
  status?: "ACTIVE" | "INACTIVE";
  fecha_envio?: Date | string;
}

// Para respuestas (obtener)
export interface ShipmentResponseI {
  id: number;
  id_order: number;
  tracking_number: string;
  fecha_envio: string; // La API suele devolver fechas como strings ISO
}