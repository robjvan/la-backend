import { WateringMetricsDto } from './watering-metrics.dto';

export class PlantMetricsDto {
  totalPlants: number;
  livePlants: number;
  toBeWateredToday: number;
  mostWateredSpecies: string;
  wateringFrequency: WateringMetricsDto;
}
