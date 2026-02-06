import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Submissions')
@ApiBearerAuth()
@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) { }

    @Post('submit')
    @ApiOperation({ summary: 'Submit an assessment attempt' })
    submit(@Request() req, @Body() submitDto: SubmitAssessmentDto) {
        return this.submissionsService.submitAssessment(req.user.userId, submitDto);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current student submissions history' })
    getMySubmissions(@Request() req) {
        return this.submissionsService.getMySubmissions(req.user.userId);
    }

    @Get('me/:id')
    @ApiOperation({ summary: 'Get a specific submission details by ID (Owner only)' })
    getMySubmission(@Request() req, @Param('id') id: string) {
        return this.submissionsService.getSubmissionById(id, req.user.userId);
    }

    @Get('admin')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'View all submissions (Admin only)' })
    @ApiQuery({ name: 'studentId', required: false })
    @ApiQuery({ name: 'assessmentId', required: false })
    getAllSubmissions(
        @Query('studentId') studentId?: string,
        @Query('assessmentId') assessmentId?: string
    ) {
        return this.submissionsService.getAllSubmissions({ studentId, assessmentId });
    }

    @Get('student/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get submissions for a specific student (Admin only)' })
    getStudentSubmissions(@Param('id') studentId: string) {
        return this.submissionsService.getSubmissionsByStudent(studentId);
    }
}
