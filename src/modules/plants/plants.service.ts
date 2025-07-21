import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FERTILIZER_RECORDS_REPOSITORY,
  PLANT_REPOSITORY,
  WATERING_RECORDS_REPOSITORY,
} from 'src/constants';
import { PlantModel } from './models/plant.model';
import { NewPlantDto } from './dto/new-plant.dto';
import { AppwriteService } from '../appwrite/appwrite.service';
import { LoggingService } from '../logging/logging.service';
// import dayjs from 'dayjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dayjs = require('dayjs');
import { WateringRecordModel } from './models/watering-record.model';
import { FertilizerRecordModel } from './models/fertilizer-record.model';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantActionType } from './models/plant-action-type.enum';

@Injectable()
export class PlantsService {
  constructor(
    @Inject(PLANT_REPOSITORY)
    private readonly plantsRepo: typeof PlantModel,
    @Inject(WATERING_RECORDS_REPOSITORY)
    private readonly wateringRepo: typeof WateringRecordModel,
    @Inject(FERTILIZER_RECORDS_REPOSITORY)
    private readonly fertilizingRepo: typeof FertilizerRecordModel,
    private readonly appwriteService: AppwriteService,
    private readonly loggingService: LoggingService,
  ) {}

  /** Logger instance scoped to PlantsService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(PlantsService.name);

  /**
   * Handles common error logging and throwing for service methods.
   * @param {string} error - The error message to log.
   * @param {string} message - The error details.
   */
  private handleError(error: string, message: string) {
    this.logger.error(error, message);
    this.loggingService.error(PlantsService.name, error, message);
    throw new InternalServerErrorException(error, message);
  }

  /**
   * Fetches all plant records in the DB.
   * @returns {Promise<PlantModel[]>} A Promise resolving to an array of PlantModel objects.
   */
  async fetchAllPlants(): Promise<PlantModel[]> {
    try {
      return await this.plantsRepo.findAll();
    } catch (err: any) {
      this.handleError(`Failed to fetch plant records`, err.message);
    }
  }

  /**
   * Fetches all plant records associated with a specific user ID.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<PlantModel[]>} A Promise resolving to an array of PlantModel objects.
   */
  async fetchPlantsByUserId(userId: number): Promise<PlantModel[]> {
    try {
      return await this.plantsRepo.findAll({ where: { userId } });
    } catch (err: any) {
      this.handleError(
        `Failed to fetch plant records for userId ${userId}`,
        err.message,
      );
    }
  }

  /**
   * Fetches a specific plant record by its ID.
   * @param {number} id - The ID of the plant.
   * @returns {Promise<PlantModel>} A Promise resolving to the retrieved PlantModel object.
   */
  async fetchPlantById(id: number): Promise<PlantModel> {
    try {
      const result = await this.plantsRepo.findOne({ where: { id } });

      if (!result) {
        throw new NotFoundException(
          `Plant record with id ${id} does not exist`,
        );
      }

      return result;
    } catch (err: any) {
      this.handleError(
        `Failed to fetch plant record with id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Creates a new plant record.
   * @param {NewPlantDto} data - The new plant data.
   * @returns {Promise<PlantModel>} A Promise resolving to the newly created plant record.
   */
  async createNewPlantRecord(data: NewPlantDto): Promise<PlantModel> {
    try {
      const result = await this.plantsRepo.create(data);

      if (!result) {
        throw new InternalServerErrorException();
      }

      return result;
    } catch (err: any) {
      this.handleError(`Failed to create new plant record`, err.message);
    }
  }

  /**
   * Updates a specific plant record by its ID.
   * @param {number} id - The ID of the plant.
   * @returns {Promise<PlantModel>} A Promise resolving to the updated plant record.
   */
  async updatePlantById(id: number, data: UpdatePlantDto): Promise<PlantModel> {
    try {
      const plantRecord = await this.fetchPlantById(id);

      return await plantRecord.update(data);
    } catch (err: any) {
      this.handleError(
        `Failed to update plant record with id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Deletes a specific plant record by its ID.
   * @param {number} id - The ID of the plant.
   * @returns {HttpStatus} An HTTP status code (200 OK).
   */
  async deletePlantById(id: number): Promise<any> {
    try {
      // Fetch the plant record
      const plant = await this.plantsRepo.findByPk(id);

      // Table has `paranoid = true` so set deletedAt field to now
      plant.destroy();

      // Return 200 status
      return HttpStatus.OK;
    } catch (err: any) {
      this.handleError(
        `Failed to delete plant record with id ${id}`,
        err.message,
      );
    }
  }

  // /**
  //  * Adds a new image to a plant record and saves the updated record to the database.
  //  * @param id - The ID of the plant.
  //  * @param file - The image file to upload.
  //  * @returns The URL of the uploaded image.
  //  */
  //  async addPhotoByPlantId(id: number, image: Express.Multer.File) {
  //   try {
  //     // Fetch the original plant record
  //     const plant = await this.plantsRepo.findByPk(id);

  //     // Upload file to appwrite, save returned url to plant record
  //     const imageUrl = await this.appwriteService.uploadPhoto(image);

  //     plant.imageUrls = [...plant.imageUrls, imageUrl];
  //     // plant.imageUrls = updatedImageUrls;
  //     return await plant.save();
  //   } catch (e) {
  //     this.handleError(
  //       `Failed to add photo to plant record with id ${id}`,
  //       e.message,
  //     );
  //   }
  // }

  /**
   * Updates the "lastWateredAt" field for the plant record and saves a watering record in the DB.
   * @param {number} id - The ID of the plant that was watered.
   */
  async addWateringRecordById(id: number) {
    try {
      // Fetch the plant record
      const plantRecord = await this.fetchPlantById(id);

      // Update "lastWateredAt" field and create new wateringRecord
      const [updatedRecord, wateringRecord] = await Promise.all([
        await plantRecord.update({ lastWateredAt: dayjs().toDate() }),
        await this.wateringRepo.create({ plantId: id }),
      ]);

      if (updatedRecord && wateringRecord) {
        return HttpStatus.OK;
      } else {
        return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    } catch (err: any) {
      this.handleError(
        `Failed to add watering record for plant with ${id}`,
        err.message,
      );
    }
  }

  /**
   * Updates the "lastFertilizedAt" field for the plant record and saves a fertilizing record in the DB.
   * @param {number} id - The ID of the plant that was fertilized.
   * @returns {HttpStatus} - A Promise resolving to the outcome of the operation.
   */
  async addFertilizingRecordById(id: number): Promise<HttpStatus> {
    try {
      // Fetch the plant record
      const plantRecord = await this.fetchPlantById(id);

      // Update "lastFertilizedAt" field and create new fertilizingRecord
      const [updatedRecord, fertilizingRecord] = await Promise.all([
        plantRecord.update({ lastFertilizedAt: dayjs().toDate() }),
        this.fertilizingRepo.create({ plantId: id }),
      ]);

      if (updatedRecord && fertilizingRecord) {
        return HttpStatus.OK;
      } else {
        return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    } catch (err: any) {
      this.handleError(
        `Failed to add fertilizing record for plant with id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Deletes a plant photo file with the given ID.
   * @param {number} id - The ID of the photo to be deleted.
   * @returns {HttpStatus} - A Promise resolving to the outcome of the operation.
   */
  async deletePhotoById(id: string): Promise<HttpStatus> {
    try {
      await this.appwriteService.deletePhoto(id);

      return HttpStatus.OK;
    } catch (err: any) {
      this.handleError(`Failed to delete photo with id ${id}`, err.message);
    }
  }

  async addPlantRecords(
    action: PlantActionType,
    plantIds: number[],
  ): Promise<HttpStatus> {
    try {
      const tasks = plantIds.map(async (plantId) => {
        switch (action) {
          // case 'water':
          case PlantActionType.water:
            return this.addWateringRecordById(plantId);
          // case 'fertilize':
          case PlantActionType.fertilize:
            return this.addFertilizingRecordById(plantId);
        }
      });

      await Promise.all(tasks);
      return HttpStatus.OK;
    } catch (err: any) {
      this.handleError(`Failed to process ${action} records`, err.message);
    }
  }

  async toggleReminders(id: number, type: PlantActionType) {
    try {
      // Fetch the plant record
      const plantRecord: PlantModel = await this.fetchPlantById(id);

      switch (type) {
        case PlantActionType.water:
          return await plantRecord.update({
            reminderEnabled: !plantRecord.reminderEnabled,
          });
        case PlantActionType.fertilize:
          return await plantRecord.update({
            fertilizerReminderEnabled: !plantRecord.fertilizerReminderEnabled,
          });
      }
    } catch (err: any) {
      this.handleError(
        `Failed to toggle ${type} reminders for plant with id ${id}`,
        err.message,
      );
    }
  }
}

// export type PlantActionType = 'water' | 'fertilize';
