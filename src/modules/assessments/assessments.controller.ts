import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
    constructor(private readonly assessmentsService: AssessmentsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    create(@Body() createAssessmentDto: CreateAssessmentDto) {
        return this.assessmentsService.create(createAssessmentDto);
    }

    @Get()
    findAll(@Query('categoryId') categoryId?: string) {
        if (categoryId) {
            return this.assessmentsService.findByCategory(categoryId);
        }
        return this.assessmentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.assessmentsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
        return this.assessmentsService.update(id, updateAssessmentDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.assessmentsService.remove(id);
    }
}
