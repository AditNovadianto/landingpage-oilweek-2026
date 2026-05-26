import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './pages/NotFound.tsx'
import PaperandPosterCompetition from './pages/competitions/PaperandPosterCompetition.tsx'
import PetrosmartCompetition from './pages/competitions/PetrosmartCompetition.tsx'
import BusinessCaseCompetition from './pages/competitions/BusinessCaseCompetition.tsx'
import MudInnovationCompetition from './pages/competitions/MudInnovationCompetition.tsx'
import WellStimulationCompetition from './pages/competitions/WellStimulationCompetition.tsx'
import CaseStudyCompetition from './pages/competitions/CaseStudyCompetition.tsx'
import PreEvent from './pages/events/PreEvent.tsx'
import GrandSeminarXSkillFinder from './pages/events/GrandSeminarXSkillFinder.tsx'
import JobFair from './pages/events/JobFair.tsx'
import CompanyVisit from './pages/events/CompanyVisit.tsx'
import FieldTrip from './pages/events/FieldTrip.tsx'
import SPECare from './pages/events/SPECare.tsx'
import GalaDinner from './pages/events/GalaDinner.tsx'
import SCGathering from './pages/events/SCGathering.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/paper-and-poster-competition',
    element: <PaperandPosterCompetition />,
  },
  {
    path: '/petrosmart-competition',
    element: <PetrosmartCompetition />,
  },
  {
    path: '/business-case-competition',
    element: <BusinessCaseCompetition />,
  },
  {
    path: '/mud-innovation-competition',
    element: <MudInnovationCompetition />,
  },
  {
    path: '/well-stimulation-competition',
    element: <WellStimulationCompetition />,
  },
  {
    path: '/case-study-competition',
    element: <CaseStudyCompetition />,
  },
  {
    path: '/pre-event',
    element: <PreEvent />,
  },
  {
    path: '/grand-seminar-x-skill-finder',
    element: <GrandSeminarXSkillFinder />,
  },
  {
    path: '/job-fair',
    element: <JobFair />,
  },
  {
    path: '/company-visit',
    element: <CompanyVisit />,
  },
  {
    path: '/field-trip',
    element: <FieldTrip />,
  },
  {
    path: '/spe-care',
    element: <SPECare />,
  },
  {
    path: '/student-chapter-gathering',
    element: <SCGathering />,
  },
  {
    path: '/gala-dinner',
    element: <GalaDinner />,
  },
  // {
  //   path: '/sign-up',
  //   element: <SignUp />
  // },
  // {
  //   path: '/forgot-password',
  //   element: <ForgotPassword />
  // },
  // {
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       path: "/dashboard",
  //       element: <Dashboard />,
  //     },
  //   ],
  // },
  {
    path: '*',
    element: <NotFound />
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  } as any,
}
)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
