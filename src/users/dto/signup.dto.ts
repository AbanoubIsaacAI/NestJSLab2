import { IsEmail, IsString, MinLength, Matches, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    @Matches(/^[a-zA-Z0-9]+$/, {
        message: 'Password must be alphanumeric',
    })
    password: string;

    @ApiProperty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsInt()
    @Min(16)
    @Max(60)
    age: number;

    @ApiProperty()
    @Matches(/^01\d{9}$/, {
        message: 'Mobile number must be 11 digits and start with 01',
    })
    mobileNumber: string;
}
