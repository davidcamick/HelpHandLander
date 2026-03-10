import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import DashboardLayout from './dashboard/DashboardLayout.jsx'
import DashboardHome from './dashboard/DashboardHome.jsx'
import DashboardUsers from './dashboard/DashboardUsers.jsx'
import DashboardUserDetail from './dashboard/DashboardUserDetail.jsx'
import DashboardReports from './dashboard/DashboardReports.jsx'
import DashboardReviews from './dashboard/DashboardReviews.jsx'
import DashboardJobs from './dashboard/DashboardJobs.jsx'
import './index.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_KEY}>
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<App />} />

          {/* Admin dashboard (Clerk-protected) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<DashboardUsers />} />
            <Route path="users/:id" element={<DashboardUserDetail />} />
            <Route path="reports" element={<DashboardReports />} />
            <Route path="reviews" element={<DashboardReviews />} />
            <Route path="jobs" element={<DashboardJobs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
)
