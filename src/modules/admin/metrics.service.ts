// import * as dayjs from 'dayjs';
import { UserLoginRecordModel } from '../auth/models/user-login-record.model';
import { PlantModel } from '../plants/models/plant.model';
import { UserModel } from '../users/models/user.model';
// import { NewUserMetricsDto } from './dto/new-user-metrics.dto';
// import { PlantMetricsDto } from './dto/plant-metrics.dto';
// import { UserGrowthMetricsDto } from './dto/user-growth-metrics.dto';
// import { UserLoginMetricsDto } from './dto/user-login-metrics.dto';
// import { UserMetricsDto } from './dto/user-metrics.dto';
// import { WateringMetricsDto } from './dto/watering-metrics.dto';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { MetricsDto } from './dto/metrics.dto';
import { UserProfileModel } from '../user-profiles/models/user-profile.model';
import {
  CITY_REPOSITORY,
  COUNTRY_REPOSITORY,
  FERTILIZER_RECORDS_REPOSITORY,
  PLANT_REPOSITORY,
  USER_LOGIN_RECORD_REPOSITORY,
  USER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
  WATERING_RECORDS_REPOSITORY,
} from 'src/constants';
import { Inject } from '@nestjs/common';
import { WateringRecordModel } from '../plants/models/watering-record.model';
import { FertilizerRecordModel } from '../plants/models/fertilizer-record.model';
import { CountryModel } from '../locations/models/country.model';
import { CityModel } from '../locations/models/city.model';
import { UserMetricsService } from './user-metrics.service';
import { PlantMetricsService } from './plant-metrics.service';
import { GeographicalMetricsService } from './geographics-metrics.service';

/**
 * Service class for generating various metrics.
 */
export class MetricsService {
  constructor(
    @Inject(USER_LOGIN_RECORD_REPOSITORY)
    private readonly userLoginRepo: typeof UserLoginRecordModel,
    @Inject(USER_REPOSITORY)
    private readonly usersRepo: typeof UserModel,
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfilesRepo: typeof UserProfileModel,
    @Inject(PLANT_REPOSITORY)
    private readonly plantsRepo: typeof PlantModel,
    @Inject(WATERING_RECORDS_REPOSITORY)
    private readonly wateringRecordsRepo: typeof WateringRecordModel,
    @Inject(FERTILIZER_RECORDS_REPOSITORY)
    private readonly fertilizerRecordsRepo: typeof FertilizerRecordModel,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepo: typeof CountryModel,
    @Inject(CITY_REPOSITORY)
    private readonly cityRepo: typeof CityModel,
    private readonly userMetricsService: UserMetricsService,
    private readonly plantMetricsSerice: PlantMetricsService,
    private readonly geographicalMetricsService: GeographicalMetricsService,
  ) {}

  /** Logger instance scoped to MetricsService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(MetricsService.name);

  /**
   * Handles common error logging and throwing for service methods.
   * @param {string} error - The error message.
   * @param {string} errorMsg - Additional context for the error.
   */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /**
   * Retrieves all metrics.
   * @returns {Promise<{ MetricsDto }>} Combined metrics object.
   */
  public async getMetrics(): Promise<MetricsDto> {
    try {
      const [
        userRecords,
        userLoginRecords,
        plantRecords,
        profileRecords,
        fertilizerRecords,
        wateringRecords,
        countryRecords,
        cityRecords,
      ] = await Promise.all([
        this.usersRepo.findAll(),
        this.userLoginRepo.findAll(),
        this.plantsRepo.findAll(),
        this.userProfilesRepo.findAll(),
        this.fertilizerRecordsRepo.findAll(),
        this.wateringRecordsRepo.findAll(),
        this.countryRepo.findAll(),
        this.cityRepo.findAll(),
      ]);

      return {
        userMetrics: this.userMetricsService.calculateUserMetrics(
          userRecords,
          userLoginRecords,
        ),
        userLoginMetrics:
          this.userMetricsService.calculateUserLoginMetrics(userLoginRecords),
        newUserMetrics:
          this.userMetricsService.calculateNewUserMetrics(userRecords),
        userGrowthMetrics:
          this.userMetricsService.calculateUserGrowthMetrics(userRecords),
        plantMetrics: this.plantMetricsSerice.calculatePlantMetrics(
          plantRecords,
          fertilizerRecords,
          wateringRecords,
        ),
        geographicalMetrics:
          this.geographicalMetricsService.calculateGeographicalMetrics(
            profileRecords,
            countryRecords,
            cityRecords,
            userLoginRecords,
          ),
      };
    } catch (err: any) {
      this.handleError(`Failed to process user metrics`, err.message);
    }
  }
}
