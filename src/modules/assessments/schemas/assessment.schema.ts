import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssessmentDocument = Assessment & Document;

export class Question {
    @Prop({ required: true })
    text: string;

    @Prop({ required: true, type: [String] })
    options: string[];

    @Prop({ required: true })
    correctAnswer: number;
}

@Schema({ timestamps: true })
export class Assessment {
    @Prop({ required: true })
    title: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    categoryId: Types.ObjectId;

    @Prop({ required: true, type: [Question] })
    questions: Question[];

    @Prop()
    duration: number; // in minutes

    @Prop({ required: true, enum: ['NCE I', 'NCE II', 'NCE III'] })
    class_level: string;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
