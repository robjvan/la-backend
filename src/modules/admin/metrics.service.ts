import * as dayjs from 'dayjs';
import { UserLoginRecordModel } from '../auth/models/user-login-record.model';
import { PlantModel } from '../plants/models/plant.model';
import { UserModel } from '../users/models/user.model';
import { NewUserMetricsDto } from './dto/new-user-metrics.dto';
import { PlantMetricsDto } from './dto/plant-metrics.dto';
import { UserGrowthMetricsDto } from './dto/user-growth-metrics.dto';
import { UserLoginMetricsDto } from './dto/user-login-metrics.dto';
import { UserMetricsDto } from './dto/user-metrics.dto';
import { WateringMetricsDto } from './dto/watering-metrics.dto';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { MetricsDto } from './dto/metrics.dto';
import { GeographicalMetricsDto } from './dto/geographical-metrics.dto';
import { UserProfileModel } from '../user-profiles/models/user-profile.model';
import {
  PLANT_REPOSITORY,
  USER_LOGIN_RECORD_REPOSITORY,
  USER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
} from 'src/constants';
import { Inject } from '@nestjs/common';

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
    // private readonly usersService: UsersService,
    // private readonly userProfilesServices: UserProfilesService,
    // private readonly plantService: PlantsService,
    // private readonly authService: AuthService,
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

  // # Plant metrics
  /**
   * Calculates the number of plants that need to be watered today.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {number} Number of plants to be watered today.
   */
  private calculatePlantsToBeWateredToday(plantRecords: PlantModel[]): number {
    return plantRecords.filter((elem) => {
      if (!elem.lastWateredAt || !elem.waterIntervalDays) {
        return false;
      }

      const lastWatered = dayjs(elem.lastWateredAt);
      const now = dayjs();
      const nextWaterDate = lastWatered.add(elem.waterIntervalDays, 'day');

      // Check if the next water date is today
      return nextWaterDate.isSame(now, 'day');
    }).length;
  }

  /**
   * Calculates the most frequently watered plant species.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {string} Most frequently watered species.
   */
  private calculateMostWateredSpecies(plantRecords: PlantModel[]): string {
    const speciesCount: { [key: string]: number } = {};

    // Count occurrences of each plant species
    for (const record of plantRecords) {
      if (speciesCount[record.species]) {
        speciesCount[record.species]++;
      } else {
        speciesCount[record.species] = 1;
      }
    }

    // Find the species with the highest count
    let mostWateredSpecies = '';
    let maxCount = 0;

    for (const [species, count] of Object.entries(speciesCount)) {
      if (count > maxCount) {
        mostWateredSpecies = species;
        maxCount = count;
      }
    }

    return mostWateredSpecies;
  }

  /**
   * Calculates the watering frequency metrics.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {WateringMetricsDto} Watering frequency metrics.
   */
  private calculateWateringFrequency(
    plantRecords: PlantModel[],
  ): WateringMetricsDto {
    const intervals: number[] = [];

    // Extract the watering interval days from each plant record
    for (const record of plantRecords) {
      if (record.waterIntervalDays > 0) {
        intervals.push(record.waterIntervalDays);
      }
    }

    if (intervals.length === 0) {
      return { minFrequency: 0, maxFrequency: 0, avgFrequency: 0 };
    }
    // Calculate min, max, and average intervals
    const min = Math.min(...intervals);
    const max = Math.max(...intervals);
    const avg =
      intervals.reduce((sum, value) => sum + value, 0) / intervals.length;

    return { minFrequency: min, maxFrequency: max, avgFrequency: avg };
  }

  /**
   * Gets plant metrics.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {PlantMetricsDto} Plant metrics.
   */
  private calculatePlantMetrics(plantRecords: PlantModel[]): PlantMetricsDto {
    return {
      totalPlants: plantRecords.length,
      livePlants: plantRecords.filter((elem) => !elem.archived).length,
      toBeWateredToday: this.calculatePlantsToBeWateredToday(plantRecords),
      mostWateredSpecies: this.calculateMostWateredSpecies(plantRecords),
      wateringFrequency: this.calculateWateringFrequency(plantRecords),
    };
  }

  private calculateWateringMetrics(plantRecords: PlantModel[]) {
    console.log(plantRecords);
    // TODO(RV): Add logic
    return { minFrequency: 0, avgFrequency: 0, maxFrequency: 0 };
  }

  // # User login metrics
  /**
   * Calculates user login metrics.
   * @param {UserLoginRecordModel[]} userLoginRecords - Array of user login records.
   * @returns {UserLoginMetricsDto} User login metrics.
   */
  private calculateUserLoginMetrics(
    userLoginRecords: UserLoginRecordModel[],
  ): UserLoginMetricsDto {
    return {
      totalLogins: userLoginRecords.length,
      totalLoginsToday: userLoginRecords.filter((elem) =>
        dayjs(elem.createdAt).isSame(dayjs().toDate(), 'day'),
      ).length,
      totalLoginsThisWeek: userLoginRecords.filter((elem) =>
        dayjs(elem.createdAt).isSame(dayjs().toDate(), 'week'),
      ).length,
      totalLoginsThisMonth: userLoginRecords.filter((elem) =>
        dayjs(elem.createdAt).isSame(dayjs().toDate(), 'month'),
      ).length,
      totalLogins7days: userLoginRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(7, 'day').toDate()),
      ).length,
      totalLogins30days: userLoginRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(30, 'day').toDate()),
      ).length,
      totalLogins90days: userLoginRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(90, 'day').toDate()),
      ).length,
      totalLoginsThisYear: userLoginRecords.filter((elem) =>
        dayjs(elem.createdAt).isSame(dayjs().toDate(), 'year'),
      ).length,
    };
  }

  // # User metrics
  private calculatePowerUsers(
    userLoginRecords: UserLoginRecordModel[],
  ): number {
    const loginCounts: { [userId: number]: number } = {};

    // Count logins for each user
    for (const record of userLoginRecords) {
      if (!loginCounts[record.userId]) {
        loginCounts[record.userId] = 1;
      } else {
        loginCounts[record.userId]++;
      }
    }

    // Filter users who have logged in at least three times within the last three days
    const powerUsers = Object.keys(loginCounts).filter((userId) => {
      const userLogs = userLoginRecords.filter(
        (log) => log.userId === parseInt(userId),
      );
      return (
        userLogs.some((log) =>
          dayjs(log.timestamp).isAfter(dayjs().subtract(7, 'day').toDate()),
        ) && loginCounts[parseInt(userId)] >= 3
      );
    });

    return powerUsers.length;
  }

  /**
   * Calculates general user metrics.
   * @param {UserModel[]} userRecords - Array of user records.
   * @returns {UserMetricsDto} General user metrics.
   */
  private calculateUserMetrics(
    userRecords: UserModel[],
    userLoginRecords: UserLoginRecordModel[],
  ): UserMetricsDto {
    return {
      totalUsers: userRecords.length,
      activeUsers: userRecords.filter((elem) => elem.active).length,
      powerUsers: this.calculatePowerUsers(userLoginRecords),
      haveReviewed: userRecords.filter((elem) => elem.haveReviewed).length,
      emailNotConfirmed: userRecords.filter((elem) => !elem.emailConfirmed)
        .length,
    };
  }

  /**
   * Calculates the growth rate of users.
   * @param {UserModel[]} users - Array of user records.
   * @param {dayjs.Dayjs} startDate - Start date for growth calculation.
   * @param {dayjs.Dayjs} endDate - End date for growth calculation.
   * @returns {number} User growth rate as a percentage.
   */
  private calculateUserGrowthRate(
    users: UserModel[],
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
  ): number {
    const startUsers = users.filter(
      (elem) =>
        dayjs(elem.createdAt).isAfter(startDate.toDate(), 'day') &&
        dayjs(elem.createdAt).isSame(endDate.toDate(), 'day'),
    ).length;

    const endUsers = users.filter((elem) =>
      dayjs(elem.createdAt).isBefore(startDate.toDate()),
    ).length;

    if (endUsers === 0 || startUsers === 0) {
      return 0;
    }

    const growthRate = ((startUsers - endUsers) / endUsers) * 100;
    return isNaN(growthRate) ? 0 : parseFloat(growthRate.toFixed(2));
  }

  /**
   * Calculates new user metrics.
   * @param {UserModel[]} userRecords - Array of user records.
   * @returns {NewUserMetricsDto} New user metrics.
   */
  private calculateNewUserMetrics(userRecords: UserModel[]): NewUserMetricsDto {
    return {
      newUsersThisWeek: userRecords.filter((elem) =>
        dayjs(elem.createdAt).isSame(dayjs().toDate(), 'week'),
      ).length,
      newUsersLastWeek: userRecords.filter((elem) => {
        dayjs(elem.createdAt).isSame(
          dayjs().subtract(1, 'week').toDate(),
          'week',
        );
      }).length,
      newUsersThisMonth: userRecords.filter((elem) =>
        dayjs(elem.createdAt).isSame(dayjs().toDate(), 'month'),
      ).length,
      newUsersLastMonth: userRecords.filter((elem) => {
        dayjs(elem.createdAt).isSame(
          dayjs().subtract(1, 'month').toDate(),
          'month',
        );
      }).length,
      newUsers7days: userRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(7, 'day').toDate()),
      ).length,
      newUsers30days: userRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(30, 'day').toDate()),
      ).length,
      newUsers90days: userRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(90, 'day').toDate()),
      ).length,
    };
  }

  /**
   * Calculates user growth metrics.
   * @param {UserModel[]} userRecords - Array of user records.
   * @returns {UserGrowthMetricsDto} User growth metrics.
   */
  private calculateUserGrowthMetrics(
    userRecords: UserModel[],
  ): UserGrowthMetricsDto {
    return {
      userGrowthRate7days: this.calculateUserGrowthRate(
        userRecords,
        dayjs().subtract(7, 'day'),
        dayjs(),
      ),
      userGrowthRate30days: this.calculateUserGrowthRate(
        userRecords,
        dayjs().subtract(30, 'day'),
        dayjs(),
      ),
      userGrowthRate90days: this.calculateUserGrowthRate(
        userRecords,
        dayjs().subtract(90, 'day'),
        dayjs(),
      ),
      userGrowthRateAnnual: this.calculateUserGrowthRate(
        userRecords,
        dayjs().subtract(365, 'day'),
        dayjs(),
      ),
    };
  }

  private calculateGeographicalMetrics(
    userRecords: UserProfileModel[],
  ): GeographicalMetricsDto {
    console.log(userRecords);
    // TODO(RV): Add logic
    return {
      usersInCanada: 0,
      usersInUSA: 0,
      usersInOther: 0,
      topCountryByUsers: '',
      topCountryNumUsers: 0,
      topCityByUsers: '',
      topCityNumUsers: 0,
      topCountryByLogins: '',
      topCountryNumLogins: 0,
      topCityByLogins: '',
      topCityNumLogins: 0,
    };
  }

  /**
   * Retrieves all metrics.
   * @returns {Promise<{ MetricsDto }>} Combined metrics object.
   */
  public async getMetrics(): Promise<MetricsDto> {
    try {
      const [userRecords, userLoginRecords, plantRecords, profileRecords] =
        await Promise.all([
          this.usersRepo.findAll(),
          this.userLoginRepo.findAll(),
          this.plantsRepo.findAll(),
          this.userProfilesRepo.findAll(),
          // this.usersService.fetchAllUsers(),
          // this.authService.findAllLoginRecords(),
          // this.plantService.fetchAllPlants(),
          // this.userProfilesServices.fetchAllProfiles(),
        ]);

      return {
        userMetrics: this.calculateUserMetrics(userRecords, userLoginRecords),
        userLoginMetrics: this.calculateUserLoginMetrics(userLoginRecords),
        newUserMetrics: this.calculateNewUserMetrics(userRecords),
        userGrowthMetrics: this.calculateUserGrowthMetrics(userRecords),
        plantMetrics: this.calculatePlantMetrics(plantRecords),
        wateringMetrics: this.calculateWateringMetrics(plantRecords),
        geographicalMetrics: this.calculateGeographicalMetrics(profileRecords),
      };
    } catch (err: any) {
      this.handleError(`Failed to process user metrics`, err.message);
    }
  }
}
