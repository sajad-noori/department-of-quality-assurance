import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Banner from "./components/Banner";
import NewsSection from './components/NewsSection';
import FeedbackSection from './components/FeedbackSection';
import FooterSection from './components/FooterSection';
import AboutUs from './components/AboutUs';
import { Login, Register } from './components/AuthForm';
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
import Profile from './components/Profile';
import NotFoundPage from './components/NotFoundPage';
import RoleBasedRoute from './components/RoleBasedRoute';
import PublicRoute from './components/PublicRoute';

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
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
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
          path="/news/create"
          element={
            <AdminRoute>
              <NewsForm />
            </AdminRoute>
          }
        />

          <Route
  path="/profile"
  element={
    <RoleBasedRoute allowedRoles={['admin', 'institute']}>
      <Profile />
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
                  <FeedbackSection />
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
          </Routes>
        </main>

        <FooterSection />
      </div>
    </Router>
  );
}

export default App;
