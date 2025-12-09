export interface FoodItem {
  id: number;
  comboId?: number
  name: string;
  description: string;
  price: number;
  series?: string;
  customizations?: {
    ice?: string;
    sugar?: string;
    shots?: string;
    size?: string;
    notes?: string;
  };
  isFree?: boolean;  
}