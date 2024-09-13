import { IsNotEmpty,IsString,IsUrl,IsDate, isDate } from "class-validator";


export class ClubDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsDate()
    @IsNotEmpty()
    foundingDate: Date;

    @IsUrl()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
