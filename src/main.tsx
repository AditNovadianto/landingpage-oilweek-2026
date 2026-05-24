import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './pages/NotFound.tsx'
import PaperandPosterCompetition from './pages/PaperandPosterCompetition.tsx'
import PetrosmartCompetition from './pages/PetrosmartCompetition.tsx'
import BusinessCaseCompetition from './pages/BusinessCaseCompetition.tsx'
import MudInnovationCompetition from './pages/MudInnovationCompetition.tsx'
import WellStimulationCompetition from './pages/WellStimulationCompetition.tsx'
import CaseStudyCompetition from './pages/CaseStudyCompetition.tsx'

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
