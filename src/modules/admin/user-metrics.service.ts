import { UserLoginRecordModel } from '../auth/models/user-login-record.model';
import { UserModel } from '../users/models/user.model';
import { NewUserMetricsDto } from './dto/new-user-metrics.dto';
import { UserGrowthMetricsDto } from './dto/user-growth-metrics.dto';
import { UserLoginMetricsDto } from './dto/user-login-metrics.dto';
import { UserMetricsDto } from './dto/user-metrics.dto';
import * as dayjs from 'dayjs';

export class UserMetricsService {
  /**
   * Calculates user login metrics.
   * @param {UserLoginRecordModel[]} userLoginRecords - Array of user login records.
   * @returns {UserLoginMetricsDto} User login metrics.
   */
  public calculateUserLoginMetrics(
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

  public calculatePowerUsers(userLoginRecords: UserLoginRecordModel[]): number {
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
  public calculateUserMetrics(
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
  public calculateUserGrowthRate(
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
  public calculateNewUserMetrics(userRecords: UserModel[]): NewUserMetricsDto {
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
  public calculateUserGrowthMetrics(
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
}
