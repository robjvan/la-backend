import { Body, Controller, Post, Req, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from './dto/new-user.dto';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dto/user-login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { NewPasswordDto } from './dto/new-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: NewUserDto })
  @ApiResponse({ status: 201, description: 'New user created' })
  public registerNewUser(@Body() data: NewUserDto, @Req() req: any) {
    return this.usersService.createNewUser(data, req.ip);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: 'Access token provided' })
  public login(@Body() data: UserLoginDto, @Req() req: any) {
    return this.authService.login(data, req.ip);
  }

  @Post('confirm-email/:token')
  @ApiOperation({ summary: 'Confirm user email address with token' })
  @ApiParam({ name: 'token', description: 'Email token', type: 'string' })
  public confirmEmailAddress(@Param('token') token: string) {
    return this.authService.confirmUserEmailByToken(token);
  }

  @Post('/forgot-password/:username')
  @ApiOperation({ summary: 'Start the forgot password workflow' })
  public startForgotPassWorkflow(@Param('username') username: string) {
    return this.authService.startForgotPassWorkflow(username);
  }

  @Patch('/forgot-password/:username')
  @ApiOperation({ summary: 'Submit token and new password' })
  public submitNewPassword(
    @Param('username') username: string,
    @Body() data: NewPasswordDto,
  ) {
    return this.authService.submitNewPassword(username, data);
  }
}
