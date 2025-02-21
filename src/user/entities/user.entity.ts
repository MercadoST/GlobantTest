import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @IsOptional()
  @ValidateNested()
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  profile?: CreateProfileDto;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
