export interface SnackOption {
  _id: string;
  unit: string;
  price: number;
}

export interface Snack {
  _id: string;
  name: string;
  description: string;
  rating: number;
  snack_img: string[];
  available?: boolean;       // optional (for SnackContext)
  category?: string;         // optional
  quantity_options: SnackOption[];
}

export interface CartItem {
  id: string;
  unit: string;
  price: number;
  qty: number;
}
export interface SelectedSnack {
  snackId: string;
  unit: string;
  quantity: number;
  price?: number;
  name?: string;
}