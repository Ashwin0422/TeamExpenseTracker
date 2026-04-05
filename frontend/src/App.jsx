import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const LoginSignup = lazy(() => import("./pages/LoginSignup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Layout = lazy(() => import("./components/Layout"));
const CreateTeam = lazy(() => import("./pages/CreateTeam"));
const JoinTeam = lazy(() => import("./pages/JoinTeam"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Team = lazy(() => import("./pages/Team"));

const PageLoader = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/create-team" element={<Layout><CreateTeam /></Layout>} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/join-team" element={<Layout><JoinTeam /></Layout>} />
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/teams/:teamId" element={<Layout><Team /></Layout>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;