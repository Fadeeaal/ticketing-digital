export interface Ticket {
  _id?: string;
  title: string;
  description: string;
  price: number;
  status?: string;
  eventDate: string;
}
