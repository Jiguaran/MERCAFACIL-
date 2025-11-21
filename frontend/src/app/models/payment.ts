// Para payloads (crear/actualizar)
export interface PaymentI {
  id?: number;
  id_order: number;
  method: string;
  amount: number;
  status?: "ACTIVE" | "INACTIVE";
  payment_date?: Date | string;
}

// Para respuestas (obtener)
export interface PaymentResponseI {
  id: number;
  id_order: number;
  method: string;
  amount: number;
  payment_date: string; // La API suele devolver fechas como strings ISO
}