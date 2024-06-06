import { Item } from './item';

export interface Order {
  orderId?: number;
  name: string;
  email: string;
  phone?: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  paymentMethod: string;
  items: Item[];
}
