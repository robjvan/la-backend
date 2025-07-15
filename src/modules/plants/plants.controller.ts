import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { NewPlantDto } from './dto/new-plant.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Controller('plants')
@ApiTags('Plants')
@UseGuards(AuthGuard)
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new plant record' })
  @ApiBody({
    description: 'New plant data to be captured in the db',
    type: NewPlantDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  public addNewPlant(
    @Body() data: NewPlantDto,
    // @UploadedFile() image: Express.Multer.File,
  ) {
    // return this.plantsService.createNewPlantRecord(data, image);
    return this.plantsService.createNewPlantRecord(data);
  }

  @Get('byuser/:userId')
  @ApiOperation({ summary: 'Fetch plants for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'number' })
  public getPlantsForUserId(@Param('userId') userId: number) {
    return this.plantsService.fetchPlantsByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a specific plant by ID' })
  @ApiParam({ name: 'id', description: 'Plant ID', type: 'number' })
  public getPlantById(@Param('id') id: number) {
    return this.plantsService.fetchPlantById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific plant by ID' })
  @ApiParam({ name: 'id', description: 'Plant ID', type: 'number' })
  public updatePlantById(
    @Param('id') id: number,
    @Body() data: UpdatePlantDto,
  ) {
    return this.plantsService.updatePlantById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific plant by ID' })
  @ApiParam({ name: 'id', description: 'Plant ID', type: 'number' })
  public deletePlantById(@Param('id') id: number) {
    return this.plantsService.deletePlantById(id);
  }

  // @Post(':id/upload-photo')
  // @ApiOperation({ summary: 'Upload a photo for a specific plant' })
  // @ApiParam({ name: 'id', description: 'Plant ID', type: 'number' })
  // @UseInterceptors(FileInterceptor('file'))
  // public addPhotoByPlantId(
  //   @Param('id') id: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.plantsService.addPhotoByPlantId(id, file);
  // }

  @Post(':id/add-watering-record')
  @ApiOperation({ summary: 'Add a watering record' })
  @ApiParam({
    name: 'id',
    description: 'Plant ID to add record for',
    type: 'number',
  })
  public addWateringRecordById(id: number) {
    return this.plantsService.addWateringRecordById(id);
  }

  @Post(':id/add-fertilizing-record')
  @ApiOperation({ summary: 'Add a fertilizing record' })
  @ApiParam({
    name: 'id',
    description: 'Plant ID to add record for',
    type: 'number',
  })
  public addFertilizingRecordById(id: number) {
    return this.plantsService.addFertilizingRecordById(id);
  }

  @Delete('/photos/:id')
  @ApiOperation({ summary: 'Delete a specific photo by ID' })
  @ApiParam({ name: 'id', description: 'Photo ID', type: 'string' })
  public deletePhotoById(id: string) {
    return this.plantsService.deletePhotoById(id);
  }
}
