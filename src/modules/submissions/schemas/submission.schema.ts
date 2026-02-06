import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    studentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Assessment', required: true })
    assessmentId: Types.ObjectId;

    @Prop({ required: true, type: [Number] })
    answers: number[];

    @Prop({ required: true })
    score: number;

    @Prop({ required: true })
    totalQuestions: number;

    @Prop({ default: Date.now })
    submittedAt: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
