
// import {
//   ArrowRight,
//   Bot,
//   BookOpen,
//   ChartNoAxesCombined,
//   CheckCircle2,
//   ClipboardCheck,
//   GraduationCap,
//   LockKeyhole,
//   Sparkles,
//   Users,
// } from 'lucide-react'
// import { useState } from 'react'

// import { Link } from 'react-router-dom'

// const features = [
//   {
//     icon: ChartNoAxesCombined,
//     title: 'Academic Analytics',
//     description:
//       'Understand classroom performance, student progress, and assessment trends through organized analytics.',
//     color: 'primary',
//   },
//   {
//     icon: ClipboardCheck,
//     title: 'Quiz & Submission Tracking',
//     description:
//       'Review quiz results, homework submissions, scores, and outstanding academic work.',
//     color: 'success',
//   },
//   {
//     icon: Bot,
//     title: 'AI Learning Assistant',
//     description:
//       'Ask questions about academic performance, learning strategies, and improvement opportunities.',
//     color: 'info',
//   },
//   {
//     icon: LockKeyhole,
//     title: 'Role-Based Access',
//     description:
//       'Separate student, teacher, and administrator experiences with backend-enforced permissions.',
//     color: 'warning',
//   },
//   {
//     icon: Users,
//     title: 'Student Management',
//     description:
//       'Search student records and review relevant academic information from a unified interface.',
//     color: 'danger',
//   },
//   {
//     icon: BookOpen,
//     title: 'Learning Support',
//     description:
//       'Help learners understand their progress and identify areas where they can improve.',
//     color: 'primary',
//   },
// ]

// const roles = [
//   {
//     title: 'Administrators',
//     description:
//       'Monitor classroom performance, review analytics, and oversee academic activities.',
//   },
//   {
//     title: 'Teachers',
//     description:
//       'Review student progress, track submissions, analyze quiz results, and get AI-assisted insights.',
//   },
//   {
//     title: 'Students',
//     description:
//       'Explore personal academic progress and use the AI assistant for learning guidance.',
//   },
// ]

// const technologies = [
//   'React',
//   'TypeScript',
//   'Vite',
//   'Bootstrap',
//   'Node.js',
//   'Express',
//   'PostgreSQL',
//   'Prisma',
//   'Groq AI',
// ]

// export default function Landing() {
//   type DemoRole = 'student' | 'teacher' | 'admin'
// type ActiveModal = 'login' | 'register' | null

// const [activeModal, setActiveModal] = useState<ActiveModal>(null)

// const [demoCredentials, setDemoCredentials] = useState({
//   email: '',
//   password: '',
// })

// const demoAccounts = {
//   student: {
//     email: 'student1@example.com',
//     password: 'StudentPass123!',
//   },
//   teacher: {
//     email: 'teacher@gradelens.test',
//     password: '', // Add the actual demo password here
//   },
//   admin: {
//     email: 'admin@gradelens.test',
//     password: '', // Add the actual demo password here
//   },
// }

// function openDemoLogin(role: DemoRole) {
//   setDemoCredentials(demoAccounts[role])
//   setActiveModal('login')
// }

//   return (
//     <div className="bg-body min-vh-100">
//       {/* Navigation */}
//       <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
//         <div className="container py-2">
//           <Link
//             to="/"
//             className="navbar-brand d-flex align-items-center gap-2 fw-bold"
//           >
//             <span
//               className="rounded-3 bg-primary text-white d-inline-flex align-items-center justify-content-center"
//               style={{ width: 42, height: 42 }}
//             >
//               <GraduationCap size={25} />
//             </span>

//             <span>
//               GradeLens<span className="text-primary"> AI</span>
//               <small className="d-block text-secondary fw-normal">
//                 Academic Intelligence
//               </small>
//             </span>
//           </Link>

//           <div className="d-flex align-items-center gap-2 ms-auto">
//             <Link
//               to="/login"
//               className="btn btn-outline-primary px-3"
//             >
//               Sign in
//             </Link>

//             <Link
//               to="/register"
//               className="btn btn-primary px-3"
//             >
//               Get started
//             </Link>
//           </div>
//         </div>
//       </nav>

// {/* Recruiter demo access */}
// <section className="bg-dark text-white py-3">
//   <div className="container">
//     <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
//       <div>
//         <div className="fw-bold d-flex align-items-center gap-2">
//           <Sparkles size={18} className="text-warning" />
//           Recruiter Demo Access
//         </div>
//         <div className="small text-white-50 mt-1">
//           Explore GradeLens AI using the demo accounts below.
//         </div>
//       </div>

//       <div className="d-flex flex-wrap gap-2">
//        <button
//   type="button"
//   className="btn btn-sm btn-outline-light"
//   onClick={() => openDemoLogin('student')}
// >
//   Student Demo
// </button>

// <button
//   type="button"
//   className="btn btn-sm btn-outline-light"
//   onClick={() => openDemoLogin('teacher')}
// >
//   Teacher Demo
// </button>

// <button
//   type="button"
//   className="btn btn-sm btn-warning"
//   onClick={() => openDemoLogin('admin')}
// >
//   Admin Demo
// </button>
//       </div>
//     </div>
//   </div>
// </section>

//       {/* Hero */}
//       <section
//         className="py-5 border-bottom"
//         style={{
//           background:
//             'radial-gradient(ellipse at 85% 15%, rgba(13,110,253,0.14), transparent 38%), linear-gradient(135deg, #f8fbff 0%, #ffffff 65%, #f1f6ff 100%)',
//         }}
//       >
//         <div className="container py-lg-5 py-3">
//           <div className="row align-items-center g-5">
//             <div className="col-lg-7">
//               <div className="d-inline-flex align-items-center gap-2 rounded-pill border bg-white px-3 py-2 mb-4 shadow-sm">
//                 <Sparkles size={16} className="text-primary" />
//                 <span className="small fw-semibold">
//                   Smarter insights. Better learning.
//                 </span>
//               </div>

//               <h1
//                 className="display-4 fw-bold mb-4"
//                 style={{
//                   letterSpacing: '-1.8px',
//                   lineHeight: 1.12,
//                 }}
//               >
//                 Turn academic data into{' '}
//                 <span className="text-primary">
//                   meaningful progress.
//                 </span>
//               </h1>

//               <p
//                 className="lead text-secondary mb-4"
//                 style={{ maxWidth: 640, lineHeight: 1.8 }}
//               >
//                 GradeLens AI is an academic management and intelligence
//                 platform that brings student performance, classroom
//                 analytics, assessment tracking, and AI-powered learning
//                 guidance into one place.
//               </p>

//               <div className="d-flex flex-wrap gap-3 mb-4">
//                 <Link
//                   to="/register"
//                   className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 shadow-sm"
//                 >
//                   Create your account
//                   <ArrowRight size={19} />
//                 </Link>

//                 <Link
//                   to="/login"
//                   className="btn btn-outline-secondary btn-lg bg-white"
//                 >
//                   Explore the application
//                 </Link>
//               </div>

//               <div className="d-flex flex-wrap gap-3 gap-md-4 text-secondary small">
//                 <span className="d-inline-flex align-items-center gap-2">
//                   <CheckCircle2 size={17} className="text-success" />
//                   Role-based access
//                 </span>

//                 <span className="d-inline-flex align-items-center gap-2">
//                   <CheckCircle2 size={17} className="text-success" />
//                   AI-assisted insights
//                 </span>

//                 <span className="d-inline-flex align-items-center gap-2">
//                   <CheckCircle2 size={17} className="text-success" />
//                   Responsive interface
//                 </span>
//               </div>
//             </div>

//             {/* Product preview */}
//             <div className="col-lg-5">
//               <div
//                 className="card border-0 shadow-lg overflow-hidden"
//                 style={{ borderRadius: 22 }}
//               >
//                 <div className="p-4 text-white bg-primary">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div>
//                       <div className="small opacity-75">
//                         GR ADELENS AI
//                       </div>
//                       <h2 className="h4 fw-bold mb-0 mt-1">
//                         Academic overview
//                       </h2>
//                     </div>

//                     <div className="rounded-3 bg-white bg-opacity-25 p-2">
//                       <ChartNoAxesCombined size={26} />
//                     </div>
//                   </div>

//                   <p className="mb-0 small opacity-75">
//                     A unified view of learning and performance
//                   </p>
//                 </div>

//                 <div className="card-body p-4">
//                   <div className="row g-3 mb-4">
//                     <div className="col-6">
//                       <div className="border rounded-3 p-3 h-100">
//                         <Users
//                           size={20}
//                           className="text-primary mb-3"
//                         />
//                         <div className="small text-secondary">
//                           Student records
//                         </div>
//                         <div className="fw-semibold">
//                           Student overview
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-6">
//                       <div className="border rounded-3 p-3 h-100">
//                         <ClipboardCheck
//                           size={20}
//                           className="text-success mb-3"
//                         />
//                         <div className="small text-secondary">
//                           Assessments
//                         </div>
//                         <div className="fw-semibold">
//                           Quiz & homework
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="rounded-3 border p-3 mb-3">
//                     <div className="d-flex align-items-center gap-2 mb-2">
//                       <div className="rounded-circle bg-primary-subtle text-primary p-2">
//                         <Bot size={19} />
//                       </div>

//                       <div>
//                         <div className="fw-semibold">
//                           GradeLens AI Assistant
//                         </div>
//                         <div className="small text-secondary">
//                           Learning and academic guidance
//                         </div>
//                       </div>
//                     </div>

//                     <div className="small text-secondary mt-3">
//                       Ask questions, understand academic patterns, and
//                       explore ways to improve learning outcomes.
//                     </div>
//                   </div>

//                   <div className="d-flex align-items-center gap-2 small text-secondary">
//                     <LockKeyhole size={16} className="text-success" />
//                     Access to academic records is controlled by user role.
//                   </div>
//                 </div>
//               </div>

//               <p className="small text-secondary text-center mt-3 mb-0">
//                 Product preview · Illustrative interface, not live analytics
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-5">
//         <div className="container py-lg-4">
//           <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
//             <span className="text-primary fw-semibold small text-uppercase">
//               Platform capabilities
//             </span>

//             <h2 className="display-6 fw-bold mt-2 mb-3">
//               Everything in one academic workspace
//             </h2>

//             <p className="text-secondary mb-0" style={{ lineHeight: 1.8 }}>
//               Bring academic records and AI-assisted guidance together
//               to make it easier to understand performance and support
//               learning.
//             </p>
//           </div>

//           <div className="row g-4">
//             {features.map((feature) => {
//               const Icon = feature.icon

//               return (
//                 <div className="col-md-6 col-lg-4" key={feature.title}>
//                   <div className="card h-100 border shadow-sm">
//                     <div className="card-body p-4">
//                       <div
//                         className={`d-inline-flex rounded-3 p-3 bg-${feature.color}-subtle text-${feature.color} mb-3`}
//                       >
//                         <Icon size={25} />
//                       </div>

//                       <h3 className="h5 fw-bold mb-2">
//                         {feature.title}
//                       </h3>

//                       <p className="text-secondary mb-0" style={{ lineHeight: 1.75 }}>
//                         {feature.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Roles */}
//       <section className="py-5 bg-body-tertiary border-top border-bottom">
//         <div className="container py-lg-4">
//           <div className="row align-items-start g-5">
//             <div className="col-lg-4">
//               <span className="text-primary fw-semibold small text-uppercase">
//                 Designed for different roles
//               </span>

//               <h2 className="display-6 fw-bold mt-2 mb-3">
//                 The right view for every user.
//               </h2>

//               <p className="text-secondary" style={{ lineHeight: 1.8 }}>
//                 GradeLens AI separates experiences for administrators,
//                 teachers, and students, with backend authorization
//                 controlling access to academic information.
//               </p>

//               <Link
//                 to="/login"
//                 className="btn btn-primary d-inline-flex align-items-center gap-2 mt-2"
//               >
//                 Sign in to explore
//                 <ArrowRight size={17} />
//               </Link>
//             </div>

//             <div className="col-lg-8">
//               <div className="row g-3">
//                 {roles.map((role, index) => (
//                   <div className="col-md-4" key={role.title}>
//                     <div className="card h-100 border-0 shadow-sm">
//                       <div className="card-body p-4">
//                         <div className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-3"
//                           style={{ width: 48, height: 48 }}
//                         >
//                           {index === 0 ? (
//                             <ChartNoAxesCombined size={23} />
//                           ) : index === 1 ? (
//                             <BookOpen size={23} />
//                           ) : (
//                             <GraduationCap size={23} />
//                           )}
//                         </div>

//                         <h3 className="h6 fw-bold">{role.title}</h3>

//                         <p className="small text-secondary mb-0" style={{ lineHeight: 1.75 }}>
//                           {role.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Demo access */}
//       <section className="py-5" id="demo-access">
//         <div className="container py-lg-4">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <div
//                 className="card border-0 shadow-sm overflow-hidden"
//                 style={{ borderRadius: 20 }}
//               >
//                 <div className="row g-0">
//                   <div className="col-lg-5 bg-primary text-white p-4 p-md-5">
//                     <Sparkles size={30} className="mb-4" />

//                     <h2 className="h2 fw-bold mb-3">
//                       Explore GradeLens AI
//                     </h2>

//                     <p className="mb-4 opacity-75" style={{ lineHeight: 1.8 }}>
//                       Sign in with an available demo account to explore
//                       the application's role-specific experience and
//                       implemented features.
//                     </p>

//                     <Link
//                       to="/login"
//                       className="btn btn-light text-primary fw-semibold d-inline-flex align-items-center gap-2"
//                     >
//                       Go to sign in
//                       <ArrowRight size={17} />
//                     </Link>
//                   </div>

//                   <div className="col-lg-7 p-4 p-md-5">
//                     <h3 className="h5 fw-bold mb-2">
//                       Demo account access
//                     </h3>

//                     <p className="text-secondary small mb-4">
//                       Use only accounts configured in the deployed
//                       environment. Passwords are not embedded in the
//                       landing page.
//                     </p>

//                     <div className="border rounded-3 p-3 mb-3">
//                       <div className="d-flex align-items-center gap-2 mb-2">
//                         <GraduationCap
//                           size={19}
//                           className="text-primary"
//                         />
//                         <span className="fw-semibold">Student demo</span>
//                       </div>

//                       <div className="small text-secondary mb-1">
//                         Email
//                       </div>

//                       <code>student1@example.com</code>

//                       <div className="small text-secondary mt-3">
//                         Demo password: <span className="fw-semibold">StudentPass123!</span>
//                       </div>

//                       <Link
//                         to="/login"
//                         className="btn btn-sm btn-outline-primary mt-3"
//                       >
//                         Sign in as student
//                       </Link>
//                     </div>

//                     <div className="border rounded-3 p-3 mb-3">
//                       <div className="d-flex align-items-center gap-2 mb-2">
//                         <Users size={19} className="text-primary" />
//                         <span className="fw-semibold">
//                           Teacher demo
//                         </span>
//                       </div>

//                       <div className="small text-secondary mb-1">
//                         Email
//                       </div>

//                       <code>teacher@gradelens.test</code>

//                       <div className="small text-secondary mt-2">
//                         Use the teacher password configured for your
//                         demo environment.
//                       </div>
//                     </div>

//                     <div className="border rounded-3 p-3">
//                       <div className="d-flex align-items-center gap-2 mb-2">
//                         <LockKeyhole size={19} className="text-primary" />
//                         <span className="fw-semibold">
//                           Administrator demo
//                         </span>
//                       </div>

//                       <div className="small text-secondary mb-1">
//                         Email
//                       </div>

//                       <code>admin@gradelens.test</code>

//                       <div className="small text-secondary mt-2">
//                         Use the administrator password configured
//                         privately for your demo environment.
//                       </div>
//                     </div>

//                     <div className="alert alert-warning small mt-4 mb-0">
//                       Demo accounts must exist in the backend and have
//                       appropriate role permissions. Do not publish
//                       production administrator credentials.
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Technology stack */}
//       <section className="py-5 border-top bg-body-tertiary">
//         <div className="container text-center py-3">
//           <h2 className="h4 fw-bold mb-2">
//             Built with a modern full-stack architecture
//           </h2>

//           <p className="text-secondary mb-4">
//             The technologies powering GradeLens AI
//           </p>

//           <div className="d-flex justify-content-center flex-wrap gap-2">
//             {technologies.map((technology) => (
//               <span
//                 key={technology}
//                 className="badge rounded-pill text-bg-white border text-secondary px-3 py-2"
//               >
//                 {technology}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//      {/* Final CTA */}
// <section className="py-5">
//   <div className="container py-3">
//     <div className="bg-primary text-white rounded-4 p-4 p-md-5 text-center">
//       <h2 className="display-6 fw-bold mb-3">
//         See academic intelligence in action.
//       </h2>

//       <p
//         className="mx-auto mb-4 opacity-75"
//         style={{ maxWidth: 620, lineHeight: 1.8 }}
//       >
//         Sign in to explore GradeLens AI, or create an account to
//         get started with the available student experience.
//       </p>

//       <div className="d-flex justify-content-center flex-wrap gap-3">
//         <button
//           type="button"
//           className="btn btn-light btn-lg text-primary fw-semibold"
//           onClick={() => {
//             setDemoCredentials({ email: '', password: '' })
//             setActiveModal('login')
//           }}
//         >
//           Sign in
//         </button>

//         <button
//           type="button"
//           className="btn btn-outline-light btn-lg"
//           onClick={() => setActiveModal('register')}
//         >
//           Create account
//         </button>
//       </div>
//     </div>
//   </div>
// </section>

//       {/* Footer */}
//       <footer className="border-top py-4 bg-white">
//         <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
//           <div className="fw-bold">
//             GradeLens<span className="text-primary"> AI</span>
//           </div>

//           <p className="small text-secondary mb-0">
//             Academic insights and AI-assisted learning.
//           </p>

//           <div className="d-flex gap-3 small">
//             <Link to="/login" className="text-decoration-none">
//               Sign in
//             </Link>

//             <Link to="/register" className="text-decoration-none">
//               Register
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
// -------------------------------------------------------------------------------

// new one


import { useState } from 'react'
import {
  ArrowRight,
  Bot,
  BookOpen,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LockKeyhole,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import Login from './auth/Login'
import Register from './auth/Register'

type DemoRole = 'student' | 'teacher' | 'admin'
type ActiveModal = 'login' | 'register' | null

interface DemoAccount {
  email: string
  password: string
}

const demoAccounts: Record<DemoRole, DemoAccount> = {
  student: {
    email: 'student1@example.com',
    password: 'StudentPass123!',
  },
  teacher: {
    email: 'teacher@gradelens.test',
    password: 'YOUR_TEACHER_PASSWORD', // Enter the actual teacher demo password if available.
  },
  admin: {
    email: 'admin@gradelens.test',
    password: 'replace-with-a-strong-local-password', // Enter the actual admin demo password if available.
  },
}

const features = [
  {
    icon: ChartNoAxesCombined,
    title: 'Academic Analytics',
    description:
      'Understand classroom performance, student progress, and assessment trends through organized analytics.',
    color: 'primary',
  },
  {
    icon: ClipboardCheck,
    title: 'Quiz & Submission Tracking',
    description:
      'Review quiz results, homework submissions, scores, and outstanding academic work.',
    color: 'success',
  },
  {
    icon: Bot,
    title: 'AI Learning Assistant',
    description:
      'Ask questions about academic performance, learning strategies, and improvement opportunities.',
    color: 'info',
  },
  {
    icon: LockKeyhole,
    title: 'Role-Based Access',
    description:
      'Separate student, teacher, and administrator experiences with backend-enforced permissions.',
    color: 'warning',
  },
  {
    icon: Users,
    title: 'Student Management',
    description:
      'Search student records and review relevant academic information from a unified interface.',
    color: 'danger',
  },
  {
    icon: BookOpen,
    title: 'Learning Support',
    description:
      'Help learners understand their progress and identify areas where they can improve.',
    color: 'primary',
  },
]

const roles = [
  {
    title: 'Administrators',
    description:
      'Monitor classroom performance, review analytics, and oversee academic activities.',
  },
  {
    title: 'Teachers',
    description:
      'Review student progress, track submissions, analyze quiz results, and get AI-assisted insights.',
  },
  {
    title: 'Students',
    description:
      'Explore personal academic progress and use the AI assistant for learning guidance.',
  },
]

const technologies = [
  'React',
  'TypeScript',
  'Vite',
  'Bootstrap',
  'Node.js',
  'Express',
  'PostgreSQL',
  'Prisma',
  'Groq AI',
]

export default function Landing() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [demoCredentials, setDemoCredentials] = useState<DemoAccount>({
    email: '',
    password: '',
  })

  function openDemoLogin(role: DemoRole) {
    setDemoCredentials({ ...demoAccounts[role] })
    setActiveModal('login')
  }

  function openLogin() {
    setDemoCredentials({ email: '', password: '' })
    setActiveModal('login')
  }

  function openRegister() {
    setActiveModal('register')
  }

  function closeModal() {
    setActiveModal(null)
  }

  return (
    <div className="bg-body min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container py-2">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          >
            <span
              className="rounded-3 bg-primary text-white d-inline-flex align-items-center justify-content-center"
              style={{ width: 42, height: 42 }}
            >
              <GraduationCap size={25} />
            </span>

            <span>
              GradeLens<span className="text-primary"> AI</span>
              <small className="d-block text-secondary fw-normal">
                Academic Intelligence
              </small>
            </span>
          </Link>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <button
              type="button"
              className="btn btn-outline-primary px-3"
              onClick={openLogin}
            >
              Sign in
            </button>

            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={openRegister}
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Recruiter Demo Access */}
      <section className="bg-dark text-white py-4">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
            <div>
              <div className="fw-bold d-flex align-items-center gap-2 mb-2">
                <Sparkles size={20} className="text-warning" />
                Recruiter Demo Access
              </div>

              <p className="small text-white-50 mb-3">
                Choose a role to open its prefilled login form.
              </p>

              <div className="small">
                <div className="mb-2">
                  <strong className="text-white">Student:</strong>{' '}
                  <code className="text-info">student1@example.com</code>
                  <span className="text-white-50 ms-2">
                    Use the configured demo password.
                  </span>
                </div>

                <div className="mb-2">
                  <strong className="text-white">Teacher:</strong>{' '}
                  <code className="text-info">teacher@gradelens.test</code>
                  <span className="text-white-50 ms-2">
                    Use the configured demo password.
                  </span>
                </div>

                <div>
                  <strong className="text-white">Admin:</strong>{' '}
                  <code className="text-info">admin@gradelens.test</code>
                  <span className="text-white-50 ms-2">
                    Use the configured demo password.
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => openDemoLogin('student')}
              >
                <GraduationCap size={17} className="me-1" />
                Student Demo
              </button>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => openDemoLogin('teacher')}
              >
                <BookOpen size={17} className="me-1" />
                Teacher Demo
              </button>

              <button
                type="button"
                className="btn btn-warning"
                onClick={() => openDemoLogin('admin')}
              >
                <LockKeyhole size={17} className="me-1" />
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section
        className="py-5 border-bottom"
        style={{
          background:
            'radial-gradient(ellipse at 85% 15%, rgba(13,110,253,0.14), transparent 38%), linear-gradient(135deg, #f8fbff 0%, #ffffff 65%, #f1f6ff 100%)',
        }}
      >
        <div className="container py-lg-5 py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 rounded-pill border bg-white px-3 py-2 mb-4 shadow-sm">
                <Sparkles size={16} className="text-primary" />
                <span className="small fw-semibold">
                  Smarter insights. Better learning.
                </span>
              </div>

              <h1
                className="display-4 fw-bold mb-4"
                style={{ letterSpacing: '-1.8px', lineHeight: 1.12 }}
              >
                Turn academic data into{' '}
                <span className="text-primary">meaningful progress.</span>
              </h1>

              <p
                className="lead text-secondary mb-4"
                style={{ maxWidth: 640, lineHeight: 1.8 }}
              >
                GradeLens AI is an academic management and intelligence
                platform that brings student performance, classroom
                analytics, assessment tracking, and AI-powered learning
                guidance into one place.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 shadow-sm"
                  onClick={openRegister}
                >
                  Create your account
                  <ArrowRight size={19} />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg bg-white"
                  onClick={openLogin}
                >
                  Explore the application
                </button>
              </div>

              <div className="d-flex flex-wrap gap-3 gap-md-4 text-secondary small">
                <span className="d-inline-flex align-items-center gap-2">
                  <CheckCircle2 size={17} className="text-success" />
                  Role-based access
                </span>

                <span className="d-inline-flex align-items-center gap-2">
                  <CheckCircle2 size={17} className="text-success" />
                  AI-assisted insights
                </span>

                <span className="d-inline-flex align-items-center gap-2">
                  <CheckCircle2 size={17} className="text-success" />
                  Responsive interface
                </span>
              </div>
            </div>

            {/* Product Preview */}
            <div className="col-lg-5">
              <div
                className="card border-0 shadow-lg overflow-hidden"
                style={{ borderRadius: 22 }}
              >
                <div className="p-4 text-white bg-primary">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <div className="small opacity-75">GRADELENS AI</div>
                      <h2 className="h4 fw-bold mb-0 mt-1">
                        Academic overview
                      </h2>
                    </div>

                    <div className="rounded-3 bg-white bg-opacity-25 p-2">
                      <ChartNoAxesCombined size={26} />
                    </div>
                  </div>

                  <p className="mb-0 small opacity-75">
                    A unified view of learning and performance
                  </p>
                </div>

                <div className="card-body p-4">
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="border rounded-3 p-3 h-100">
                        <Users size={20} className="text-primary mb-3" />
                        <div className="small text-secondary">
                          Student records
                        </div>
                        <div className="fw-semibold">Student overview</div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded-3 p-3 h-100">
                        <ClipboardCheck
                          size={20}
                          className="text-success mb-3"
                        />
                        <div className="small text-secondary">
                          Assessments
                        </div>
                        <div className="fw-semibold">Quiz & homework</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3 border p-3 mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="rounded-circle bg-primary-subtle text-primary p-2">
                        <Bot size={19} />
                      </div>

                      <div>
                        <div className="fw-semibold">
                          GradeLens AI Assistant
                        </div>
                        <div className="small text-secondary">
                          Learning and academic guidance
                        </div>
                      </div>
                    </div>

                    <div className="small text-secondary mt-3">
                      Ask questions, understand academic patterns, and
                      explore ways to improve learning outcomes.
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 small text-secondary">
                    <LockKeyhole size={16} className="text-success" />
                    Access to academic records is controlled by user role.
                  </div>
                </div>
              </div>

              <p className="small text-secondary text-center mt-3 mb-0">
                Product preview · Illustrative interface, not live analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
            <span className="text-primary fw-semibold small text-uppercase">
              Platform capabilities
            </span>

            <h2 className="display-6 fw-bold mt-2 mb-3">
              Everything in one academic workspace
            </h2>

            <p className="text-secondary mb-0" style={{ lineHeight: 1.8 }}>
              Bring academic records and AI-assisted guidance together
              to make it easier to understand performance and support
              learning.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div className="col-md-6 col-lg-4" key={feature.title}>
                  <div className="card h-100 border shadow-sm">
                    <div className="card-body p-4">
                      <div
                        className={`d-inline-flex rounded-3 p-3 bg-${feature.color}-subtle text-${feature.color} mb-3`}
                      >
                        <Icon size={25} />
                      </div>

                      <h3 className="h5 fw-bold mb-2">{feature.title}</h3>

                      <p
                        className="text-secondary mb-0"
                        style={{ lineHeight: 1.75 }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-5 bg-body-tertiary border-top border-bottom">
        <div className="container py-lg-4">
          <div className="row align-items-start g-5">
            <div className="col-lg-4">
              <span className="text-primary fw-semibold small text-uppercase">
                Designed for different roles
              </span>

              <h2 className="display-6 fw-bold mt-2 mb-3">
                The right view for every user.
              </h2>

              <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                GradeLens AI separates experiences for administrators,
                teachers, and students, with backend authorization
                controlling access to academic information.
              </p>

              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2 mt-2"
                onClick={openLogin}
              >
                Sign in to explore
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="col-lg-8">
              <div className="row g-3">
                {roles.map((role, index) => (
                  <div className="col-md-4" key={role.title}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body p-4">
                        <div
                          className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: 48, height: 48 }}
                        >
                          {index === 0 ? (
                            <ChartNoAxesCombined size={23} />
                          ) : index === 1 ? (
                            <BookOpen size={23} />
                          ) : (
                            <GraduationCap size={23} />
                          )}
                        </div>

                        <h3 className="h6 fw-bold">{role.title}</h3>

                        <p
                          className="small text-secondary mb-0"
                          style={{ lineHeight: 1.75 }}
                        >
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Account Access */}
      <section className="py-5" id="demo-access">
        <div className="container py-lg-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="card border-0 shadow-sm overflow-hidden"
                style={{ borderRadius: 20 }}
              >
                <div className="row g-0">
                  <div className="col-lg-5 bg-primary text-white p-4 p-md-5">
                    <Sparkles size={30} className="mb-4" />

                    <h2 className="h2 fw-bold mb-3">
                      Explore GradeLens AI
                    </h2>

                    <p
                      className="mb-4 opacity-75"
                      style={{ lineHeight: 1.8 }}
                    >
                      Choose a demo role to open the login popup with
                      its account details prefilled.
                    </p>

                    <button
                      type="button"
                      className="btn btn-light text-primary fw-semibold d-inline-flex align-items-center gap-2"
                      onClick={() => openDemoLogin('student')}
                    >
                      Try student demo
                      <ArrowRight size={17} />
                    </button>
                  </div>

                  <div className="col-lg-7 p-4 p-md-5">
                    <h3 className="h5 fw-bold mb-2">
                      Available demo accounts
                    </h3>

                    <p className="text-secondary small mb-4">
                      Select an account to prefill the login form.
                    </p>

                    {(
                      [
                        ['student', 'Student', GraduationCap],
                        ['teacher', 'Teacher', BookOpen],
                        ['admin', 'Administrator', LockKeyhole],
                      ] as const
                    ).map(([role, label, Icon]) => (
                      <div
                        className="border rounded-3 p-3 mb-3"
                        key={role}
                      >
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <Icon size={19} className="text-primary" />
                          <span className="fw-semibold">{label} demo</span>
                        </div>

                        <code>{demoAccounts[role].email}</code>

                        {role === 'student' ? (
                          <div className="small text-secondary mt-2">
                            Password: StudentPass123!
                          </div>
                        ) : (
                          <div className="small text-secondary mt-2">
                            Use the password configured for this demo account.
                          </div>
                        )}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary mt-3"
                          onClick={() => openDemoLogin(role)}
                        >
                          Sign in as {label.toLowerCase()}
                        </button>
                      </div>
                    ))}

                    <div className="alert alert-warning small mb-0">
                      Demo accounts must exist in the backend. Use
                      dedicated demo accounts and never expose a real
                      administrator password.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-5 border-top bg-body-tertiary">
        <div className="container text-center py-3">
          <h2 className="h4 fw-bold mb-2">
            Built with a modern full-stack architecture
          </h2>

          <p className="text-secondary mb-4">
            The technologies powering GradeLens AI
          </p>

          <div className="d-flex justify-content-center flex-wrap gap-2">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="badge rounded-pill bg-white border text-secondary px-3 py-2"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-5">
        <div className="container py-3">
          <div className="bg-primary text-white rounded-4 p-4 p-md-5 text-center">
            <h2 className="display-6 fw-bold mb-3">
              See academic intelligence in action.
            </h2>

            <p
              className="mx-auto mb-4 opacity-75"
              style={{ maxWidth: 620, lineHeight: 1.8 }}
            >
              Sign in to explore GradeLens AI, or create an account to
              get started with the available student experience.
            </p>

            <div className="d-flex justify-content-center flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-light btn-lg text-primary fw-semibold"
                onClick={openLogin}
              >
                Sign in
              </button>

              <button
                type="button"
                className="btn btn-outline-light btn-lg"
                onClick={openRegister}
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-top py-4 bg-white">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="fw-bold">
            GradeLens<span className="text-primary"> AI</span>
          </div>

          <p className="small text-secondary mb-0">
            Academic insights and AI-assisted learning.
          </p>

          <div className="d-flex gap-3 small">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={openLogin}
            >
              Sign in
            </button>

            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={openRegister}
            >
              Register
            </button>
          </div>
        </div>
      </footer>

      {/* Login / Registration Popup */}
      {activeModal !== null && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            zIndex: 1055,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <div
            className="w-100"
            style={{ maxWidth: 520, maxHeight: '95vh', overflowY: 'auto' }}
            role="dialog"
            aria-modal="true"
            aria-label={
              activeModal === 'login'
                ? 'Sign in to GradeLens AI'
                : 'Create a GradeLens AI account'
            }
          >
            <div className="bg-white rounded-4 shadow-lg overflow-hidden">
              <div className="d-flex justify-content-end px-3 pt-3">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close authentication popup"
                  onClick={closeModal}
                />
              </div>

              {activeModal === 'login' ? (
                <Login
                  key={`login-${demoCredentials.email}`}
                  initialEmail={demoCredentials.email}
                  initialPassword={demoCredentials.password}
                  onClose={closeModal}
                  onSwitchToRegister={openRegister}
                />
              ) : (
                <Register
                  onClose={closeModal}
                  onSwitchToLogin={openLogin}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
