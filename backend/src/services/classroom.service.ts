 
import prisma from '../lib/prisma.js'

type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

interface CreateClassroomInput {
  name: string
  gradeLevel: string
  section?: string
  academicYear: string
}

 
export async function createClassroom(
  input: CreateClassroomInput,
  teacherId: string,
) {
  return prisma.classroom.create({
    data: {
      name: input.name,
      gradeLevel: input.gradeLevel,
      ...(input.section !== undefined
        ? { section: input.section }
        : {}),
      academicYear: input.academicYear,
      teacherId,
    },
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      section: true,
      academicYear: true,
      teacherId: true,
      createdAt: true,
    },
  })
}


export async function getClassrooms(userId: string, role: UserRole) {
  const where =
    role === 'ADMIN'
      ? {}
      : role === 'TEACHER'
        ? { teacherId: userId }
        : { students: { some: { userId } } }

  return prisma.classroom.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      section: true,
      academicYear: true,
      teacherId: true,
      createdAt: true,
      _count: {
        select: { students: true },
      },
    },
  })
}

// ---------------------------------------------------

// new

 interface UpdateClassroomInput {
  name?: string | undefined
  gradeLevel?: string | undefined
  section?: string | null | undefined
  academicYear?: string | undefined
}

export async function updateClassroom(
  classroomId: string,
  input: UpdateClassroomInput,
) {
  return prisma.classroom.update({
    where: { id: classroomId },
    data: {
      ...(input.name !== undefined
        ? { name: input.name }
        : {}),
      ...(input.gradeLevel !== undefined
        ? { gradeLevel: input.gradeLevel }
        : {}),
      ...(input.section !== undefined
        ? { section: input.section }
        : {}),
      ...(input.academicYear !== undefined
        ? { academicYear: input.academicYear }
        : {}),
    },
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      section: true,
      academicYear: true,
      teacherId: true,
      createdAt: true,
    },
  })
}

export async function deleteClassroom(classroomId: string) {
  return prisma.classroom.delete({
    where: { id: classroomId },
    select: {
      id: true,
      name: true,
      teacherId: true,
    },
  })
}
