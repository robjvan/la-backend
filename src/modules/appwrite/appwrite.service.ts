/* eslint-disable @typescript-eslint/no-require-imports */
import {
  Injectable,
  InternalServerErrorException,
  // InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Client, ID, Storage } from 'node-appwrite';
import { LoggingService } from '../logging/logging.service';
const { InputFile } = require('node-appwrite/file');

@Injectable()
export class AppwriteService {
  private readonly logger: Logger;
  private client: Client;
  private storage: Storage;

  constructor(private readonly loggingService: LoggingService) {
    this.logger = new Logger(AppwriteService.name);
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_URL)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_KEY);

    this.storage = new Storage(this.client);
  }

  // /** Handles common error logging and throwing for service methods. */
  private handleError(error: string, message: string) {
    this.logger.error(error, message);
    this.loggingService.error(AppwriteService.name, error, message);
    throw new InternalServerErrorException(error, message);
  }

  /**
   * Adds a new image to a plant record and saves the updated record to the database.
   * @param file - The image file to upload.
   * @returns The URL of the uploaded image.
   */
  public async uploadPhoto(file: Express.Multer.File): Promise<string> {
    try {
      const imageFile = InputFile.fromFile(file);
      const result = await this.storage.createFile(
        `${process.env.APPWRITE_BUCKET_ID}`,
        ID.unique(),
        imageFile,
      );

      return `https://appwrite.robjvan.ca/v1/storage/buckets/${result.bucketId}/files/${result.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
    } catch (e) {
      this.handleError('Failed to upload photo to Appwrite bucket', e.message);
      return '';
    }
  }

  public async deletePhoto(fileId: string): Promise<any> {
    try {
      return await this.storage.deleteFile(
        `${process.env.APPWRITE_BUCKET_ID}`,
        fileId,
      );
    } catch (err: any) {
      this.handleError(
        `Failed to delete photo from Appwrite bucket`,
        err.message,
      );
    }
  }

  public async fetchPhoto(): Promise<Express.Multer.File> {
    try {
      console.log();
      // TODO(RV): Add logic
      return null;
    } catch (err: any) {
      this.handleError(
        `Failed to fetch photo from Appwrite bucket`,
        err.message,
      );
    }
  }
}
