export interface Driver {
  _id: string;
  name: string;
  nik: string;
  handphone_number: string;
}

export interface Ticket {
  _id: string;
  _creationTime: number;
  activity_type: boolean; // T : inbound / F : outbound
  license_plate: string;
  truck_type: string;
  driver_id: string;
  principal: string;
  vendor: string;
  sj_available: boolean;
  ktp_available: boolean;
  sim_available: boolean;
  inbound_date: string;
  ticket_status: number;
  arrival_time: string;
  start_unloading_time?: string;    // Optional fields
  finish_unloading_time?: string;   // Optional fields
  departure_time?: string;   // Optional fields
  driver: Driver;                   // Joined driver data
}