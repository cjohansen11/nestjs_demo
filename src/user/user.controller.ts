import {
  Controller,
  Get,
  HttpCode,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':email')
  @HttpCode(200)
  async getUser(@Param('email') email: string): Promise<User> {
    console.log({ email });
    const user = await this.userService.getUserByEmail({ email });
    await user;
    return user;
  }

  @Post()
  @HttpCode(201)
  addUser(@Body() { email }: CreateUserDto): Promise<User> {
    console.log('post', { email });
    return this.userService.createUser({ email });
  }

  @Delete(':email')
  @HttpCode(204)
  deleteUser(@Param('email') email: string): Promise<void> {
    return this.userService.deleteUser({ email });
  }
}
