import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) { }

    @Post('submit')
    submit(@Request() req, @Body() submitDto: SubmitAssessmentDto) {
        return this.submissionsService.submitAssessment(req.user.userId, submitDto);
    }

    @Get('me')
    getMySubmissions(@Request() req) {
        return this.submissionsService.getMySubmissions(req.user.userId);
    }

    @Get('me/:id')
    getMySubmission(@Request() req, @Param('id') id: string) {
        return this.submissionsService.getSubmissionById(id, req.user.userId);
    }

    @Get('admin')
    @UseGuards(RolesGuard)
    @Roles('admin')
    getAllSubmissions(
        @Query('studentId') studentId?: string,
        @Query('assessmentId') assessmentId?: string
    ) {
        return this.submissionsService.getAllSubmissions({ studentId, assessmentId });
    }

    @Get('student/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    getStudentSubmissions(@Param('id') studentId: string) {
        return this.submissionsService.getSubmissionsByStudent(studentId);
    }
}
