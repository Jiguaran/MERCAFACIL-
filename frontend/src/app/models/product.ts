// Para payloads (crear/actualizar)
export interface ProductI {
  id?: number;
  name: string;
  price: number;
  description: string;
  id_seller: number;
  id_category: number;
  status: "ACTIVE" | "INACTIVE";
}

// Para respuestas (obtener)
export interface ProductResponseI {
  id: number;
  name: string;
  price: number;
  description: string;
  id_seller: number;
  id_category: number;
  // Nota: Si la API incluyera los objetos completos, se añadirían aquí.
  // category?: CategoryResponseI;
  // seller?: SellerResponseI;
}