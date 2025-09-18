import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Driver table - master data
  driver: defineTable({
    name: v.string(),
    nik: v.string(),
    handphone_number: v.string(),
  }),

  // Tickets table dengan reference ke driver
  tickets: defineTable({
    // Transport Info
    license_plate: v.string(),
    truck_type: v.string(),
    driver_id: v.id("driver"),
    principal: v.string(),

    // Document verification
    sj_available: v.boolean(),
    ktp_available: v.boolean(),
    sim_available: v.boolean(),

    // Status & Timing
    inbound_date: v.string(),
    ticket_status: v.number(),
    arrival_time: v.string(),
    start_unloading_time: v.optional(v.string()),
    finish_unloading_time: v.optional(v.string()),
    driver_departure_time: v.optional(v.string()),
  })
  .index("by_inbound_date", ["inbound_date"])
  .index("by_status", ["ticket_status"])
  .index("by_driver_id", ["driver_id"]),
});