import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(['student', 'admin'])
    role?: 'student' | 'admin';

    @IsOptional()
    @IsEnum(['male', 'female'])
    sex?: 'male' | 'female';

    @IsOptional()
    @IsEnum(['NCE I', 'NCE II', 'NCE III'])
    class_level?: 'NCE I' | 'NCE II' | 'NCE III';
}
