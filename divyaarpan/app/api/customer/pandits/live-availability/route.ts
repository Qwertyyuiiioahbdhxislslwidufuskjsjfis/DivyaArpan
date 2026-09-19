import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function corsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");

  const allowedOrigins = new Set([
    "https://probable-engine-56gj6xwj4w437pg9-8081.app.github.dev",
    "https://probable-engine-56gj6xwj4w437pg9-8082.app.github.dev",
    "http://localhost:8081",
    "http://localhost:8082",
  ]);

  const allowedOrigin =
    origin && allowedOrigins.has(origin)
      ? origin
      : null;

  return {
    ...(allowedOrigin
      ? {
          "Access-Control-Allow-Origin":
            allowedOrigin,
        }
      : {}),
    "Access-Control-Allow-Methods":
      "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Accept, Cache-Control",
    "Vary": "Origin",
  };
}

export async function OPTIONS(
  request: NextRequest
) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

/**
 * Public customer-facing Pandit availability summary.
 *
 * This endpoint intentionally returns aggregate counts only.
 * It does NOT expose Pandit identity, contact information,
 * coordinates, documents, or other private information.
 *
 * Home definition of "available now":
 * - VERIFIED
 * - active
 * - online
 * - accepts immediate bookings
 * - serves the requested city
 *
 * Optional service/language filters make the count more specific.
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const city =
      searchParams.get("city")?.trim() || "";

    const service =
      searchParams.get("service")?.trim() || "";

    const language =
      searchParams.get("language")?.trim() || "";

    if (!city) {
      return NextResponse.json(
        {
          success: false,
          error: "City is required.",
        },
        {
          status: 400,
          headers: corsHeaders(request),
        }
      );
    }

    const baseWhere = {
      verificationStatus: "VERIFIED" as const,
      isActive: true,
      acceptsImmediate: true,

      serviceAreas: {
        some: {
          city: {
            equals: city,
            mode: "insensitive" as const,
          },
        },
      },

      ...(service
        ? {
            services: {
              some: {
                isActive: true,
                serviceName: {
                  equals: service,
                  mode: "insensitive" as const,
                },
              },
            },
          }
        : {}),

      ...(language
        ? {
            languages: {
              some: {
                language: {
                  equals: language,
                  mode: "insensitive" as const,
                },
              },
            },
          }
        : {}),
    };

    const [
      availableNow,
      verifiedServingArea,
    ] = await Promise.all([
      prisma.pandit.count({
        where: {
          ...baseWhere,
          isOnline: true,
        },
      }),

      prisma.pandit.count({
        where: baseWhere,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        availability: {
          city,
          service: service || null,
          language: language || null,
          availableNow,
          verifiedServingArea,
          live: true,
          checkedAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          ...corsHeaders(request),

          // Availability is live operational data.
          // Do not let browser/CDN cache create stale counts.
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "CUSTOMER LIVE PANDIT AVAILABILITY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load live Pandit availability.",
      },
      {
        status: 500,
        headers: corsHeaders(request),
      }
    );
  }
}
