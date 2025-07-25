import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

/**
 * The UserProfilesController handles all operations related to user profiles.
 */
@Controller('user-profiles')
@ApiTags('User Profiles')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user profile by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user associated with the profile',
    required: true,
    type: 'number',
  })
  public fetchProfileById(@Param('id') id: number) {
    return this.userProfilesService.fetchProfileById(id);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user profile by ID' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user associated with the profile',
    required: true,
    type: 'number',
  })
  @ApiBody({
    description: 'User data to update',
    required: true,
    type: 'object',
  })
  public updateProfileById(@Param('userId') userId: number, @Body() data: any) {
    return this.userProfilesService.updateProfileById(userId, data);
  }
}
