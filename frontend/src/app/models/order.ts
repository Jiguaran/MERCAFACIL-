// Para payloads (crear/actualizar)
export interface OrderI {
  id?: number;
  id_client: number;
  status?: "PENDING" | "PAID" | "SHIPPED";
  statuss?: "ACTIVE" | "INACTIVE"; // Ojo: "statuss" con doble 's' en tu modelo
  fecha?: Date | string;
  total: number;
}

// Para respuestas (obtener)
export interface OrderResponseI {
  id: number;
  id_client: number;
  status: "PENDING" | "PAID" | "SHIPPED";
  fecha: string; // La API suele devolver fechas como strings ISO
  total: number;
}