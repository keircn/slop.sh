import { NextRequest, NextResponse } from "next/server";
import weatherCache from "~/lib/weather-cache";

export const dynamic = "force-dynamic";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY || "";
const DEFAULT_LOCATION = "London,UK";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location") || DEFAULT_LOCATION;

    const cachedData = weatherCache.get(location);
    if (cachedData) {
      console.log(`Using cached weather data for location: ${location}`);
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "max-age=1800, s-maxage=1800",
        },
      });
    }

    console.log(`Fetching fresh weather data for location: ${location}`);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location,
      )}&units=metric&appid=${API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    const weatherData = {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      updatedAt: new Date(),
    };

    weatherCache.set(location, weatherData);

    return NextResponse.json(weatherData, {
      headers: {
        "Cache-Control": "max-age=1800, s-maxage=1800",
      },
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
