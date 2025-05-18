import { WateringMetricsDto } from './watering-metrics.dto';

export class PlantMetricsDto {
  totalPlants: number;
  livePlants: number;
  toBeWateredToday: number;
  mostWateredSpecies: string;
  wateringFrequency: WateringMetricsDto;
  fertilizerFrequency: WateringMetricsDto;
  mostFertilizedSpecies: string;
  plantsAddedToday: number;
  plantsAdded7Days: number;
  plantsAdded30Days: number;
  plantsAdded90Days: number;
}
