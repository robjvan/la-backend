import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PLANT_REPOSITORY } from 'src/constants';
import { PlantModel } from './models/plant.model';
import { NewPlantDto } from './dto/new-plant.dto';
import { AppwriteService } from '../appwrite/appwrite.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class PlantsService {
  constructor(
    @Inject(PLANT_REPOSITORY)
    private readonly plantsRepo: typeof PlantModel,
    private readonly appwriteService: AppwriteService,
    private readonly loggingService: LoggingService,
  ) {}

  /** Logger instance scoped to PlantsService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(PlantsService.name);

  /**
   * Handles common error logging and throwing for service methods.
   * @param error - The error message to log.
   * @param errorMsg - The error details.
   */
  private handleError(error: string, message: string) {
    this.logger.error(error, message);
    this.loggingService.error(PlantsService.name, error, message);
    throw new InternalServerErrorException(error, message);
  }

  public async fetchAllPlants() {
    try {
      return await this.plantsRepo.findAll();
    } catch (err: any) {
      this.handleError(`Failed to fetch plant records`, err.message);
    }
  }

  /**
   * Fetches all plant records associated with a specific user ID.
   * @param userId - The ID of the user.
   * @returns An array of PlantModel objects.
   */
  public async fetchPlantsByUserId(userId: number): Promise<PlantModel[]> {
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
   * @param id - The ID of the plant.
   * @returns A PlantModel object.
   */
  public async fetchPlantById(id: number): Promise<PlantModel> {
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
   * @param data - The new plant data.
   * @returns A new plant record.
   */
  public async createNewPlantRecord(
    data: NewPlantDto,
    image: Express.Multer.File,
  ) {
    try {
      // If user attached a photo, upload to appwrite bucket
      if (image) {
        // Attach returned url to plant record
        try {
          data.imageUrl = await this.appwriteService.uploadPhoto(image);
        } catch {
          // Do nothing, just continue with record creation
        }
      }

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
   * @param id - The ID of the plant.
   * @returns A updated plant record.
   */
  public async updatePlantById(id: number): Promise<PlantModel> {
    try {
      // TODO(RV): Add logic
      return null;
    } catch (err: any) {
      this.handleError(
        `Failed to update plant record with id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Deletes a specific plant record by its ID.
   * @param id - The ID of the plant.
   * @returns An HTTP status code (200 OK).
   */
  public async deletePlantById(id: number): Promise<any> {
    try {
      // TODO(RV): Add logic

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
  public async addPhotoByPlantId(id: number, image: Express.Multer.File) {
    try {
      const plant = await this.plantsRepo.findByPk(id);

      if (!plant) {
        throw new NotFoundException(`Plant with id ${id} not found`);
      }

      // Upload file to appwrite, save returned url to plant record
      const imageUrl = await this.appwriteService.uploadPhoto(image);

      plant.imageUrls = [...plant.imageUrls, imageUrl];
      // plant.imageUrls = updatedImageUrls;
      return await plant.save();
    } catch (e) {
      this.handleError(
        `Failed to add photo to plant record with id ${id}`,
        e.message,
      );
    }
  }
}
