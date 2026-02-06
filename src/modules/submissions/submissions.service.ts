import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { AssessmentsService } from '../assessments/assessments.service';

@Injectable()
export class SubmissionsService {
    constructor(
        @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
        private assessmentsService: AssessmentsService
    ) { }

    async submitAssessment(studentId: string, submitDto: SubmitAssessmentDto): Promise<Submission> {
        // Fetch the assessment
        const assessment = await this.assessmentsService.findOne(submitDto.assessmentId);

        if (!assessment) {
            throw new NotFoundException('Assessment not found');
        }

        // Validate answers length
        if (submitDto.answers.length !== assessment.questions.length) {
            throw new BadRequestException('Number of answers does not match number of questions');
        }

        // Calculate score
        let correctAnswers = 0;
        assessment.questions.forEach((question, index) => {
            if (question.correctAnswer === submitDto.answers[index]) {
                correctAnswers++;
            }
        });

        const score = correctAnswers;
        const totalQuestions = assessment.questions.length;

        // Create submission
        const submission = new this.submissionModel({
            studentId,
            assessmentId: submitDto.assessmentId,
            answers: submitDto.answers,
            score,
            totalQuestions,
            submittedAt: new Date()
        });

        return submission.save();
    }

    async getMySubmissions(studentId: string): Promise<Submission[]> {
        return this.submissionModel
            .find({ studentId })
            .populate('assessmentId')
            .sort({ submittedAt: -1 })
            .exec();
    }

    async getSubmissionById(id: string, studentId: string): Promise<Submission> {
        const submission = await this.submissionModel
            .findOne({ _id: id, studentId })
            .populate('assessmentId')
            .exec();

        if (!submission) {
            throw new NotFoundException('Submission not found');
        }

        return submission;
    }

    async getAllSubmissions(filters?: { studentId?: string; assessmentId?: string }): Promise<Submission[]> {
        const query: any = {};
        if (filters?.studentId) query.studentId = filters.studentId;
        if (filters?.assessmentId) query.assessmentId = filters.assessmentId;

        return this.submissionModel
            .find(query)
            .populate('studentId', 'name email')
            .populate({
                path: 'assessmentId',
                populate: { path: 'categoryId' }
            })
            .sort({ submittedAt: -1 })
            .exec();
    }

    async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
        return this.submissionModel
            .find({ studentId })
            .populate('assessmentId')
            .sort({ submittedAt: -1 })
            .exec();
    }
}
