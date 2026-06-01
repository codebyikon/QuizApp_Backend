import { IsString, IsArray, IsNumber, IsOptional, IsMongoId, ValidateNested, ArrayMinSize, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionDto {
    @IsString()
    text: string;

    @IsArray()
    @ArrayMinSize(2)
    @IsString({ each: true })
    options: string[];

    @IsNumber()
    @Min(0)
    correctAnswer: number;
}

export class CreateAssessmentDto {
    @IsString()
    title: string;

    @IsMongoId()
    categoryId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    questions: QuestionDto[];

    @IsOptional()
    @IsNumber()
    @Min(1)
    duration?: number;

    @IsString()
    @IsEnum(['NCE I', 'NCE II', 'NCE III'])
    class_level: 'NCE I' | 'NCE II' | 'NCE III';
}
