import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Plant from "./pages/Plant";
import CaseStudies from "./pages/CaseStudies";
import AddCaseStudy from "./pages/AddCaseStudy";
import Gallery from "./pages/Gallery";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ManagePlants from "./pages/admin/ManagePlants";
import ManageCaseStudies from "./pages/admin/ManageCaseStudies";
import ManageImages from "./pages/admin/ManageImages";
import ManageFeedback from "./pages/admin/ManageFeedback";

import "./styles/main.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/plant/:id" element={<Plant />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - User */}
            <Route path="/add-case-study" element={
              <ProtectedRoute>
                <AddCaseStudy />
              </ProtectedRoute>
            } />

            {/* Protected Routes - Admin */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/plants" element={
              <ProtectedRoute adminOnly>
                <ManagePlants />
              </ProtectedRoute>
            } />
            <Route path="/admin/case-studies" element={
              <ProtectedRoute adminOnly>
                <ManageCaseStudies />
              </ProtectedRoute>
            } />
            <Route path="/admin/images" element={
              <ProtectedRoute adminOnly>
                <ManageImages />
              </ProtectedRoute>
            } />
            <Route path="/admin/feedback" element={
              <ProtectedRoute adminOnly>
                <ManageFeedback />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;