// Para payloads (crear/actualizar)
export interface OrderDetailI {
  id?: number;
  id_order: number;
  id_product: number;
  quantity: number;
  price: number;
  status: "ACTIVE" | "INACTIVE";
}

// Para respuestas (obtener)
// Este modelo no tiene un 'id' simple, se identifica por la combinación
export interface OrderDetailResponseI {
  id: number;
  id_order: number;
  id_product: number;
  quantity: number;
  price: number;
}