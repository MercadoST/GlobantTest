import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Asegúrate de importar la entidad
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Importar el repositorio de User
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Exportar si otro módulo necesita este servicio
})
export class UserModule {}
