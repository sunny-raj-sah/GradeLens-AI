
// import api from './api'

// export interface Homework {
//   id: string
//   title: string
//   description?: string | null
//   dueDate?: string | null
//   classroomId: string
//   createdAt?: string
// }

// export interface CreateHomeworkInput {
//   title: string
//   description?: string
//   dueDate?: string
//   classroomId: string
// }

// export async function getHomeworkByClassroom(
//   classroomId: string,
// ): Promise<Homework[]> {
//   const response = await api.get(
//     `/homework/classroom/${classroomId}`,
//   )

//   const payload = response.data?.data ?? response.data

//   return payload?.homework ?? []
// }

// export async function createHomework(
//   input: CreateHomeworkInput,
// ): Promise<Homework> {
//   const response = await api.post('/homework', input)

//   const payload = response.data?.data ?? response.data

//   return payload?.homework ?? payload
// }

// // ------------------------------------

// // new

// export interface UpdateHomeworkInput {
//   title?: string
//   description?: string | null
//   dueDate?: string | null
// }

// export async function updateHomework(
//   homeworkId: string,
//   input: UpdateHomeworkInput,
// ): Promise<Homework> {
//   const response = await api.patch(
//     `/homework/${homeworkId}`,
//     input,
//   )

//   const payload = response.data?.data ?? response.data

//   return payload?.homework ?? payload
// }

// export async function deleteHomework(
//   homeworkId: string,
// ): Promise<void> {
//   await api.delete(`/homework/${homeworkId}`)
// }


// // FUTURE FEATURE — backend DELETE route does not exist yet.
// // Do not uncomment or call this until the backend supports deletion.
// //
// // export async function deleteHomework(
// //   homeworkId: string,
// // ): Promise<void> {
// //   await api.delete(`/homework/${homeworkId}`)
// // }
// -----------------------------------------

import api from './api'

export interface Homework {
  id: string
  title: string
  description?: string | null
  dueDate?: string | null
  classroomId: string
  createdAt?: string
}

export interface CreateHomeworkInput {
  title: string
  description?: string
  dueDate?: string
  classroomId: string
}

export interface UpdateHomeworkInput {
  title?: string
  description?: string | null
  dueDate?: string | null
}

// type HomeworkPayload =
//   | Homework
//   | Homework[]
//   | { homework?: Homework | Homework[] }
//   | { data?: unknown }
//   | null
//   | undefined

function unwrapResponse(data: unknown): unknown {
  if (
    typeof data === 'object' &&
    data !== null &&
    'data' in data
  ) {
    return (data as { data: unknown }).data
  }

  return data
}

function extractHomework(data: unknown): Homework {
  const payload = unwrapResponse(data)

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'homework' in payload
  ) {
    const homework = (payload as { homework: unknown }).homework

    if (
      typeof homework === 'object' &&
      homework !== null &&
      !Array.isArray(homework)
    ) {
      return homework as Homework
    }
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    !Array.isArray(payload)
  ) {
    return payload as Homework
  }

  throw new Error('The server returned an invalid homework response.')
}

function extractHomeworkList(data: unknown): Homework[] {
  const payload = unwrapResponse(data)

  if (Array.isArray(payload)) {
    return payload as Homework[]
  }

  if (typeof payload === 'object' && payload !== null) {
    if ('homework' in payload) {
      const homework = (payload as { homework: unknown }).homework

      if (Array.isArray(homework)) {
        return homework as Homework[]
      }
    }

    if ('items' in payload) {
      const items = (payload as { items: unknown }).items

      if (Array.isArray(items)) {
        return items as Homework[]
      }
    }
  }

  return []
}

export async function getHomeworkByClassroom(
  classroomId: string,
): Promise<Homework[]> {
  const response = await api.get(
    `/homework/classroom/${encodeURIComponent(classroomId)}`,
  )

  return extractHomeworkList(response.data)
}

export async function createHomework(
  input: CreateHomeworkInput,
): Promise<Homework> {
  const response = await api.post('/homework', input)

  return extractHomework(response.data)
}

export async function updateHomework(
  homeworkId: string,
  input: UpdateHomeworkInput,
): Promise<Homework> {
  const response = await api.patch(
    `/homework/${encodeURIComponent(homeworkId)}`,
    input,
  )

  return extractHomework(response.data)
}

export async function deleteHomework(
  homeworkId: string,
): Promise<void> {
  await api.delete(
    `/homework/${encodeURIComponent(homeworkId)}`,
  )
}

// -----------------------------------------------------------

// import api from "./api";

// export interface Homework {
//   id: string;
//   title: string;
//   description?: string | null;
//   dueDate?: string | null;
//   classroomId: string;
//   createdAt?: string;
// }

// export interface CreateHomeworkInput {
//   title: string;
//   description?: string;
//   dueDate?: string;
//   classroomId: string;
// }

// export interface UpdateHomeworkInput {
//   title?: string;
//   description?: string | null;
//   dueDate?: string | null;
// }

// /**
//  * Extracts the API payload.
//  * Supports responses shaped as:
//  * { data: { homework: ... } }
//  * or { homework: ... }
//  */
// function extractPayload(responseData: unknown): unknown {
//   if (
//     typeof responseData === "object" &&
//     responseData !== null &&
//     "data" in responseData
//   ) {
//     return responseData.data;
//   }

//   return responseData;
// }

// /**
//  * Fetch homework for a specific classroom.
//  */
// export async function getHomeworkByClassroom(
//   classroomId: string
// ): Promise<Homework[]> {
//   const response = await api.get(
//     `/homework/classroom/${encodeURIComponent(classroomId)}`
//   );

//   const payload = extractPayload(response.data);

//   if (
//     typeof payload === "object" &&
//     payload !== null &&
//     "homework" in payload
//   ) {
//     const homework = payload.homework;
//     return Array.isArray(homework) ? homework as Homework[] : [];
//   }

//   return Array.isArray(payload) ? payload as Homework[] : [];
// }

// /**
//  * Create homework.
//  */
// export async function createHomework(
//   input: CreateHomeworkInput
// ): Promise<Homework> {
//   const response = await api.post("/homework", input);
//   const payload = extractPayload(response.data);

//   if (
//     typeof payload === "object" &&
//     payload !== null &&
//     "homework" in payload
//   ) {
//     return payload.homework as Homework;
//   }

//   return payload as Homework;
// }

// /**
//  * Update existing homework.
//  */
// export async function updateHomework(
//   homeworkId: string,
//   input: UpdateHomeworkInput
// ): Promise<Homework> {
//   const response = await api.patch(
//     `/homework/${encodeURIComponent(homeworkId)}`,
//     input
//   );

//   const payload = extractPayload(response.data);

//   if (
//     typeof payload === "object" &&
//     payload !== null &&
//     "homework" in payload
//   ) {
//     return payload.homework as Homework;
//   }

//   return payload as Homework;
// }

// /**
//  * Delete homework.
//  */
// export async function deleteHomework(
//   homeworkId: string
// ): Promise<void> {
//   await api.delete(
//     `/homework/${encodeURIComponent(homeworkId)}`
//   );
// }
