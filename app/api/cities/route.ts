import { cities } from "@/data/cities"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cityName = request.nextUrl.searchParams.get("name") || ""
  const filteredCities = cities
    .filter((city) => city.name.includes(cityName))
    .splice(0, 8)
  return NextResponse.json(filteredCities)
}
