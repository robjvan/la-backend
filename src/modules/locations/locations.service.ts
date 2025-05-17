import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CountryModel } from './models/country.model';
import { CITY_REPOSITORY, COUNTRY_REPOSITORY } from 'src/constants';
import { CityModel } from './models/city.model';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as lookup from 'country-code-lookup';
import { countryToAlpha2 } from 'country-to-iso';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: typeof CityModel,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: typeof CountryModel,
    private readonly httpService: HttpService,
  ) {}

  /** Logger instance scoped to LocationsService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(LocationsService.name);

  /** Handles common error logging and throwing for service methods. */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  public async getOrCreateRecord(
    type: string,
    name: string,
  ): Promise<CityModel | CountryModel> {
    try {
      // Convert input to lowercase for consistency
      const cleanedData = name.toLocaleLowerCase();

      // Determine which repo to interact with
      switch (type) {
        case 'country':
          // Check for existing record with the passed name
          const countryRecord = await this.countryRepository.findOne({
            where: { name: cleanedData },
          });

          if (!countryRecord) {
            // Record doesn't exist, create and return new record
            return await this.countryRepository.create({
              name: cleanedData,
              isoCode: countryToAlpha2(name),
            });
          }

          return countryRecord;

        case 'city':
          // Check for existing record with the passed name
          const cityRecord = await this.cityRepository.findOne({
            where: { name: cleanedData },
          });

          if (!cityRecord) {
            // Record doesn't exist, create and return new record
            return await this.cityRepository.create({
              name: cleanedData,
            });
          }

          return cityRecord;
      }
    } catch (err: any) {
      this.handleError(
        `Failed to getOrCreate ${type} record for ${name}`,
        err.message,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async processCountryFromIp(ip: string): Promise<CountryModel> {
    try {
      // Fetch country code using IP address
      const res = await firstValueFrom(
        // TODO(RV): Change this to use request IP instead of hardcoded. Use hardcoded for local testing.
        // this.httpService.get(`https://api.country.is/${ip}`),
        this.httpService.get(`https://api.country.is/174.118.179.69`),
      );
      const countryCode = res.data.country;

      // Fetch country name using the country code
      const countryResult = lookup.byIso(countryCode);
      if (!countryResult) {
        throw new InternalServerErrorException(
          `Invalid country code: ${countryCode}`,
        );
      }
      return (await this.getOrCreateRecord(
        'country',
        countryResult.country,
      )) as CountryModel;
    } catch (e: any) {
      throw new InternalServerErrorException(
        `Error fetching country data: ${e.message}`,
      );
    }
  }
}
