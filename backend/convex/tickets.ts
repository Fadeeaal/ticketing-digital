import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper functions tetap sama
function getWibTimeString(): string {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wib.toTimeString().slice(0, 8);
}

function getToday(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy}`;
}

// Helper function untuk create/get driver (sesuai schema baru)
async function createOrGetDriver(ctx: any, args: {
  name: string;
  nik: string;
  handphone_number: string;
}) {
  // Cek berdasarkan NIK (lebih unik dari nama)
  const existingDriver = await ctx.db
    .query("driver")
    .filter((q: any) => q.eq(q.field("nik"), args.nik))
    .first();

  if (existingDriver) {
    // Update data driver jika ada perubahan
    await ctx.db.patch(existingDriver._id, args);
    return existingDriver._id;
  } else {
    // Buat driver baru
    return await ctx.db.insert("driver", args);
  }
}

// Create ticket dengan schema baru
export const createTicket = mutation({
  args: {
    activity_type: v.boolean(), // T : inbound/ F : outbound

    // Driver info
    driver_name: v.string(),
    nik: v.string(),
    handphone_number: v.string(),
    
    // Transport info
    license_plate: v.string(),
    truck_type: v.string(),
    principal: v.optional(v.string()),
    vendor: v.optional(v.string()),

    // Document verification
    sj_available: v.boolean(),
    ktp_available: v.boolean(),
    sim_available: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Outbound harus ada vendor
    if (args.activity_type !== true) { //outbound
      if (!args.vendor) {
        throw new Error("Vendor wajib diisi untuk aktivitas outbound!");
      }
    }

    // Inbound harus ada principal
    if (args.activity_type === true) { //inbound
      if (!args.principal) {
        throw new Error("Principal wajib diisi untuk aktivitas inbound!");
      }
    }

    // SJ wajib tersedia
    if (!args.sj_available) {
      throw new Error("Surat Jalan (SJ) wajib tersedia!");
    }

    // Minimal salah satu dari KTP atau SIM harus tersedia
    if (!args.ktp_available && !args.sim_available) {
      throw new Error("Minimal salah satu dari KTP atau SIM harus tersedia!");
    }

    // Validasi NIK harus 16 digit
    if (args.nik.length !== 16 || !/^\d{16}$/.test(args.nik)) {
      throw new Error("NIK harus 16 digit angka!");
    }

    const inbound_date = getToday();
    const arrival_time = getWibTimeString();

    // Create or get driver ID
    const driverId = await createOrGetDriver(ctx, {
      name: args.driver_name,
      nik: args.nik,
      handphone_number: args.handphone_number,
    });

    // Insert ticket
    const ticketId = await ctx.db.insert("tickets", {
      // Transport info
      activity_type: args.activity_type, // true = inbound
      license_plate: args.license_plate.toUpperCase(), // Auto uppercase
      truck_type: args.truck_type,
      driver_id: driverId,
      principal: args.principal,
      vendor: args.vendor,

      // Document verification
      sj_available: args.sj_available,
      ktp_available: args.ktp_available,
      sim_available: args.sim_available,

      // Status & timing
      inbound_date,
      ticket_status: 0,
      arrival_time,
      start_unloading_time: undefined,
      finish_unloading_time: undefined,
      driver_departure_time: undefined,
    });

    // Return ticket dengan data driver
    const newTicket = await ctx.db.get(ticketId);
    const driverData = await ctx.db.get(driverId);

    return {
      ...newTicket,
      driver: driverData,
    };
  },
});

// All tickets dengan join
export const allTickets = query({
  args: {},
  handler: async (ctx) => {
    const tickets = await ctx.db.query("tickets").collect();

    const ticketsWithDriver = await Promise.all(
      tickets.map(async (ticket) => {
        const driver = await ctx.db.get(ticket.driver_id);
        return {
          ...ticket,
          driver: driver,
        };
      })
    );

    return ticketsWithDriver;
  },
});

// Tambahkan function baru untuk mencari berdasarkan tanggal spesifik
export const listTodayTickets = query({
  args: {},
  handler: async (ctx) => {
    const todayStr = getToday();
    
    const tickets = await ctx.db
      .query("tickets")
      .filter(q => q.eq(q.field("inbound_date"), todayStr))
      .collect();

    // Join dengan data driver
    const ticketsWithDriver = await Promise.all(
      tickets.map(async (ticket) => {
        const driver = await ctx.db.get(ticket.driver_id);
        return {
          ...ticket,
          driver: driver,
        };
      })
    );

    return ticketsWithDriver;
  },
});

// Tambahkan function baru untuk mencari berdasarkan tanggal spesifik
export const getTicketsByDate = query({
  args: { date: v.string() }, // Format: DDMMYYYY
  handler: async (ctx, args) => {
    // Konversi DDMMYYYY ke DD-MM-YYYY
    const dateStr = args.date;
    if (dateStr.length !== 8) {
      throw new Error("Format tanggal harus DDMMYYYY (contoh: 28012005)");
    }
    
    const dd = dateStr.slice(0, 2);
    const mm = dateStr.slice(2, 4);
    const yyyy = dateStr.slice(4, 8);
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    
    const tickets = await ctx.db
      .query("tickets")
      .filter((q: any) => q.eq(q.field("inbound_date"), formattedDate))
      .collect();

    // Join dengan data driver
    const ticketsWithDriver = await Promise.all(
      tickets.map(async (ticket) => {
        const driver = await ctx.db.get(ticket.driver_id);
        return {
          ...ticket,
          driver: driver,
        };
      })
    );

    return ticketsWithDriver;
  },
});

/*-----------------------------------------------------------------------------------------------------*/
/* Set Start Unloading, Finish Unloading, Driver Departure */
export const setStartUnloadingTime = mutation({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket tidak ditemukan!");

    await ctx.db.patch(args.ticketId, { 
      ticket_status: 1, 
      start_unloading_time: getWibTimeString() 
    });

    const updatedTicket = await ctx.db.get(args.ticketId);
    const driver = await ctx.db.get(ticket.driver_id);
    
    return {
      ...updatedTicket,
      driver: driver,
    };
  },
});

export const setFinishUnloadingTime = mutation({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket tidak ditemukan!");
    if (!ticket.start_unloading_time) throw new Error("Unloading belum dimulai!");

    await ctx.db.patch(args.ticketId, { 
      ticket_status: 2, 
      finish_unloading_time: getWibTimeString() 
    });

    const updatedTicket = await ctx.db.get(args.ticketId);
    const driver = await ctx.db.get(ticket.driver_id);
    
    return {
      ...updatedTicket,
      driver: driver,
    };
  },
});

export const setDriverDepartureTime = mutation({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket tidak ditemukan!");
    if (!ticket.finish_unloading_time) throw new Error("Unloading belum selesai!");

    await ctx.db.patch(args.ticketId, { 
      ticket_status: 3, 
      driver_departure_time: getWibTimeString() 
    });

    const updatedTicket = await ctx.db.get(args.ticketId);
    const driver = await ctx.db.get(ticket.driver_id);
    
    return {
      ...updatedTicket,
      driver: driver,
    };
  },
});