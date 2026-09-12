import { NextResponse } from "next/server";

const MOBILE_ORIGIN =
  "https://probable-engine-56gj6xwj4w437pg9-8081.app.github.dev";

export function addMobileCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", MOBILE_ORIGIN);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  return response;
}
