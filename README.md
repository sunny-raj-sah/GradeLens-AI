::: {align="center"}
# GradeLens AI

### AI-Powered Education Management & Learning Analytics

**A full-stack platform for managing classrooms, student records,
homework submissions, quiz performance, and AI-assisted educational
insights.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Frontend%20%26%20Backend-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
:::

------------------------------------------------------------------------

## Overview

**GradeLens AI** is a full-stack education management application built
to bring classroom administration and learning-performance insights into
one workspace. It provides dedicated workflows for teachers and
administrators to manage students, classrooms, homework, submissions,
quiz results, and analytics, alongside an AI assistant for
education-related questions.

The project is built with **React and TypeScript** on the frontend and
**Node.js, Express, Prisma, and PostgreSQL** on the backend. AI
functionality is integrated through the Groq API, with credentials kept
on the server side.

> **Project status:** In active development. This README describes the
> current project direction and the workflows known to be implemented.
> Verify current deployment links, environment variable names, and API
> routes against the repository before publishing.

## Why GradeLens AI?

Education data can be spread across student lists, classroom records,
homework, and quiz results. GradeLens AI aims to provide a more
connected workflow so authorized users can manage those records and
review student performance from a single interface.

-   **Unified workspace:** Navigate between classroom, student,
    homework, submission, quiz, and analytics modules.
-   **Student-focused workflows:** Find student records and inspect
    individual student details from relevant screens.
-   **Submission management:** Select homework, search for students,
    record scores and feedback, and refresh submission records.
-   **Performance visibility:** Review quiz scores and related analytics
    in a dedicated interface.
-   **AI-assisted interaction:** Use an AI assistant for supported
    education-related questions.
-   **Authentication-aware routing:** Keep application pages behind
    authentication checks and enforce permissions at the API layer.
-   **Modern TypeScript stack:** Use TypeScript across the frontend and
    backend for clearer contracts and maintainability.

## Features

### Dashboard & navigation

-   Authenticated dashboard and application layout.
-   Navigation to the main education-management modules.
-   Shared layout components for a consistent user experience.

### Classroom & student management

-   Dedicated classroom and student pages.
-   Student lookup and student-detail views.
-   Support for navigating to student details from relevant workflows.

### Homework & submissions

-   Homework management interface.
-   Submission workflow connected to classroom and homework selection.
-   Debounced student search by name, roll number, or student ID.
-   Score, maximum-score, and feedback entry.
-   Submission records refresh after successful save.
-   Backend access checks for supported submission endpoints.

### Quiz results & analytics

-   Dedicated quiz-results page.
-   Quiz score and maximum-score details.
-   Analytics interface for reviewing quiz-performance data.
-   Student-detail inspection from the analytics workflow.

### AI assistant

-   AI-assisted interface for supported education-related queries.
-   Backend integration with Groq.
-   Provider credentials remain server-side rather than being exposed
    through frontend variables.

### Landing page & authentication

-   Public landing page at `/`.
-   Sign-in and registration dialogs from the landing page.
-   Standalone `/login` and `/register` routes for direct access.
-   Role-specific demo-login buttons that can prefill configured
    demo-account credentials.
-   Protected application routes for authenticated users.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React, TypeScript       Component-based user
                                                  interface

  Build tooling           Vite                    Frontend development
                                                  and production builds

  UI & icons              Bootstrap, Lucide React Responsive styling and
                                                  interface icons

  Routing                 React Router            Client-side navigation
                                                  and protected routes

  Backend                 Node.js, Express,       HTTP API and
                          TypeScript              server-side application
                                                  logic

  Database                PostgreSQL              Persistent application
                                                  data

  ORM                     Prisma                  Database schema,
                                                  migrations, and data
                                                  access

  Database hosting        Neon                    Hosted PostgreSQL for
                                                  development

  AI integration          Groq API                AI-powered
                                                  functionality

  Development             npm, tsx, TypeScript    Package management,
                                                  execution, and type
                                                  checking
  -----------------------------------------------------------------------

> The exact versions and scripts are defined in the `package.json` files
> in `frontend/` and `backend/`.

## Architecture

``` text
Browser
   |
   v
React + TypeScript + Vite
   |
   | HTTP requests
   v
Node.js + Express + TypeScript API
   |
   +------ Authentication & authorization
   |
   +------ Application services
   |          |
   |          +------ Prisma ORM ------> PostgreSQL / Neon
   |
   +------ AI integration ------------> Groq API
```

### Request flow

1.  A user interacts with the React frontend.
2.  The frontend service layer sends an HTTP request to the Express API.
3.  The backend validates authentication and checks authorization for
    protected operations.
4.  Prisma reads or writes application data in PostgreSQL.
5.  AI-related requests call the configured provider from the backend
    when needed.
6.  The API returns a response for the frontend to render.

**Security principle:** Frontend route guards improve navigation and
user experience, but the backend must independently enforce
authentication, role permissions, and data access scope.

## Application Modules

  -----------------------------------------------------------------------
  Module                              Responsibility
  ----------------------------------- -----------------------------------
  Dashboard                           Main authenticated workspace and
                                      entry point

  Classrooms                          Classroom-management workflows

  Students                            Student records, lookup, and detail
                                      views

  Teachers                            Teacher-management workflows

  Homework                            Homework management and navigation
                                      into submissions

  Submissions                         Student search, submission entry,
                                      scores, feedback, and record
                                      retrieval

  Quiz Results                        Quiz-result and score details

  Analytics                           Review of quiz-performance
                                      information and student details

  AI Assistant                        AI-assisted education-related
                                      interaction

  Authentication                      Login, registration, session state,
                                      and protected navigation
  -----------------------------------------------------------------------

## Project Structure

The following structure highlights the main areas of the application.
Individual files may evolve as development continues.

``` text
GradeLens-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── analytics/
│   │   │   ├── classrooms/
│   │   │   ├── dashboard/
│   │   │   ├── homework/
│   │   │   ├── quizzes/
│   │   │   ├── students/
│   │   │   ├── submissions/
│   │   │   ├── teachers/
│   │   │   └── ai-assistant/
│   │   └── services/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) --- Node.js 20.x has been used for
    development.
-   npm --- installed with Node.js.
-   A PostgreSQL database --- the development setup uses Neon.
-   A Groq API key --- required for AI functionality that calls Groq.
-   Git --- to clone and manage the repository.

### 1. Clone the repository

Replace the placeholder with the actual GradeLens AI repository URL:

``` bash
git clone <YOUR_REPOSITORY_URL>
cd GradeLens-AI
```

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create `backend/.env` and add the values required by the current backend
configuration. See [Environment Variables](#environment-variables) for
an example.

### 4. Generate Prisma Client and apply migrations

From the `backend/` directory:

``` bash
npx prisma generate
npx prisma migrate dev
```

Use the repository's existing migration workflow. If migrations are
already committed, apply them rather than creating an unrelated new
migration.

### 5. Start the backend

Run the development command defined in `backend/package.json`. If the
package defines a `dev` script:

``` bash
npm run dev
```

The local API has been run at:

``` text
http://localhost:5000
```

### 6. Install frontend dependencies

Open a **second terminal** from the project root:

``` bash
cd frontend
npm install
```

### 7. Configure the frontend

Set the backend API base URL using the variable expected by the frontend
API client. For example, if the client uses `VITE_API_URL`, create
`frontend/.env`:

``` dotenv
VITE_API_URL=http://localhost:5000
```

Do not add a new variable if the existing API client uses a different
name.

### 8. Start the frontend

``` bash
npm run dev
```

Open the local URL printed by Vite. The development frontend has been
run at:

``` text
http://localhost:5173
```

### 9. Sign in

Open the landing page and use an account created through registration or
the project's database seed/setup process. Demo buttons only work when
their corresponding accounts and credentials have been configured in the
database.

## Environment Variables

Variable names depend on the current source code. Confirm the exact
names in the backend configuration and frontend API client before using
these examples.

### Backend --- `backend/.env`

``` dotenv
# PostgreSQL connection string for the application
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"

# Optional direct connection string for migration/development workflows
DATABASE_URL_UNPOOLED="YOUR_DIRECT_POSTGRESQL_CONNECTION_STRING"

# Authentication secret, if used by the current implementation
JWT_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"

# Groq API key, if this is the name used by the backend
GROQ_API_KEY="YOUR_GROQ_API_KEY"

# Server port, if configurable
PORT=5000
```

### Frontend --- `frontend/.env`

``` dotenv
# Example only: use the variable name expected by the frontend API client
VITE_API_URL="http://localhost:5000"
```

  -----------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- -----------------------------------
  `DATABASE_URL`                      PostgreSQL connection used by
                                      Prisma

  `DATABASE_URL_UNPOOLED`             Optional direct database connection
                                      for supported workflows

  `JWT_SECRET`                        Signs/verifies tokens when JWT
                                      authentication is configured

  `GROQ_API_KEY`                      Authenticates backend requests to
                                      Groq

  `PORT`                              Configures the backend port when
                                      supported

  `VITE_API_URL`                      Configures the frontend API base
                                      URL if the client uses this name
  -----------------------------------------------------------------------

**Never commit real credentials.** Variables prefixed with `VITE_` are
exposed to browser-side code and must not contain secrets.

## Database & Prisma

GradeLens AI uses PostgreSQL with Prisma. The development database has
been hosted on Neon.

Common commands, run from `backend/`:

``` bash
# Generate Prisma Client
npx prisma generate

# Validate the Prisma schema
npx prisma validate

# Check migration status
npx prisma migrate status

# Apply/create development migrations as appropriate
npx prisma migrate dev

# Open the local database browser
npx prisma studio
```

Use the direct or pooled Neon connection string according to the
operation and the project's Prisma configuration. Do not run destructive
database commands against a shared or production database without
reviewing their impact first.

## Authentication & Authorization

The frontend includes an authentication context and protected-route
handling. Signed-out users should be sent to the public landing page
when attempting to access protected application routes. Logout should
clear the current session and return the user to `/`.

Authorization must be enforced by the backend for every protected
resource. A hidden navigation link or a disabled frontend button is not
a security boundary.

Recommended checks:

-   Unauthenticated requests cannot access protected API endpoints.
-   Invalid, expired, or missing tokens are rejected.
-   Users can access only records permitted by their role and assigned
    scope.
-   Student and classroom data are filtered on the server.
-   Logout clears the frontend authentication state and any relevant
    persisted credentials.
-   Demo accounts use synthetic data and limited permissions.

## Known Submission API Routes

The following submission endpoints are known in the current project
context. Confirm request bodies, response formats, and any changes
against the backend route/controller code.

  -----------------------------------------------------------------------------------------------
  Method            Endpoint                                  Purpose           Access
  ----------------- ----------------------------------------- ----------------- -----------------
  `POST`            `/api/submissions`                        Create a          Authenticated
                                                              submission record `ADMIN` or
                                                                                `TEACHER`

  `GET`             `/api/submissions/homework/:homeworkId`   Retrieve          Authenticated
                                                              submissions for a `ADMIN` or
                                                              homework item     `TEACHER`
  -----------------------------------------------------------------------------------------------

The submission workflow includes selecting a classroom and homework
item, finding a student, entering score and feedback, and refreshing
records after saving. Do not assume persistent edit/delete functionality
exists unless the relevant API endpoints are implemented and verified.

## API Overview

The backend provides API functionality for application areas such as:

-   Authentication and current-user information
-   Classrooms and students
-   Teachers
-   Homework and submissions
-   Quiz results and analytics
-   AI assistant interactions

For exact endpoint paths, request schemas, validation rules, and
response structures, refer to the current Express route files and
controllers. Use an API client such as
[Postman](https://www.postman.com/) to test both successful and rejected
requests.

## Build & Verification

### Frontend production build

``` bash
cd frontend
npm install
npm run build
```

The frontend build runs the checks configured by the project and
produces production assets in `frontend/dist/`.

If the package includes a preview script, you can test the production
build locally:

``` bash
npm run preview
```

### Backend development server

``` bash
cd backend
npm install
npm run dev
```

The exact command depends on the scripts defined in
`backend/package.json`.

### Manual verification checklist

-   [ ] Frontend production build completes successfully.
-   [ ] Backend starts and connects to PostgreSQL.
-   [ ] Prisma schema validation and migrations succeed.
-   [ ] Login, registration, and logout work.
-   [ ] Signed-out users are redirected to the landing page for
    protected routes.
-   [ ] Classroom, student, homework, quiz, and analytics data load
    correctly.
-   [ ] Authorized users can create and retrieve submissions.
-   [ ] Unauthorized users cannot access protected endpoints.
-   [ ] AI requests handle missing configuration and provider errors
    gracefully.
-   [ ] No secrets or real student data are committed to version
    control.

## Troubleshooting

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}Frontend cannot connect to the
backend`</strong>`{=html}
```{=html}
</summary>
```
-   Confirm the backend server is running.
-   Verify the API base URL and variable name used by the frontend.
-   Check backend CORS configuration.
-   Inspect the browser's Network tab and the backend logs for the
    failing request.

```{=html}
</details>
```
```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}Prisma or database connection errors`</strong>`{=html}
```{=html}
</summary>
```
-   Confirm `DATABASE_URL` is correct and the Neon database is
    reachable.
-   Check whether the operation requires a pooled or direct connection
    string.
-   Run `npx prisma validate` and `npx prisma migrate status` from
    `backend/`.
-   Regenerate Prisma Client after schema changes.

```{=html}
</details>
```
```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}Logout or protected routes redirect
incorrectly`</strong>`{=html}
```{=html}
</summary>
```
-   Review `frontend/src/components/common/ProtectedRoute.tsx`.
-   Review `frontend/src/components/layout/Topbar.tsx`.
-   Check authentication state and navigation in `AuthContext.tsx`,
    `Login.tsx`, and `Register.tsx`.
-   The intended landing-page URL is `/`.

```{=html}
</details>
```
```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}AI assistant requests fail`</strong>`{=html}
```{=html}
</summary>
```
-   Confirm the Groq key is configured on the backend using the variable
    name expected by the source.
-   Inspect server logs for provider authentication errors, rate limits,
    and model errors.
-   Keep provider credentials out of frontend code.

```{=html}
</details>
```
## Security Considerations

-   Keep `.env`, `.env.local`, tokens, database URLs, and provider API
    keys out of Git.
-   Never put privileged credentials in frontend source code or `VITE_`
    variables.
-   Use separate demo accounts with limited permissions and synthetic
    records.
-   Validate input and authorize protected operations on the server.
-   Apply role and data-scope restrictions to student, classroom, and
    analytics data.
-   Avoid logging sensitive student details or secrets.
-   Configure HTTPS, production CORS, secret rotation, and database
    access restrictions before production deployment.

## Roadmap

-   [ ] Expand automated tests for authentication, authorization, and
    data scoping.
-   [ ] Document all API endpoints and request/response schemas.
-   [ ] Complete and verify any pending submission update/delete
    workflows.
-   [ ] Standardize loading, empty, and error states across modules.
-   [ ] Improve AI answer grounding, error handling, and observability.
-   [ ] Add verified deployment links and screenshots.
-   [ ] Add a project license if the repository is published under an
    open-source license.

## License

No license has been specified yet. If you intend to distribute this
project as open source, add a `LICENSE` file and update this section
accordingly.

------------------------------------------------------------------------

::: {align="center"}
**GradeLens AI** · Built with React, TypeScript, Node.js, PostgreSQL,
Prisma, and Groq.
:::
