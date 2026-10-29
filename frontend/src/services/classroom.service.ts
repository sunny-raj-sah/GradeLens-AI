
// import api from './api'

// export interface Classroom {
//   id: string
//   name: string
//   gradeLevel: string
//   section?: string | null
//   academicYear: string
// }

// export interface CreateClassroomInput {
//   name: string
//   gradeLevel: string
//   section?: string
//   academicYear: string
// }

// interface ApiResponse<T> {
//   success: boolean
//   message?: string
//   data: T
// }


// export interface UpdateClassroomInput {
//   name?: string
//   gradeLevel?: string
//   section?: string | null
//   academicYear?: string
// }


// function unwrap<T>(responseData: T | ApiResponse<T>): T {
//   if (
//     typeof responseData === 'object' &&
//     responseData !== null &&
//     'success' in responseData &&
//     'data' in responseData
//   ) {
//     return (responseData as ApiResponse<T>).data
//   }

//   return responseData as T
// }

 
// export async function getClassrooms(): Promise<Classroom[]> {
//   const response = await api.get('/classrooms')
//   const result = unwrap<{ classrooms: Classroom[] } | Classroom[]>(
//     response.data,
//   )

//   return Array.isArray(result) ? result : result.classrooms
// }


 
// export async function createClassroom(
//   input: CreateClassroomInput,
// ): Promise<Classroom> {
//   const response = await api.post('/classrooms', input)

//   const result = unwrap<
//     Classroom | { classroom: Classroom }
//   >(response.data)

//   return 'classroom' in result ? result.classroom : result
// }

// // -----------------------------------------------
// // new


// export async function updateClassroom(
//   classroomId: string,
//   input: UpdateClassroomInput,
// ): Promise<Classroom> {
//   const response = await api.patch(
//     `/classrooms/${classroomId}`,
//     input,
//   )

//   const result = unwrap<
//     Classroom | { classroom: Classroom }
//   >(response.data)

//   return 'classroom' in result ? result.classroom : result
// }

// export async function deleteClassroom(
//   classroomId: string,
// ): Promise<void> {
//   await api.delete(`/classrooms/${classroomId}`)
// }
// ----------------------------------------------------


import api from './api'

export interface Classroom {
  id: string
  name: string
  gradeLevel: string
  section?: string | null
  academicYear: string
  teacherId?: string
}

export interface CreateClassroomInput {
  name: string
  gradeLevel: string
  section?: string
  academicYear: string
  teacherId?: string
}

export interface UpdateClassroomInput {
  name?: string
  gradeLevel?: string
  section?: string | null
  academicYear?: string
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

function unwrap<T>(responseData: T | ApiResponse<T>): T {
  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'success' in responseData &&
    'data' in responseData
  ) {
    return (responseData as ApiResponse<T>).data
  }

  return responseData as T
}

export async function getClassrooms(): Promise<Classroom[]> {
  const response = await api.get('/classrooms')

  const result = unwrap<
    { classrooms: Classroom[] } | Classroom[]
  >(response.data)

  return Array.isArray(result) ? result : result.classrooms
}

export async function createClassroom(
  input: CreateClassroomInput,
): Promise<Classroom> {
  const response = await api.post('/classrooms', input)

  const result = unwrap<
    Classroom | { classroom: Classroom }
  >(response.data)

  return 'classroom' in result ? result.classroom : result
}

export async function updateClassroom(
  classroomId: string,
  input: UpdateClassroomInput,
): Promise<Classroom> {
  const response = await api.patch(
    `/classrooms/${classroomId}`,
    input,
  )

  const result = unwrap<
    Classroom | { classroom: Classroom }
  >(response.data)

  return 'classroom' in result ? result.classroom : result
}

export async function deleteClassroom(
  classroomId: string,
): Promise<void> {
  await api.delete(`/classrooms/${classroomId}`)
}
