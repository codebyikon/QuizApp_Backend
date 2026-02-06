import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment, AssessmentDocument } from './schemas/assessment.schema';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Injectable()
export class AssessmentsService {
    constructor(@InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>) { }

    async create(createAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
        const createdAssessment = new this.assessmentModel(createAssessmentDto);
        return createdAssessment.save();
    }

    async findAll(): Promise<Assessment[]> {
        return this.assessmentModel.find().populate('categoryId').exec();
    }

    async findOne(id: string): Promise<Assessment> {
        const assessment = await this.assessmentModel.findById(id).populate('categoryId').exec();
        if (!assessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }

    async findByCategory(categoryId: string): Promise<Assessment[]> {
        return this.assessmentModel.find({ categoryId }).populate('categoryId').exec();
    }

    async update(id: string, updateAssessmentDto: UpdateAssessmentDto): Promise<Assessment> {
        const updatedAssessment = await this.assessmentModel
            .findByIdAndUpdate(id, updateAssessmentDto, { new: true })
            .populate('categoryId')
            .exec();

        if (!updatedAssessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }
        return updatedAssessment;
    }

    async remove(id: string): Promise<Assessment> {
        const deletedAssessment = await this.assessmentModel.findByIdAndDelete(id).exec();
        if (!deletedAssessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }
        return deletedAssessment;
    }
}
