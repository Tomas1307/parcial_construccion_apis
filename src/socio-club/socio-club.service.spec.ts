import { Test, TestingModule } from '@nestjs/testing';
import { SocioClubService } from './socio-club.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { ClubEntity } from '../club/club.entity/club.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];
  let socio: SocioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    clubsList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await clubRepository.save({
          name: faker.company.name(),
          foundingDate: faker.date.recent(),
          image: faker.image.url(),
          description: faker.lorem.paragraph(),
        })
        clubsList.push(club);
    }

    socio = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate(),
      clubs: clubsList
    })
  }

  it('addClubSocio should add a club to a socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(),
    });

    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate(),
    })

    const result: SocioEntity = await service.addClubSocio(newSocio.id, newClub.id);
    
    expect(result.clubs.length).toBe(1);
    expect(result.clubs[0]).not.toBeNull();
    expect(result.clubs[0].name).toBe(newClub.name);
    expect(result.clubs[0].foundingDate.getTime()).toBe(newClub.foundingDate.getTime());
    expect(result.clubs[0].image).toBe(newClub.image);
    expect(result.clubs[0].description).toBe(newClub.description)
  });

  it('addClubSocio should thrown exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate(),
    })

    await expect(() => service.addClubSocio(newSocio.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('addClubSocio should throw an exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(),
    });

    await expect(() => service.addClubSocio("0", newClub.id)).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('findClubBySocioIdClubId should return club by socio', async () => {
    const club: ClubEntity = clubsList[0];
    const storedClub: ClubEntity = await service.findClubBySocioIdClubId(socio.id, club.id)
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toBe(club.name);
    expect(storedClub.foundingDate.getTime()).toBe(club.foundingDate.getTime());
    expect(storedClub.image).toBe(club.image);
    expect(storedClub.description).toBe(club.description);

  });

  it('findClubBySocioIdClubId should throw an exception for an invalid club', async () => {
    await expect(() => service.findClubBySocioIdClubId(socio.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('findClubBySocioIdClubId should throw an exception for an invalid socio', async () => {
    const club: ClubEntity = clubsList[0]; 
    await expect(() => service.findClubBySocioIdClubId("0", club.id)).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('findClubBySocioIdClubId should throw an exception for a club not associated to the socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(),
    });

    await expect(() => service.findClubBySocioIdClubId(socio.id, newClub.id)).rejects.toHaveProperty("message", "The club with the given id is not associated to the socio"); 
  });

  it('findClubsBySocioId should return clubs by socio', async () => {
    const clubs: ClubEntity[] = await service.findClubsBySocioId(socio.id);
    expect(clubs.length).toBe(5);
  });

  it('findClubsBySocioId should throw an exception for an invalid socio', async () => {
    await expect(() => service.findClubsBySocioId("0")).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('associateClubsSocio should update clubs list for a socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph()
    });

    const updatedSocio: SocioEntity = await service.associateClubsSocio(socio.id, [newClub]);
    expect(updatedSocio.clubs.length).toBe(1);
    expect(updatedSocio.clubs[0].name).toBe(newClub.name);
    expect(updatedSocio.clubs[0].foundingDate).toBe(newClub.foundingDate);
    expect(updatedSocio.clubs[0].image).toBe(newClub.image);
    expect(updatedSocio.clubs[0].description).toBe(newClub.description);
  });

  it('associateClubsSocio should throw an exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph()
    });

    await expect(() => service.associateClubsSocio("0", [newClub])).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('associateClubsSocio should throw an exception for an invalid club', async () => {
    const newClub: ClubEntity = clubsList[0];
    newClub.id = "0";

    await expect(() => service.associateClubsSocio(socio.id, [newClub])).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('deleteClubFromSocio should remove a club from a socio', async () => {
    const club: ClubEntity = clubsList[0];
    
    await service.deleteClubSocio(socio.id, club.id);

    const storedSocio: SocioEntity = await socioRepository.findOne({where: {id: socio.id}, relations: ["clubs"]});
    const deletedClub: ClubEntity = storedSocio.clubs.find(c => c.id === club.id);

    expect(deletedClub).toBeUndefined();
  });

  it('deleteClubFromSocio should throw an exception for an invalid club', async () => {
    await expect(() => service.deleteClubSocio(socio.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('deleteClubFromSocio should throw an exception for an invalid socio', async () => {
    const club: ClubEntity = clubsList[0];
    await expect(() => service.deleteClubSocio("0", club.id)).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('deleteClubFromSocio should throw an exception for a non-associated club', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundingDate: faker.date.recent(),
      image: faker.image.url(),
      description: faker.lorem.paragraph()
    });

    await expect(() => service.deleteClubSocio(socio.id, newClub.id)).rejects.toHaveProperty("message", "The club with the given id is not associated to the socio"); 
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
