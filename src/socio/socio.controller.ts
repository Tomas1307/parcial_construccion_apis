import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity/socio.entity';
import { Controller, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/busines-errors/business-errors.interceptor';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { SocioDto } from './socio.dto/socio.dto';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {

    constructor(
        private readonly socioService: SocioService
    ){}

    @Get()
    async findAll() {
      return await this.socioService.findAll();
    }
  
    @Get(':memberId')
    async findOne(@Param('memberId') socioId: string) {
      return await this.socioService.findOne(socioId);
    }
  
    @Post()
    async create(@Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.create(socio);
    }
  
    @Put(':memberId')
    async update(@Param('memberId') socioId: string, @Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.update(socioId, socio);
    }
  
    @Delete(':memberId')
    @HttpCode(204)
    async delete(@Param('memberId') socioId: string) {
      return await this.socioService.delete(socioId);
    }
  
}
