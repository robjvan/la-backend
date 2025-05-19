import { UserLoginRecordModel } from '../auth/models/user-login-record.model';
import { CityModel } from '../locations/models/city.model';
import { CountryModel } from '../locations/models/country.model';
import { UserProfileModel } from '../user-profiles/models/user-profile.model';
import { GeographicalMetricsDto } from './dto/geographical-metrics.dto';

export class GeographicalMetricsService {
  public calculateGeographicalMetrics(
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
}
