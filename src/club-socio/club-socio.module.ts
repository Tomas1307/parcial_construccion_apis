import { Module } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from '../club/club.entity/club.entity';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ClubSocioService],
  imports: [TypeOrmModule.forFeature([ClubEntity,SocioEntity])]
})
export class ClubSocioModule {}
