export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  series: string;
  customizations?: {
    ice?: string;
    sugar?: string;
    shots?: string;
    notes?: string;
  };
}