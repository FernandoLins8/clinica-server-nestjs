import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { ProfessionalsModule } from './professionals/professionals.module';

@Module({
  imports: [AuthModule, UsersModule, ServicesModule, ProfessionalsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
