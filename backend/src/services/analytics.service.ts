
import prisma from '../lib/prisma.js'

const SUPPORT_THRESHOLD = 60

export async function getClassroomAnalytics(classroomId: string) {
  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      section: true,
      academicYear: true,
      students: {
        select: {
          id: true,
          fullName: true,
          rollNumber: true,
          quizResults: {
            select: {
              score: true,
              maxScore: true,
              takenAt: true,
            },
          },
          homeworkSubmissions: {
            select: {
              score: true,
              maxScore: true,
              submittedAt: true,
            },
          },
        },
      },
      homeworks: {
        select: { id: true },
      },
    },
  })

  if (!classroom) {
    return null
  }

  const quizResults = classroom.students.flatMap(
    (student) => student.quizResults,
  )

  const gradedHomework = classroom.students
    .flatMap((student) => student.homeworkSubmissions)
    .filter(
      (submission) =>
        submission.score !== null &&
        submission.maxScore !== null &&
        submission.maxScore > 0,
    )

  const quizPercentages = quizResults
    .filter((result) => result.maxScore > 0)
    .map((result) => (result.score / result.maxScore) * 100)

  const homeworkPercentages = gradedHomework.map(
    (submission) =>
      (submission.score! / submission.maxScore!) * 100,
  )

  const average = (values: number[]) =>
    values.length > 0
      ? Number(
          (
            values.reduce((sum, value) => sum + value, 0) /
            values.length
          ).toFixed(2),
        )
      : null

  const studentPerformance = classroom.students.map((student) => {
    const percentages = student.quizResults
      .filter((result) => result.maxScore > 0)
      .map((result) => (result.score / result.maxScore) * 100)

    const averageQuizPercentage = average(percentages)

    return {
      studentId: student.id,
      name: student.fullName,
      rollNumber: student.rollNumber,
      quizCount: percentages.length,
      averageQuizPercentage,
      needsSupport:
        averageQuizPercentage !== null &&
        averageQuizPercentage < SUPPORT_THRESHOLD,
    }
  })

  const totalStudents = classroom.students.length
  const totalHomework = classroom.homeworks.length
  const expectedSubmissions = totalStudents * totalHomework

  const submittedCount = classroom.students
    .flatMap((student) => student.homeworkSubmissions)
    .filter((submission) => submission.submittedAt !== null).length

  const completionRate =
    expectedSubmissions > 0
      ? Number(
          ((submittedCount / expectedSubmissions) * 100).toFixed(2),
        )
      : null

  return {
    classroom: {
      id: classroom.id,
      name: classroom.name,
      gradeLevel: classroom.gradeLevel,
      section: classroom.section,
      academicYear: classroom.academicYear,
    },
    summary: {
      totalStudents,
      totalQuizzes: quizResults.length,
      totalHomework,
      gradedHomeworkCount: gradedHomework.length,
      averageQuizPercentage: average(quizPercentages),
      averageHomeworkPercentage: average(homeworkPercentages),
      homeworkCompletionRate: completionRate,
      studentsNeedingSupport: studentPerformance.filter(
        (student) => student.needsSupport,
      ).length,
      supportThreshold: SUPPORT_THRESHOLD,
    },
    studentPerformance,
  }
}
