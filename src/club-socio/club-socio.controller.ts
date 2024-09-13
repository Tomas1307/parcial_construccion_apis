import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/busines-errors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from '../socio/socio.dto/socio.dto';
import { ClubDto } from '../club/club.dto/club.dto';
import { SocioEntity } from '../socio/socio.entity/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {

    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/socios/:socioId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
        return await this.clubSocioService.addMemberToClub(clubId, socioId);
    }

    @Get(':clubId/socios/:socioId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
        return await this.clubSocioService.findMemberFromClub(clubId, socioId);
    }

    @Get(':clubId/socios')
    async findMembersFromClub(@Param('clubId') clubId: string){
    return await this.clubSocioService.findMembersFromClub(clubId);
    }

    @Put(':clubId/socios')
    async updateMembersFromClub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string){
    const socios = plainToInstance(SocioEntity, sociosDto)
    return await this.clubSocioService.updateMembersFromClub(clubId, socios);
    }

    @Delete(':clubId/socios/:socioId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
    return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
    }

}