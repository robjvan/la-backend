import { GeographicalMetricsDto } from './geographical-metrics.dto';
import { NewUserMetricsDto } from './new-user-metrics.dto';
import { PlantMetricsDto } from './plant-metrics.dto';
import { UserGrowthMetricsDto } from './user-growth-metrics.dto';
import { UserLoginMetricsDto } from './user-login-metrics.dto';
import { UserMetricsDto } from './user-metrics.dto';
// import { WateringMetricsDto } from './watering-metrics.dto';

export class MetricsDto {
  userMetrics: UserMetricsDto;
  userLoginMetrics: UserLoginMetricsDto;
  newUserMetrics: NewUserMetricsDto;
  userGrowthMetrics: UserGrowthMetricsDto;
  plantMetrics: PlantMetricsDto;
  // wateringMetrics: WateringMetricsDto;
  geographicalMetrics: GeographicalMetricsDto;
}
