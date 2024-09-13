import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity/club.entity';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];
  let club: ClubEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();

    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          birthdate: faker.date.birthdate(),
        })
        sociosList.push(socio);
    }

    club = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(1),
      socios: sociosList
    })
  }

  it('addSocioClub should add a socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate(),
    });

    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(1)
    })

    const result: ClubEntity = await service.addSocioClub(newClub.id, newSocio.id);
    
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].username).toBe(newSocio.username);
    expect(result.socios[0].email).toBe(newSocio.email);
    expect(result.socios[0].birthdate.getTime()).toBe(newSocio.birthdate.getTime());
  });

  it('addSocioClub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(1)
    })

    await expect(() => service.addSocioClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('addSocioClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate(),
    });

    await expect(() => service.addSocioClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findSocioByClubIdSocioId should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findSocioByClubIdSocioId(club.id, socio.id)
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.username).toBe(socio.username);
    expect(storedSocio.email).toBe(socio.email);
    expect(storedSocio.birthdate.getTime()).toBe(socio.birthdate.getTime());
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid socio', async () => {
    await expect(() => service.findSocioByClubIdSocioId(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0]; 
    await expect(() => service.findSocioByClubIdSocioId("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('findSocioByClubIdSocioId should throw an exception for a socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    });

    await expect(() => service.findSocioByClubIdSocioId(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club"); 
  });

  it('findSociosByClubId should return socios by club', async () => {
    const socios: SocioEntity[] = await service.findSociosByClubId(club.id);
    expect(socios.length).toBe(5);
  });

  it('findSociosByClubId should throw an exception for an invalid club', async () => {
    await expect(() => service.findSociosByClubId("0")).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('associateSociosClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    });

    const updatedClub: ClubEntity = await service.associateSociosClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);
    expect(updatedClub.socios[0].username).toBe(newSocio.username);
    expect(updatedClub.socios[0].email).toBe(newSocio.email);
    expect(updatedClub.socios[0].birthdate).toBe(newSocio.birthdate);
  });

  it('associateSociosClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    });

    await expect(() => service.associateSociosClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('associateSociosClub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";

    await expect(() => service.associateSociosClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('deleteSocioFromClub should remove a socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await service.deleteSocioClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    const deletedSocio: SocioEntity = storedClub.socios.find(c => c.id === socio.id);

    expect(deletedSocio).toBeUndefined();
  });

  it('deleteSocioFromClub should throw an exception for an invalid socio', async () => {
    await expect(() => service.deleteSocioClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('deleteSocioFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.deleteSocioClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('deleteSocioFromClub should throw an exception for a non-associated socio', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    });

    await expect(() => service.deleteSocioClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club"); 
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
