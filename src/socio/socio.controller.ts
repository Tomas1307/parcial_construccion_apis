import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity/socio.entity';
import { Controller, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/busines-errors/business-errors.interceptor';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { SocioDto } from './socio.dto/socio.dto';

@Controller('socios')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {

    constructor(
        private readonly socioService: SocioService
    ){}

    @Get()
    async findAll() {
      return await this.socioService.findAll();
    }
  
    @Get(':socioId')
    async findOne(@Param('socioId') socioId: string) {
      return await this.socioService.findOne(socioId);
    }
  
    @Post()
    async create(@Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.create(socio);
    }
  
    @Put(':socioId')
    async update(@Param('socioId') socioId: string, @Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.update(socioId, socio);
    }
  
    @Delete(':socioId')
    @HttpCode(204)
    async delete(@Param('socioId') socioId: string) {
      return await this.socioService.delete(socioId);
    }
  
}
