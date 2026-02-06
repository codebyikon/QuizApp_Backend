import { IsMongoId, IsArray, IsNumber } from 'class-validator';

export class SubmitAssessmentDto {
    @IsMongoId()
    assessmentId: string;

    @IsArray()
    @IsNumber({}, { each: true })
    answers: number[];
}
