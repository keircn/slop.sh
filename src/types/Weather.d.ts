export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  updatedAt: Date;
}

export interface WeatherProps {
  location?: string;
  disabled?: boolean;
}
