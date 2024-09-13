import { Injectable } from '@nestjs/common';
import { ClubEntity } from '../club/club.entity/club.entity';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { BusinessError } from '../shared/errors/business-errors';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';


@Injectable()
export class ClubSocioService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
 
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) {}

    async addSocioClub(clubId: string, socioId: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);

        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}})
        if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
   
        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
    }

    async findSocioByClubIdSocioId(clubId: string, socioId: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
       
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
   
        const clubSocio: SocioEntity = club.socios.find(e => e.id === socio.id);
   
        if (!clubSocio)
          throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)
   
        return clubSocio;
    }

    async findSociosByClubId(clubId: string): Promise<SocioEntity[]> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
       
        return club.socios;
    }

    async associateSociosClub(clubId: string, socios: SocioEntity[]): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
    
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < socios.length; i++) {
          const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}});
          if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        club.socios = socios;
        return await this.clubRepository.save(club);
    }

    async deleteSocioClub(clubId: string, socioId: string){
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
    
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
    
        const clubSocio: SocioEntity = club.socios.find(e => e.id === socio.id);
    
        if (!clubSocio)
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)
 
        club.socios = club.socios.filter(e => e.id !== socioId);
        await this.clubRepository.save(club);
    }
}
