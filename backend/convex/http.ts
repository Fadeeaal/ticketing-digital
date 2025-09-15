import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// 1. Create new ticket
http.route({
  path: "/api/create-ticket",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const result = await ctx.runMutation(api.tickets.createTicket, body);
      return new Response(JSON.stringify({ 
        success: true, 
        data: result 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// 2. Get today's tickets
http.route({
  path: "/api/tickets/today",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const result = await ctx.runQuery(api.tickets.listTodayTickets, {});
      return new Response(JSON.stringify({ 
        success: true, 
        data: result 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// 3. Start unloading
http.route({
  path: "/api/tickets/start-unloading",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const ticketId = url.searchParams.get('ticketId');
      
      if (!ticketId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      await ctx.runMutation(api.tickets.setStartUnloadingTime, { 
        ticketId: ticketId as any
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Waktu mulai unloading berhasil diset",
        ticketId: ticketId,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// 4. Finish unloading
http.route({
  path: "/api/tickets/finish-unloading",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const ticketId = url.searchParams.get('ticketId');
      
      if (!ticketId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      await ctx.runMutation(api.tickets.setFinishUnloadingTime, { 
        ticketId: ticketId as any
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Waktu selesai unloading berhasil diset",
        ticketId: ticketId
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// 5. Driver departure
http.route({
  path: "/api/tickets/driver-departure",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const ticketId = url.searchParams.get('ticketId');
      
      if (!ticketId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      await ctx.runMutation(api.tickets.setDriverDepartureTime, { 
        ticketId: ticketId as any
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Waktu keberangkatan driver berhasil diset",
        ticketId: ticketId
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

export default http;