export interface TicketFormData {
  activity_type: boolean; // T : inbound / F : outbound
  driver_name: string;
  nik: string;
  handphone_number: string;
  license_plate: string;
  truck_type: string;
  principal: string;
  vendor: string;
  sj_available: boolean;
  ktp_available: boolean;
  sim_available: boolean;
}