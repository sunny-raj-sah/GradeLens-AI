
import prisma from '../lib/prisma.js'

interface CreateQuizResultInput {
  quizName: string
  score: number
  maxScore: number
  studentId: string
    needsSupport: boolean
}

export async function createQuizResult(input: CreateQuizResultInput) {
  return prisma.quizResult.create({
    data: {
      quizName: input.quizName,
      score: input.score,
      maxScore: input.maxScore,
      studentId: input.studentId,
      needsSupport: input.needsSupport,
    },
    select: {
      id: true,
      quizName: true,
      score: true,
      maxScore: true,
      needsSupport: true,
      takenAt: true,
      studentId: true,
      createdAt: true,
    },
  })
}

export async function getQuizResultsForStudent(studentId: string) {
  return prisma.quizResult.findMany({
    where: { studentId },
    orderBy: { takenAt: 'desc' },
    select: {
      id: true,
      quizName: true,
      score: true,
      maxScore: true,
      needsSupport: true,
      takenAt: true,
      studentId: true,
    },
  })
}
// ---------------------------------------------
// new 


interface UpdateQuizResultInput {
  quizName?: string
  score?: number
  maxScore?: number
  takenAt?: Date
    needsSupport?: boolean
}

export async function updateQuizResult(
  resultId: string,
  input: UpdateQuizResultInput,
) {
  return prisma.quizResult.update({
    where: { id: resultId },
    data: {
      ...(input.quizName !== undefined
        ? { quizName: input.quizName }
        : {}),
      ...(input.score !== undefined
        ? { score: input.score }
        : {}),
      ...(input.maxScore !== undefined
        ? { maxScore: input.maxScore }
        : {}),
      ...(input.takenAt !== undefined
        ? { takenAt: input.takenAt }
        : {}),

        ...(input.needsSupport !== undefined
  ? { needsSupport: input.needsSupport }
  : {}),
    },
    select: {
      id: true,
      quizName: true,
      score: true,
      maxScore: true,
      needsSupport: true,
      takenAt: true,
      studentId: true,
      createdAt: true,
    },
  })
}

export async function deleteQuizResult(resultId: string) {
  return prisma.quizResult.delete({
    where: { id: resultId },
    select: {
      id: true,
      quizName: true,
      studentId: true,
    },
  })
}
