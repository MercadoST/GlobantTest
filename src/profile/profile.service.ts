import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepository.create(createProfileDto);
    return this.profileRepository.save(profile);
  }

  async findAll(filter?: string): Promise<Profile[]> {
    if (filter) {
      return this.profileRepository
        .createQueryBuilder('profile')
        .where(
          'profile.profileName ILIKE :filter OR profile.code ILIKE :filter',
          {
            filter: `%${filter}%`,
          },
        )
        .getMany();
    }
    return this.profileRepository.find();
  }

  async findOne(id: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateProfileDto: Partial<CreateProfileDto>,
  ): Promise<Profile> {
    try {
      const result = (await this.profileRepository
        .createQueryBuilder()
        .update(Profile)
        .set(updateProfileDto)
        .where('id = :id', { id })
        .returning('*')
        .execute()) as { raw: Profile[] };

      if (!result.raw[0]) {
        throw new BadRequestException('Profile not found');
      }
      const updatedProfile = Object.assign(new Profile(), result.raw[0]);
      return updatedProfile;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
