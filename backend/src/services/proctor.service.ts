 
import prisma from '../lib/prisma.js'
import { Role } from '../generated/prisma/client.js'

function serviceError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode })
}

export async function assignProctor(
  studentId: string,
  teacherId: string,
) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true },
  })

  if (!student) {
    throw serviceError('Student not found', 404)
  }

  const teacher = await prisma.user.findFirst({
    where: {
      id: teacherId,
      role: Role.TEACHER,
    },
    select: { id: true },
  })

  if (!teacher) {
    throw serviceError('Teacher not found', 404)
  }

  await prisma.studentProctorAssignment.upsert({
    where: { studentId },
    update: { teacherId },
    create: { studentId, teacherId },
  })

  return getProctorAssignment(studentId)
}

export interface ProctorAssignment {
  studentId: string
  studentName: string
  studentEmail: string | null
  classroomId: string
  teacherId: string
  proctorName: string
  proctorEmail: string
  assignedAt: Date
}

export async function getProctorAssignment(
  studentId: string,
): Promise<ProctorAssignment | null> {
  const assignment =
    await prisma.studentProctorAssignment.findUnique({
      where: { studentId },
      select: {
        studentId: true,
        assignedAt: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        student: {
          select: {
            fullName: true,
            email: true,
            classroomId: true,
          },
        },
      },
    })

  if (!assignment || assignment.teacher.role !== Role.TEACHER) {
    return null
  }

  return {
    studentId: assignment.studentId,
    studentName: assignment.student.fullName,
    studentEmail: assignment.student.email,
    classroomId: assignment.student.classroomId,
    teacherId: assignment.teacher.id,
    proctorName: assignment.teacher.name,
    proctorEmail: assignment.teacher.email,
    assignedAt: assignment.assignedAt,
  }
}

export async function removeProctorAssignment(
  studentId: string,
) {
  const result = await prisma.studentProctorAssignment.deleteMany({
    where: { studentId },
  })

  if (result.count === 0) {
    throw serviceError(
      'No proctor assignment exists for this student',
      404,
    )
  }

  return { studentId }
}
