import { ClubService } from './club.service';
import { ClubEntity } from './club.entity/club.entity';
import { Controller, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/busines-errors/business-errors.interceptor';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';

@Controller('clubs')
export class ClubController {

    constructor(
        private readonly clubService: ClubService
    ){}
}
