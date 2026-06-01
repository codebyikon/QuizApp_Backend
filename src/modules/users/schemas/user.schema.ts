import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: ['student', 'admin'], default: 'student' })
    role: string;

    @Prop({ enum: ['male', 'female'], required: false })
    sex?: string;

    @Prop({ enum: ['NCE I', 'NCE II', 'NCE III'], required: false })
    class_level?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
