import { FertilizerRecordModel } from '../plants/models/fertilizer-record.model';
import { PlantModel } from '../plants/models/plant.model';
import { WateringRecordModel } from '../plants/models/watering-record.model';
import { PlantMetricsDto } from './dto/plant-metrics.dto';
import { FrequencyDto } from './dto/watering-metrics.dto';
import * as dayjs from 'dayjs';

export class PlantMetricsService {
  /**
   * Calculates the number of plants that need to be watered today.
   * @param {PlantModel[]} plantRecords - Array of plant records.
   * @returns {number} Number of plants to be watered today.
   */
  public calculatePlantsToBeWateredToday(plantRecords: PlantModel[]): number {
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
  public calculateMostWateredSpecies(
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
   * @returns {FrequencyDto} Watering frequency metrics.
   */
  public calculateWateringFrequency(
    plantRecords: PlantModel[],
  ): FrequencyDto {
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
   * @returns {FrequencyDto} Fertilizer frequency metrics.
   */
  public calculateFertilizerFrequency(
    plantRecords: PlantModel[],
  ): FrequencyDto {
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
  public calculateMostFertilizedSpecies(
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
  public calculatePlantMetrics(
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

  public calculateWateringMetrics(plantRecords: PlantModel[]) {
    console.log(typeof plantRecords);
    // TODO(RV): Add logic
    return { minFrequency: 0, avgFrequency: 0, maxFrequency: 0 };
  }
}
