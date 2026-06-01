export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'admin';
    sex?: 'male' | 'female';
    class_level?: 'NCE I' | 'NCE II' | 'NCE III';
}
