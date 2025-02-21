import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  profileName: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
