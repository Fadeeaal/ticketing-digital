import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Change to GMT+7
function getWibTimeString(): string {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wib.toTimeString().slice(0, 8);
}

// Get Today Date
function getToday(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy}`;
}

// All tickets list
export const allTickets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tickets")
      .collect();
  },
});

// Today tickets list
export const listTodayTickets = query({
  args: {},
  handler: async (ctx) => {
    const todayStr = getToday();
    return await ctx.db
      .query("tickets")
      .filter(q => q.eq(q.field("inbound_date"), todayStr))
      .collect();
  },
});

// Create new ticket
export const createTicket = mutation({
  args: {
    driver_name: v.string(),
    license_plate: v.string(),
    truck: v.string(),
    handphone_number: v.string(),
    principal: v.string(),
  },
  handler: async (ctx, args) => {
    const inbound_date = getToday();
    const arrival_time = getWibTimeString();

    // Insert ticket dan dapatkan ID
    const ticketId = await ctx.db.insert("tickets", {
      ...args,
      inbound_date,
      ticket_status: 0,
      arrival_time,
      start_unloading_time: undefined,
      finish_unloading_time: undefined,
      driver_departure_time: undefined,
    });

    // Ambil data lengkap ticket yang baru dibuat
    const newTicket = await ctx.db.get(ticketId);
    return newTicket;
  },
});

// Update jam start unloading
export const setStartUnloadingTime = mutation({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
      if (!ticket) throw new Error("Ticket tidak ditemukan!");

    await ctx.db.patch(args.ticketId, { ticket_status: 1, start_unloading_time: getWibTimeString() });
  },
});

// Update jam selesai unloading
export const setFinishUnloadingTime = mutation({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
      if (!ticket) throw new Error("Ticket tidak ditemukan!");
      if (!ticket.start_unloading_time) throw new Error("Unloading belum dimulai!");

    await ctx.db.patch(args.ticketId, { ticket_status: 2, finish_unloading_time: getWibTimeString() });
  },
});

// Update jam driver pergi
export const setDriverDepartureTime = mutation({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
      if (!ticket) throw new Error("Ticket tidak ditemukan!");
      if (!ticket.finish_unloading_time) throw new Error("Unloading belum selesai!");
      
    await ctx.db.patch(args.ticketId, { ticket_status: 3, driver_departure_time: getWibTimeString() });
  },
});