import { Controller, Post, Body, UseGuards, ConflictException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly usersService: UsersService) {}

    @Post('create-user')
    @ApiOperation({ summary: 'Create a new admin or student user (Admin only)' })
    async createUser(@Body() createUserDto: CreateUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const { password, ...result } = user.toObject();
        return result;
    }
}
