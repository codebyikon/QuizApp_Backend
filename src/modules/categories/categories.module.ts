import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Assessment, AssessmentSchema } from '../assessments/schemas/assessment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: Assessment.name, schema: AssessmentSchema }
        ]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule { }
