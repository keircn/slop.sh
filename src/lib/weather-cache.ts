interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  updatedAt: Date;
}

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

class WeatherCache {
  private cache: Map<string, CacheEntry>;
  private cacheTTL: number;

  constructor(ttlMinutes: number = 30) {
    this.cache = new Map();
    this.cacheTTL = ttlMinutes * 60 * 1000;
  }

  get(location: string): WeatherData | null {
    const cacheEntry = this.cache.get(location);
    if (!cacheEntry) {
      return null;
    }

    const now = Date.now();
    if (now - cacheEntry.timestamp > this.cacheTTL) {
      this.cache.delete(location);
      return null;
    }

    return cacheEntry.data;
  }

  set(location: string, data: WeatherData): void {
    this.cache.set(location, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }
}

const weatherCache = new WeatherCache(30);

export default weatherCache;
