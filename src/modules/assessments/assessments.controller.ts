import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Assessments')
@ApiBearerAuth()
@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
    constructor(private readonly assessmentsService: AssessmentsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new assessment (Admin only)' })
    create(@Body() createAssessmentDto: CreateAssessmentDto) {
        return this.assessmentsService.create(createAssessmentDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all assessments or filter by category' })
    @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
    findAll(@Req() req: any, @Query('categoryId') categoryId?: string) {
        return this.assessmentsService.findAllFiltered(req.user, categoryId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get assessment by ID' })
    findOne(@Param('id') id: string) {
        return this.assessmentsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update an assessment (Admin only)' })
    update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
        return this.assessmentsService.update(id, updateAssessmentDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete an assessment (Admin only)' })
    remove(@Param('id') id: string) {
        return this.assessmentsService.remove(id);
    }
}
