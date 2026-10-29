
import type { RequestHandler } from 'express'
import { z } from 'zod'
import {
  assignProctor,
  getProctorAssignment,
  removeProctorAssignment,
} from '../services/proctor.service.js'

const assignProctorSchema = z.object({
  studentId: z.string().trim().min(1),
  teacherId: z.string().trim().min(1),
})

const updateProctorSchema = z.object({
  teacherId: z.string().trim().min(1),
})

const studentIdSchema = z.string().trim().min(1)

export const createProctorAssignment: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const input = assignProctorSchema.parse(req.body)

    const assignment = await assignProctor(
      input.studentId,
      input.teacherId,
    )

    res.status(200).json({
      success: true,
      message: 'Proctor assigned successfully',
      data: { assignment },
    })
  } catch (error) {
    next(error)
  }
}

export const getStudentProctor: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const studentId = studentIdSchema.parse(req.params.studentId)
    const assignment = await getProctorAssignment(studentId)

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'No proctor assignment found for this student',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: { assignment },
    })
  } catch (error) {
    next(error)
  }
}

export const updateProctorAssignment: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const studentId = studentIdSchema.parse(req.params.studentId)
    const input = updateProctorSchema.parse(req.body)

    const assignment = await assignProctor(
      studentId,
      input.teacherId,
    )

    res.status(200).json({
      success: true,
      message: 'Proctor assignment updated successfully',
      data: { assignment },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProctorAssignment: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const studentId = studentIdSchema.parse(req.params.studentId)

    const result = await removeProctorAssignment(studentId)

    res.status(200).json({
      success: true,
      message: 'Proctor assignment removed successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
