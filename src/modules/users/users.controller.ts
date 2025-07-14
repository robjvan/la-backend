import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@ApiTags('Users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  public fetchAllUsers() {
    return this.usersService.fetchAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  public fetchUserById(@Param('id') id: number) {
    return this.usersService.fetchUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiBody({ type: 'object', description: 'User data to update' })
  public updateUserById(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return this.usersService.updateUserById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  public deactivateUserById(@Param('id') id: number) {
    return this.usersService.deactivateUserById(id);
  }
}
