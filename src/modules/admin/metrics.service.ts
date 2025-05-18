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
  private calculateMostWateredSpecies(
    wateringRecords: WateringRecordModel[],
    plantRecords: PlantModel[],
  ): string {
    const plantIdCount: { [key: number]: number } = {};

    // Count occurrences of each plant species
    for (const record of wateringRecords) {
      if (plantIdCount[record.plantId]) {
        plantIdCount[record.plantId]++;
      } else {
        plantIdCount[record.plantId] = 1;
      }
    }

    // Find the species with the highest count
    let mostWateredSpeciesId = -1;
    let maxCount = 0;

    for (const [plantId, count] of Object.entries(plantIdCount)) {
      if (count > maxCount) {
        mostWateredSpeciesId = parseInt(plantId);
        maxCount = count;
      }
    }

    try {
      // feetch plan from id
      const mostWateredPlant = plantRecords.find(
        (elem) => elem.id === mostWateredSpeciesId,
      );
      return mostWateredPlant.species != ''
        ? mostWateredPlant.species
        : mostWateredPlant.name;
    } catch (err: any) {
      console.log(
        `Failed to fetch "most watered plant" with id ${mostWateredSpeciesId}`,
        err.message,
      );
      return null;
    }
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
   * Calculates the fertilizer frequency metrics.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {WateringMetricsDto} Fertilizer frequency metrics.
   */
  private calculateFertilizerFrequency(
    plantRecords: PlantModel[],
  ): WateringMetricsDto {
    const intervals: number[] = [];

    // Extract the fertilizer interval days from each plant record
    for (const record of plantRecords) {
      if (record.fertilierIntervalDays > 0) {
        intervals.push(record.fertilierIntervalDays);
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
   * Calculates the most frequently fertilized plant species.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {string} Most frequently fertilized species.
   */
  private calculateMostFertilizedSpecies(
    fertilizerRecords: FertilizerRecordModel[],
    plantRecords: PlantModel[],
  ): string {
    const plantIdCount: { [key: number]: number } = {};

    // Count occurrences of each plant species
    for (const record of fertilizerRecords) {
      if (plantIdCount[record.plantId]) {
        plantIdCount[record.plantId]++;
      } else {
        plantIdCount[record.plantId] = 1;
      }
    }

    // Find the species with the highest count
    let mostFertilizedSpeciesId = -1;
    let maxCount = 0;

    for (const [plantId, count] of Object.entries(plantIdCount)) {
      if (count > maxCount) {
        mostFertilizedSpeciesId = parseInt(plantId);
        maxCount = count;
      }
    }

    if (mostFertilizedSpeciesId != -1) {
      try {
        // feetch plant from id
        const mostFertilizedPlant = plantRecords.find(
          (elem) => elem.id === mostFertilizedSpeciesId,
        );

        return mostFertilizedPlant.species != ''
          ? mostFertilizedPlant.species
          : mostFertilizedPlant.name;
      } catch (err: any) {
        console.log(
          `Failed to fetch "most fertilized plant" with id ${mostFertilizedSpeciesId}`,
          err.message,
        );
        return '';
      }
    } else {
      return '';
    }
  }

  /**
   * Gets plant metrics.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {PlantMetricsDto} Plant metrics.
   */
  private calculatePlantMetrics(
    plantRecords: PlantModel[],
    fertilizerRecords: FertilizerRecordModel[],
    wateringRecords: WateringRecordModel[],
  ): PlantMetricsDto {
    return {
      totalPlants: plantRecords.length,
      livePlants: plantRecords.filter((elem) => !elem.archived).length,
      toBeWateredToday: this.calculatePlantsToBeWateredToday(plantRecords),
      mostWateredSpecies: this.calculateMostWateredSpecies(
        wateringRecords,
        plantRecords,
      ),
      wateringFrequency: this.calculateWateringFrequency(plantRecords),
      fertilizerFrequency: this.calculateFertilizerFrequency(plantRecords),
      mostFertilizedSpecies: this.calculateMostFertilizedSpecies(
        fertilizerRecords,
        plantRecords,
      ),
      plantsAddedToday: plantRecords.filter((elem) =>
        dayjs(elem.createdAt).isSame(dayjs().toDate(), 'day'),
      ).length,
      plantsAdded7Days: plantRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(7, 'day').toDate()),
      ).length,
      plantsAdded30Days: plantRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(30, 'day').toDate()),
      ).length,
      plantsAdded90Days: plantRecords.filter((elem) =>
        dayjs(elem.createdAt).isAfter(dayjs().subtract(90, 'day').toDate()),
      ).length,
    };
  }

  private calculateWateringMetrics(plantRecords: PlantModel[]) {
    console.log(typeof plantRecords);
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

    // Filter users who have logged in at least three times within the last seven days
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
    countryRecords: CountryModel[],
    cityRecords: CityModel[],
    loginRecords: UserLoginRecordModel[],
  ): GeographicalMetricsDto {
    // Create a map of countryId to country name for quick lookup
    const countryMap = new Map<number, string>();
    countryRecords.forEach((country) => {
      if (country.id !== undefined) {
        countryMap.set(country.id, country.name.toLowerCase());
      }
    });

    // Get country IDs for Canada and USA
    const canadaCountryId = countryRecords.find(
      (country) => country.name.toLowerCase() === 'canada',
    )?.id;
    const usaCountryId = countryRecords.find(
      (country) =>
        country.name.toLowerCase() === 'usa' ||
        country.name.toLowerCase() === 'united states',
    )?.id;

    // Counters for users by country
    let usersInCanada = 0;
    let usersInUSA = 0;
    let usersInOther = 0;

    // Count of users per country
    const userCountryCounts = new Map<number, number>();

    userRecords.forEach((user) => {
      const countryId = user.countryId;
      if (countryId !== undefined && countryId !== null) {
        // Count for topCountryByUsers
        userCountryCounts.set(
          countryId,
          (userCountryCounts.get(countryId) || 0) + 1,
        );

        // Specific country tallies
        if (countryId === canadaCountryId) {
          usersInCanada++;
        } else if (countryId === usaCountryId) {
          usersInUSA++;
        } else {
          usersInOther++;
        }
      }
    });

    // Determine top country by users
    let topCountryByUsers = '';
    let topCountryNumUsers = 0;
    for (const [countryId, count] of userCountryCounts.entries()) {
      if (count > topCountryNumUsers) {
        topCountryNumUsers = count;
        topCountryByUsers = countryMap.get(countryId) || '';
      }
    }

    // Count of logins per country
    const loginCountryCounts = new Map<number, number>();

    loginRecords.forEach((record) => {
      const countryId = record.countryId;
      if (countryId !== undefined && countryId !== null) {
        loginCountryCounts.set(
          countryId,
          (loginCountryCounts.get(countryId) || 0) + 1,
        );
      }
    });

    // Determine top country by logins
    let topCountryByLogins = '';
    let topCountryNumLogins = 0;
    for (const [countryId, count] of loginCountryCounts.entries()) {
      if (count > topCountryNumLogins) {
        topCountryNumLogins = count;
        topCountryByLogins = countryMap.get(countryId) || '';
      }
    }

    return {
      usersInCanada,
      usersInUSA,
      usersInOther,
      topCountryByUsers,
      topCountryNumUsers,
      topCountryByLogins,
      topCountryNumLogins,
    };
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
        userMetrics: this.calculateUserMetrics(userRecords, userLoginRecords),
        userLoginMetrics: this.calculateUserLoginMetrics(userLoginRecords),
        newUserMetrics: this.calculateNewUserMetrics(userRecords),
        userGrowthMetrics: this.calculateUserGrowthMetrics(userRecords),
        plantMetrics: this.calculatePlantMetrics(
          plantRecords,
          fertilizerRecords,
          wateringRecords,
        ),
        // wateringMetrics: this.calculateWateringMetrics(plantRecords),
        geographicalMetrics: this.calculateGeographicalMetrics(
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
