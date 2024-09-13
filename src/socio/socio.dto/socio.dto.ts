
import { IsNotEmpty,IsString,IsUrl,IsDate } from "class-validator";
export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsDate()
    @IsNotEmpty()
    readonly birthdate: Date;
}

