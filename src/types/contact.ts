export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  category: 'Family' | 'Friends' | 'Work' | 'Other';
}