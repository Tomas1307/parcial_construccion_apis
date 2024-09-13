import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { ClubEntity } from '../club/club.entity/club.entity';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  providers: [SocioClubService],
  imports: [TypeOrmModule.forFeature([ClubEntity,SocioEntity])]
})
export class SocioClubModule {}
