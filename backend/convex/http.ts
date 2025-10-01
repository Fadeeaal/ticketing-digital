import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// CORS headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight requests
http.route({
  path: "/api/*",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }),
});

// Get today's tickets
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
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Get All tickets
http.route({
  path: "/api/tickets/all",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const result = await ctx.runQuery(api.tickets.allTickets, {});
      return new Response(JSON.stringify({ 
        success: true, 
        data: result 
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Get tickets by status
http.route({
  pathPrefix: "/api/tickets/status/",
  method: "GET", 
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const status = url.pathname.replace("/api/tickets/status/", "");
      
      if (!status || isNaN(Number(status))) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Valid status parameter (0, 1, 2, 3) is required" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const statusNumber = Number(status);
      
      // Validasi status hanya 0, 1, 2, 3
      if (![0, 1, 2, 3].includes(statusNumber)) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Status must be 0, 1, 2, or 3" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const result = await ctx.runQuery(api.tickets.listTicketsByStatus, { 
        status: statusNumber 
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: result,
        count: result.length,
        status: statusNumber
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Get tickets by status and date (keduanya di URL)
http.route({
  pathPrefix: "/api/tickets/status-date/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const pathAfterPrefix = url.pathname.replace("/api/tickets/status-date/", "");
      
      // Format: status/date (contoh: 1/28012025)
      const pathParts = pathAfterPrefix.split("/");
      
      if (pathParts.length !== 2) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "URL format should be: /api/tickets/status-date/{status}/{date}" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const [statusStr, date] = pathParts;

      // Validasi status
      if (!statusStr || isNaN(Number(statusStr))) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Valid status parameter (0, 1, 2, 3) is required" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const statusNumber = Number(statusStr);
      
      if (![0, 1, 2, 3].includes(statusNumber)) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Status must be 0, 1, 2, or 3" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      // Validasi date
      if (!date) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Date parameter is required (format: DDMMYYYY)" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      if (date.length !== 8 || !/^\d{8}$/.test(date)) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Date must be in DDMMYYYY format (example: 28012025)" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const result = await ctx.runQuery(api.tickets.listTicketsByStatusAndDate, { 
        status: statusNumber,
        date: date 
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: result,
        count: result.length,
        status: statusNumber,
        date: date
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Create new ticket
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
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Start unloading
http.route({
  pathPrefix: "/api/tickets/start-unloading/",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const ticketId = url.pathname.replace("/api/tickets/start-unloading/", "");
      
      if (!ticketId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const result = await ctx.runMutation(api.tickets.setStartUnloadingTime, {
        ticketId: ticketId as any
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Waktu mulai unloading berhasil diset",
        ticketId: ticketId,
        status: result.ticket_status,
        timestamp : result.start_unloading_time
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Finish unloading
http.route({
  pathPrefix: "/api/tickets/finish-unloading/",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const ticketId = url.pathname.replace("/api/tickets/finish-unloading/", "");
      
      if (!ticketId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }
      
      const result = await ctx.runMutation(api.tickets.setFinishUnloadingTime, {
        ticketId: ticketId as any
      });

      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Waktu selesai unloading berhasil diset",
        ticketId: ticketId,
        status: result.ticket_status,
        timestamp : result.finish_unloading_time
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Driver departure
http.route({
  pathPrefix: "/api/tickets/driver-departure/",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const ticketId = url.pathname.replace("/api/tickets/driver-departure/", "");
      
      if (!ticketId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }
      
      const result = await ctx.runMutation(api.tickets.setDriverDepartureTime, {
        ticketId: ticketId as any
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Waktu kepergian driver berhasil diset",
        ticketId: ticketId,
        status: result.ticket_status,
        timestamp : result.departure_time
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Update/Edit ticket
http.route({
  pathPrefix: "/api/tickets/update/",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const ticketId = url.pathname.replace("/api/tickets/update/", "");
      
      if (!ticketId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const body = await request.json();
      
      // Tambahkan ticketId ke body untuk mutation
      const mutationArgs = {
        ...body,
        ticketId: ticketId as any
      };

      const result = await ctx.runMutation(api.tickets.updateTicket, mutationArgs);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: result,
        message: "Ticket berhasil diupdate"
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

// Get ticket by ID
http.route({
  pathPrefix: "/api/tickets/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      // Skip jika ini adalah route lain seperti /api/tickets/today atau /api/tickets/all
      if (path === "/api/tickets/today" || path === "/api/tickets/all") {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Route not found" 
        }), {
          status: 404,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }
      
      // Extract ticketId dari path
      const ticketId = path.replace("/api/tickets/", "");
      
      if (!ticketId || ticketId.includes('/')) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "ticketId parameter is required" 
        }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        });
      }

      const result = await ctx.runQuery(api.tickets.getTicketById, { 
        ticketId: ticketId as any 
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: result 
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      });
    }
  }),
});

http.route({
  path: "/api/principals",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const principals = await ctx.runQuery(api.principal.getAll); // Memanggil fungsi yang baru kita buat
    return new Response(JSON.stringify(principals), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }),
});

http.route({
  path: "/api/vehicles",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const vehicles = await ctx.runQuery(api.vehicle.getAll); // Memanggil fungsi yang baru kita buat
    return new Response(JSON.stringify(vehicles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }),
});

http.route({
  path: "/api/vendors",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const vendor = await ctx.runQuery(api.vendor.getAll); // Memanggil fungsi yang baru kita buat
    return new Response(JSON.stringify(vendor), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }),
});

export default http;