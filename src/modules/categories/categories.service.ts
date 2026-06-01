import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Assessment, AssessmentDocument } from '../assessments/schemas/assessment.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
        @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const createdCategory = new this.categoryModel(createCategoryDto);
        return createdCategory.save();
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const updatedCategory = await this.categoryModel
            .findByIdAndUpdate(id, updateCategoryDto, { new: true })
            .exec();

        if (!updatedCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return updatedCategory;
    }

    async remove(id: string): Promise<Category> {
        const linkedAssessments = await this.assessmentModel.countDocuments({ categoryId: id });
        if (linkedAssessments > 0) {
            throw new ConflictException(`Cannot delete category because it is used by ${linkedAssessments} assessment(s). Please delete the assessments first.`);
        }

        const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!deletedCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return deletedCategory;
    }
}
