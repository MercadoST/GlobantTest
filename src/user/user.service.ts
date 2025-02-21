import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly profileService: ProfileService, // Servicio de perfiles
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { profile, ...userData } = createUserDto;

    if (!profile) {
      throw new BadRequestException('Profile is required');
    }
    try {
      const newProfile = await this.profileService.create(profile);
      const user = this.userRepository.create({
        ...userData,
        profile: newProfile,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating user or profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findAll(filter?: string): Promise<User[]> {
    if (filter) {
      return this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where(
          'user.name ILIKE :filter OR user.email ILIKE :filter OR profile.profileName ILIKE :filter',
          {
            filter: `%${filter}%`,
          },
        )
        .getMany();
    }
    return this.userRepository.find({
      relations: ['profile'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    try {
      const result = (await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateUserDto)
        .where('id = :id', { id })
        .returning('*')
        .execute()) as { raw: User[] };

      if (!result.raw[0]) {
        throw new BadRequestException('User not found');
      }
      const updatedProfile = Object.assign(new User(), result.raw[0]);
      return updatedProfile;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
