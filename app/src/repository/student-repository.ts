/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from "@/src/database";
import { Student } from "@/src/domain/student";


/////////////////////////////
///  REPOSITORY SECTION   ///
/////////////////////////////
/**
 * Repository for managing student profiles and related data
 * Handles all database operations specific to student accounts
 */
export class StudentRepository {
    /**
     * Creates a new student profile linked to an existing user
     *
     * @param data - Object containing the required student fields
     * @param data.userId - The unique ID of the associated User record
     * @param data.studyProgram - Optional study program name
     * @param data.yearOfStudy - Optional current year of study (1-5)
     * @param data.studentId - Optional university student identification number
     * @param data.bio - Optional biography text
     * @param data.skills - Optional array of skills
     * @param data.interests - Optional array of interests
     * @param data.resumeUrl - Optional URL to uploaded resume
     * @returns The created Student record with generated ID and timestamps
     */
    async create(data: {
        userId: string;
        studyProgram?: string;
        yearOfStudy?: number;
        studentId?: string;
        bio?: string;
        skills?: string[];
        interests?: string[];
        resumeUrl?: string;
    }): Promise<Student> {
        return prisma.student.create({
            data: {
                userId: data.userId,
                studyProgram: data.studyProgram,
                yearOfStudy: data.yearOfStudy,
                studentId: data.studentId,
                bio: data.bio,
                skills: data.skills || [],
                interests: data.interests || [],
                resumeUrl: data.resumeUrl,
            }
        });
    }

    /**
     * Finds a student by their unique ID
     *
     * @param id - The unique identifier (CUID) of the student
     * @returns The Student record or null if not found
     */
    async findById(id: string): Promise<Student | null> {
        return prisma.student.findUnique({ where: { id } });
    }

    /**
     * Finds a student by their associated user ID
     *
     * @param userId - The unique identifier of the associated User
     * @returns The Student record or null if not found
     */
    async findByUserId(userId: string): Promise<Student | null> {
        return prisma.student.findUnique({ where: { userId } });
    }

    /**
     * Retrieves all students with optional filtering and pagination
     *
     * @param options - Optional query parameters
     * @param options.studyProgram - Filter by study program
     * @param options.yearOfStudy - Filter by year of study
     * @param options.skip - Number of records to skip (pagination)
     * @param options.take - Number of records to retrieve (pagination)
     * @param options.includeUser - Whether to include related User data
     * @returns Array of Student records matching the criteria
     */
    async findAll(options?: {
        studyProgram?: string;
        yearOfStudy?: number;
        skip?: number;
        take?: number;
        includeUser?: boolean;
    }): Promise<Student[]> {
        return prisma.student.findMany({
            where: {
                studyProgram: options?.studyProgram,
                yearOfStudy: options?.yearOfStudy,
            },
            skip: options?.skip,
            take: options?.take,
            include: options?.includeUser ? { user: true } : undefined,
        });
    }

    /**
     * Updates a student's profile by their ID
     *
     * @param id - The unique identifier of the student to update
     * @param data - Partial student data containing only the fields to update
     * @returns The updated Student record with new timestamps
     */
    async updateById(id: string, data: Partial<Student>): Promise<Student> {
        return prisma.student.update({ where: { id }, data });
    }

    /**
     * Deletes a student by their ID
     * Related user will be preserved due to onDelete: Cascade on userId
     *
     * @param id - The unique identifier of the student to delete
     */
    async deleteById(id: string): Promise<void> {
        await prisma.student.delete({ where: { id } });
    }

    /**
     * Gets total count of students with optional filtering
     *
     * @param options - Optional filter parameters
     * @param options.studyProgram - Filter by study program
     * @param options.yearOfStudy - Filter by year of study
     * @returns Total count of students matching the criteria
     */
    async count(options?: {
        studyProgram?: string;
        yearOfStudy?: number;
    }): Promise<number> {
        return prisma.student.count({
            where: {
                studyProgram: options?.studyProgram,
                yearOfStudy: options?.yearOfStudy,
            }
        });
    }
}