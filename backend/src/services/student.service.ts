
import prisma from '../lib/prisma.js'

interface CreateStudentInput {
  fullName: string
  rollNumber: string
  email?: string
  classroomId: string
}

export async function createStudent(input: CreateStudentInput) {
  return prisma.student.create({
    data: {
      fullName: input.fullName,
      rollNumber: input.rollNumber,
      ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
      classroomId: input.classroomId,
    },
    select: {
      id: true,
      fullName: true,
      rollNumber: true,
      email: true,
      classroomId: true,
      createdAt: true,
    },
  })
}

export async function getStudentsForClassroom(classroomId: string) {
  return prisma.student.findMany({
    where: { classroomId },
    orderBy: { rollNumber: 'asc' },
    select: {
      id: true,
      fullName: true,
      rollNumber: true,
      email: true,
      classroomId: true,
      createdAt: true,
    },
  })
}
