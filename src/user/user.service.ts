import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async getUserByEmail({ email }: { email: string }): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: { notes: true },
    });
  }

  async createUser({ email }: { email: string }): Promise<User> {
    const user = this.userRepository.create({ email });
    return await this.userRepository.save(user);
  }

  async deleteUser({ email }: { email: string }): Promise<void> {
    await this.userRepository.delete({ email });
  }
}
