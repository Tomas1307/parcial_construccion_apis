
import { IsNotEmpty,IsString,IsUrl,IsDate } from "class-validator";
import { Type } from "class-transformer";

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    readonly birthdate: Date;
}

