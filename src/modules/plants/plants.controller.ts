import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { NewPlantDto } from './dto/new-plant.dto';

@Controller('plants')
@ApiTags('Plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new plant record' })
  @ApiBody({
    description: 'New plant data to be captured in the db',
    type: NewPlantDto,
  })
  public addNewPlant(@Body() data: NewPlantDto) {
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
  public updatePlantById(@Param('id') id: number) {
    return this.plantsService.updatePlantById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific plant by ID' })
  @ApiParam({ name: 'id', description: 'Plant ID', type: 'number' })
  public deletePlantById(@Param('id') id: number) {
    return this.plantsService.deletePlantById(id);
  }

  @Post(':id/upload-photo')
  @ApiOperation({ summary: 'Upload a photo for a specific plant' })
  @ApiParam({ name: 'id', description: 'Plant ID', type: 'number' })
  // @ApiBody({
  //   type: 'object',
  //   // properties: {
  //   //   file: { type: 'string', format: 'binary' },
  //   // },
  // })
  @UseInterceptors(FileInterceptor('file'))
  public addPhotoByPlantId(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.plantsService.addPhotoByPlantId(id, file);
  }
}
