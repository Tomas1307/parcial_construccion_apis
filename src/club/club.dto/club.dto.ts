import { IsNotEmpty,IsString,IsUrl,IsDate, isDate } from "class-validator";
import { Type } from "class-transformer";

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    foundingDate: Date;

    @IsUrl()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
