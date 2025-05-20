import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO representing geographical user and login distribution metrics.
 * Used for analytics or administrative dashboards.
 */
export class GeographicalMetricsDto {
  /**
   * Total number of users located in Canada.
   */
  @ApiProperty({
    example: 152,
    description: 'Total number of users located in Canada.',
  })
  usersInCanada: number;

  /**
   * Total number of users located in the USA.
   */
  @ApiProperty({
    example: 284,
    description: 'Total number of users located in the USA.',
  })
  usersInUSA: number;

  /**
   * Total number of users located in countries other than Canada or the USA.
   */
  @ApiProperty({
    example: 97,
    description:
      'Total number of users located in all other countries combined.',
  })
  usersInOther: number;

  /**
   * Name of the country with the highest number of users.
   */
  @ApiProperty({
    example: 'USA',
    description:
      'The name of the country that currently has the most registered users.',
  })
  topCountryByUsers: string;

  /**
   * Number of users in the top country by users.
   */
  @ApiProperty({
    example: 284,
    description:
      'The number of users in the country with the highest user count.',
  })
  topCountryNumUsers: number;

  /**
   * Name of the country with the highest number of logins.
   */
  @ApiProperty({
    example: 'Canada',
    description:
      'The name of the country that has recorded the most user logins.',
  })
  topCountryByLogins: string;

  /**
   * Number of logins in the top country by logins.
   */
  @ApiProperty({
    example: 412,
    description:
      'The number of logins from the country with the highest login activity.',
  })
  topCountryNumLogins: number;
}
