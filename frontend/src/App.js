import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Banner from "./components/Banner";
import NewsSection from './components/NewsSection';
import FeedbackSection from './components/FeedbackSection';
import FooterSection from './components/FooterSection';
import AboutUs from './components/AboutUs';
import { Login, Register, ForgotPassword, ResetPassword, VerifyResetCode } from './components/AuthForm';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import AdminRoute from './components/AdminRoute';
import NewsSectionDashboard from './components/NewsSectionDashboard'
import NewsForm from './components/NewsForm';
import NewsDetail from './components/NewsDetail';
import VerifyCode from './components/VerifyCode';
import DocsCenterAndUploads from './components/dashboard/DocsCenterAndUploads';
import DocumentsPage from "./components/DocumentsPage";
import VideosDashboard from './components/dashboard/VideosDashboard'
import VideoGallery from './components/VideoGallery';
import VideoPlayer from "./components/VideoPlayer";
import ProfileRoute from './components/ProfileRoute';
import NotFoundPage from './components/NotFoundPage';
import RoleBasedRoute from './components/RoleBasedRoute';
import PublicRoute from './components/PublicRoute';
import SpecificInstitute from './components/SpecificInstitute';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Goals from './components/Goals';
import AllNews from './components/AllNews';
import AskAndAnswers from './components/AskAndAnswers';
import AnswerToQuestions from './pages/AnswerToQuestions';


function App() {
  return (
    <Router>
      <div dir="rtl" className="flex flex-col min-h-screen">
        <Menu />
        <div id="google_translate_element" style={{ display: 'none' }}></div>

        <main className="flex-grow">
          <Routes>
            {/* ✅ About Us Page */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route 
              path="/verify-code" 
              element={
                <PublicRoute>
                  <VerifyCode />
                </PublicRoute>
              } 
            />
            <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        
        <Route
          path="/public-news"
          element={<AllNews />}
        />



        <Route
          path="/news/create"
          element={
            <AdminRoute>
              <NewsForm />
            </AdminRoute>
          }
        />

<Route
          path="/news"
          element={
            <AdminRoute>
              <NewsSectionDashboard />
            </AdminRoute>
          }
        />

          <Route
  path="/profile"
  element={
    <RoleBasedRoute allowedRoles={['admin', 'institute', 'user', 'employee']}>
      <ProfileRoute />
    </RoleBasedRoute>
  }
/>

<Route
  path="/step2"
  element={
    <RoleBasedRoute allowedRoles={['admin', 'institute', 'user', 'employee']}>
      <Step2 />
    </RoleBasedRoute>
  }
/>

<Route
  path="/step3"
  element={
    <RoleBasedRoute allowedRoles={['admin', 'institute', 'user', 'employee']}>
      <Step3 />
    </RoleBasedRoute>
  }
/>

          <Route
            path="/institute/:userId"
            element={
              <RoleBasedRoute allowedRoles={['employee', 'admin']}>
                <SpecificInstitute />
              </RoleBasedRoute>
            }
          />

<Route
            path="/answer-to-questions"
            element={
              <RoleBasedRoute allowedRoles={['employee']}>
                <AnswerToQuestions />
              </RoleBasedRoute>
            }
          />



        <Route
          path="/news/edit/:id"
          element={
            <AdminRoute>
              <NewsForm />
            </AdminRoute>
          }
        />

        <Route
          path="dashboard/docs-center-and-uploads"
          element={
            <AdminRoute>
              <DocsCenterAndUploads />
            </AdminRoute>
          }
        />

        <Route
          path="dashboard/videos"
          element={
            <AdminRoute>
              <VideosDashboard />
            </AdminRoute>
          }
        />
        

            {/*login and register page*/}
            <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>

            <Route path="/register" element={<Register />} />
            
            {/* ✅ Forgot Password and Reset Password Routes */}
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-reset-code"
              element={
                <PublicRoute>
                  <VerifyResetCode />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            
            <Route path="/documents/:type" element={<DocumentsPage />} />
            <Route path="/training/:type" element={<VideoGallery />} />
            <Route path="/video" element={<VideoPlayer />} />
            <Route path="*" element={<NotFoundPage />} />
            {/* ✅ Homepage (default route) */}
            <Route
              path="/"
              element={
                <>
                  <Banner />
                  <NewsSection />
                  <Goals />
                  <FeedbackSection />
                  <AskAndAnswers />
                </>
              }
            />

            <Route
              path="/dashboard/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />

            <Route
              path="/dashboard/news"
              element={
                <AdminRoute>
                  <NewsSectionDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        <FooterSection />
      </div>
    </Router>
  );
}

export default App;
