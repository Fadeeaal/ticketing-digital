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

/*-----------------------------------------------------------------------------------------------------*/

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

    // Inbound minimal harus ada 1 principal / vendor
    if (args.activity_type === true) { //inbound
      if (!args.principal && !args.vendor) {
        throw new Error("Principal atau vendor wajib diisi untuk aktivitas inbound!");
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

    const arrival_date = getToday();
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
      arrival_date,
      ticket_status: 0,
      arrival_time,
      start_unloading_time: undefined,
      finish_unloading_time: undefined,
      departure_time: undefined,
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
      .filter(q => q.eq(q.field("arrival_date"), todayStr))
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
      .filter((q: any) => q.eq(q.field("arrival_date"), formattedDate))
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

export const updateTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    
    // Driver info
    driver_name: v.optional(v.string()),
    nik: v.optional(v.string()),
    handphone_number: v.optional(v.string()),
    
    // Transport info
    license_plate: v.optional(v.string()),
    truck_type: v.optional(v.string()),
    principal: v.optional(v.string()),
    vendor: v.optional(v.string()),

    // Document verification
    sj_available: v.optional(v.boolean()),
    ktp_available: v.optional(v.boolean()),
    sim_available: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Cari ticket yang akan diupdate
    const existingTicket = await ctx.db.get(args.ticketId);
    if (!existingTicket) {
      throw new Error("Ticket tidak ditemukan!");
    }

    if (existingTicket.ticket_status > 0) {
      throw new Error("Ticket sudah dalam proses, tidak bisa diupdate!");
    }

    // Validasi NIK jika diubah
    if (args.nik && (args.nik.length !== 16 || !/^\d{16}$/.test(args.nik))) {
      throw new Error("NIK harus 16 digit angka!");
    }

    // Validasi document requirements jika diubah
    const sjAvailable = args.sj_available ?? existingTicket.sj_available;
    const ktpAvailable = args.ktp_available ?? existingTicket.ktp_available;
    const simAvailable = args.sim_available ?? existingTicket.sim_available;

    if (!sjAvailable) {
      throw new Error("Surat Jalan (SJ) wajib tersedia!");
    }

    if (!ktpAvailable && !simAvailable) {
      throw new Error("Minimal salah satu dari KTP atau SIM harus tersedia!");
    }

    // Validasi principal/vendor berdasarkan activity_type
    if (existingTicket.activity_type === true) { // inbound
      const principal = args.principal ?? existingTicket.principal;
      if (!principal) {
        throw new Error("Principal wajib diisi untuk aktivitas inbound!");
      }
    } else { // outbound
      const vendor = args.vendor ?? existingTicket.vendor;
      if (!vendor) {
        throw new Error("Vendor wajib diisi untuk aktivitas outbound!");
      }
    }

    let driverId = existingTicket.driver_id;

    // Update driver info jika ada perubahan pada data driver
    if (args.driver_name || args.nik || args.handphone_number) {
      // Ambil data driver saat ini
      const currentDriver = await ctx.db.get(existingTicket.driver_id);
      if (!currentDriver) {
        throw new Error("Data driver tidak ditemukan!");
      }

      const updatedDriverData = {
        name: args.driver_name || currentDriver.name,
        nik: args.nik || currentDriver.nik,
        handphone_number: args.handphone_number || currentDriver.handphone_number,
      };

      // Jika NIK berubah, cari driver dengan NIK baru atau buat baru
      if (args.nik && args.nik !== currentDriver.nik) {
        driverId = await createOrGetDriver(ctx, updatedDriverData);
      } else {
        // Update driver yang sudah ada
        await ctx.db.patch(existingTicket.driver_id, updatedDriverData);
      }
    }

    // Prepare update data untuk ticket
    const updateData: any = {};

    if (args.license_plate !== undefined) {
      updateData.license_plate = args.license_plate.toUpperCase();
    }
    if (args.truck_type !== undefined) {
      updateData.truck_type = args.truck_type;
    }
    if (args.principal !== undefined) {
      updateData.principal = args.principal;
    }
    if (args.vendor !== undefined) {
      updateData.vendor = args.vendor;
    }
    if (args.sj_available !== undefined) {
      updateData.sj_available = args.sj_available;
    }
    if (args.ktp_available !== undefined) {
      updateData.ktp_available = args.ktp_available;
    }
    if (args.sim_available !== undefined) {
      updateData.sim_available = args.sim_available;
    }
    
    // Update driver_id jika berubah
    if (driverId !== existingTicket.driver_id) {
      updateData.driver_id = driverId;
    }

    // Update ticket
    await ctx.db.patch(args.ticketId, updateData);

    // Return updated ticket dengan driver data
    const updatedTicket = await ctx.db.get(args.ticketId);
    const driverData = await ctx.db.get(driverId);

    return {
      ...updatedTicket,
      driver: driverData,
    };
  },
});

export const getTicketById = query({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket tidak ditemukan!");
    }

    const driver = await ctx.db.get(ticket.driver_id);
    
    return {
      ...ticket,
      driver: driver,
    };
  },
});

/*-----------------------------------------------------------------------------------------------------*/
/* Set Start Unloading, Finish Unloading, Driver Departure */
export const setStartUnloadingTime = mutation({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket tidak ditemukan!");

    if (ticket.ticket_status !== 0) {
      throw new Error("Ticket sudah melewati proses ini!");
    }

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
    if (ticket.ticket_status !== 1) throw new Error("Unloading belum dimulai atau sudah selesai!");

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
    if (ticket.ticket_status !== 2) throw new Error("Unloading belum selesai atau driver sudah berangkat!");

    await ctx.db.patch(args.ticketId, { 
      ticket_status: 3, 
      departure_time: getWibTimeString() 
    });

    const updatedTicket = await ctx.db.get(args.ticketId);
    const driver = await ctx.db.get(ticket.driver_id);
    
    return {
      ...updatedTicket,
      driver: driver,
    };
  },
});