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
import SignInTeamLeader from './pages/TeamLeader/SignInTeamLeader.tsx'
import SignUpTeamLeader from './pages/TeamLeader/SignUpTeamLeader.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import DashboardTeamLeader from './pages/TeamLeader/DashboardTeamLeader.tsx'
import SignInUser from './pages/User/SignInUser.tsx'
import DashboardUser from './pages/User/DashboardUser.tsx'
import ForgotPasswordUser from './pages/User/ForgotPasswordUser.tsx'
import ResetPasswordUser from './pages/User/ResetPasswordUser.tsx'
import ForgotPasswordTeamLeader from './pages/TeamLeader/ForgotPasswordTeamLeader.tsx'
import ResetPasswordTeamLeader from './pages/TeamLeader/ResetPasswordTeamLeader.tsx'
import DashboardAdminBusinessCase from './pages/AdminBusinessCaseCompetition/DashboardAdminBusinessCase.tsx'
import DashboardAdminPetrosmart from './pages/AdminPetrosmartCompetition/DashboardAdminPetrosmart.tsx'
import DashboardAdminPaperAndPoster from './pages/AdminPaperAndPosterCompetition/DashboardAdminPaperAndPoster.tsx'
import DashboardAdminMudInnovation from './pages/AdminMudInnovationCompetition/DashboardAdminMudInnovation.tsx'
import DashboardAdminWellStimulation from './pages/AdminWellStimulationCompetition/DashboardAdminWellStimulation.tsx'
import DashboardAdminCaseStudy from './pages/AdminCaseStudyCompetition/DashboardAdminCaseStudy.tsx'

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
  {
    path: "/user",
    children: [
      {
        path: "sign-in",
        element: <SignInUser />
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordUser />
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordUser />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard-user",
            element: <DashboardUser />
          },
          {
            path: "dashboard-admin-business-case",
            element: <DashboardAdminBusinessCase />
          },
          {
            path: "user/dashboard-admin-petrosmart",
            element: <DashboardAdminPetrosmart />
          },
          {
            path: "user/dashboard-admin-paper-poster",
            element: <DashboardAdminPaperAndPoster />
          },
          {
            path: "user/dashboard-admin-mud-innovation",
            element: <DashboardAdminMudInnovation />
          },
          {
            path: "user/dashboard-admin-well-stimulation",
            element: <DashboardAdminWellStimulation />
          },
          {
            path: "user/dashboard-case-study",
            element: <DashboardAdminCaseStudy />
          },
        ]
      }
    ]
  },
  {
    path: "/team-leader",
    children: [
      {
        path: 'sign-in',
        element: <SignInTeamLeader />,
      },
      {
        path: 'sign-up',
        element: <SignUpTeamLeader />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordTeamLeader />
      },
      {
        path: 'reset-password/:token',
        element: <ResetPasswordTeamLeader />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard-team-leader",
            element: <DashboardTeamLeader />
          }
        ]
      }
    ]
  },
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
