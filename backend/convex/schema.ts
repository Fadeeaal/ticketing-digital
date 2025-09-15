import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Add your tickets table
  tickets: defineTable({
    // Driver & Vehicle
    driver_name: v.string(),
    license_plate: v.string(),
    truck: v.string(),
    handphone_number: v.string(),
    principal: v.string(),

    //Status & Timing
    inbound_date: v.string(),
    ticket_status: v.number(),
    arrival_time: v.string(),
    start_unloading_time: v.optional(v.string()),
    finish_unloading_time: v.optional(v.string()),
    driver_departure_time: v.optional(v.string()),
  })
  .index("by_inbound_date", ["inbound_date"])
  .index("by_status", ["ticket_status"]),
});