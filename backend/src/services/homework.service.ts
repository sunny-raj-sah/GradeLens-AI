
import prisma from '../lib/prisma.js'

interface CreateHomeworkInput {
  title: string
  description?: string
  dueDate?: string
  classroomId: string
}

export async function createHomework(input: CreateHomeworkInput) {
  return prisma.homework.create({
    data: {
      title: input.title,
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: new Date(input.dueDate) }
        : {}),
      classroomId: input.classroomId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      classroomId: true,
      createdAt: true,
    },
  })
}

export async function getHomeworkForClassroom(classroomId: string) {
  return prisma.homework.findMany({
    where: { classroomId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      classroomId: true,
      createdAt: true,
      _count: {
        select: { submissions: true },
      },
    },
  })
}
// -----------------------------------------------

// new

interface UpdateHomeworkInput {
  title?: string
  description?: string | null
  dueDate?: Date | null
}

export async function updateHomework(
  homeworkId: string,
  input: UpdateHomeworkInput,
) {
  return prisma.homework.update({
    where: { id: homeworkId },
    data: {
      ...(input.title !== undefined
        ? { title: input.title }
        : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: input.dueDate }
        : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      classroomId: true,
      createdAt: true,
    },
  })
}

export async function deleteHomework(homeworkId: string) {
  return prisma.homework.delete({
    where: { id: homeworkId },
    select: {
      id: true,
      title: true,
      classroomId: true,
    },
  })
}
