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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NewPlantDto } from './dto/new-plant.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('plants')
@ApiTags('Plants')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new plant record' })
  @ApiBody({
    description: 'New plant data to be captured in the DB',
    type: NewPlantDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  public addNewPlant(@Body() data: NewPlantDto) {
    return this.plantsService.createNewPlantRecord(data);
  }

  @Get('')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Fetch all plant records in DB' })
  public getAllPlants() {
    return this.plantsService.fetchAllPlants();
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
