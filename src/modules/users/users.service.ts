import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async onModuleInit() {
        const adminExists = await this.userModel.findOne({ role: 'admin' }).exec();
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.userModel.create({
                name: 'Super Admin',
                email: 'admin@assessguard.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Super Admin User created: admin@assessguard.com / admin123');
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }
}
