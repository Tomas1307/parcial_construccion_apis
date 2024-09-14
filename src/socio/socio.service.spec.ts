import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity/socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity =
        await repository.save({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          birthdate: faker.date.birthdate(),
        });
      sociosList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all members', async () => {
    const socios: SocioEntity[] =
      await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedSocio: SocioEntity =
      sociosList[0];
    const socio: SocioEntity = await service.findOne(
      storedSocio.id,
    );
    expect(socio).not.toBeNull();
    expect(socio.username).toEqual(storedSocio.username);
    expect(socio.email).toEqual(storedSocio.email);
    expect(socio.birthdate).toEqual(storedSocio.birthdate);
  });

  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('create should return a new member', async () => {
    const socio: SocioEntity = {
      id: '',
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate(),
      clubs: []
    };

    const newSocio: SocioEntity =
      await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity =
      await repository.findOne({ where: { id: newSocio.id } });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.username).toEqual(newSocio.username);
    expect(storedSocio.email).toEqual(newSocio.email);
    expect(storedSocio.birthdate).toEqual(newSocio.birthdate);
  });

  it('update should modify a member', async () => {
    const socio: SocioEntity =
      sociosList[0];
    socio.username = 'New name';

    const updatedSocio: SocioEntity =
      await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity =
      await repository.findOne({ where: { id: socio.id } });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.username).toEqual(socio.username);
  });

  it('update should throw an exception for an invalid member', async () => {
    let socio: SocioEntity =
      sociosList[0];
    socio = {
      ...socio,
      username: 'New name',
    };
    await expect(() =>
      service.update('0', socio),
    ).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('delete should remove a member', async () => {
    const socio: SocioEntity =
      sociosList[0];
    await service.delete(socio.id);

    const deletedSocio: SocioEntity =
      await repository.findOne({ where: { id: socio.id } });
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid member', async () => {
    const socio: SocioEntity =
      sociosList[0];
    await service.delete(socio.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });
});
