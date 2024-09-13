import { Controller, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/busines-errors/business-errors.interceptor';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity/socio.entity';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';

@Controller('members')
export class SocioController {

    constructor(
        private readonly socioService: SocioService
    ){}
}
