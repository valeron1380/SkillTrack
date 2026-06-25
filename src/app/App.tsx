import { Navigate, Route, Routes } from "react-router-dom";
import { SkillTrackProvider, useSkillTrackContext } from "./SkillTrackContext";
import { AuthPage } from "../pages/auth/ui/AuthPage";
import { DashboardPage } from "../pages/dashboard/ui/DashboardPage";
import { ProfilePage } from "../pages/profile/ui/ProfilePage";
import { SkillDetailsPage } from "../pages/skill-details/ui/SkillDetailsPage";
import { AppShell } from "../widgets/layout/ui/AppShell";

const PrivateArea = () => {
  const { session, loading } = useSkillTrackContext();
  if (loading) return <div className="grid min-h-screen place-items-center font-black text-slate-950">Загрузка...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return <AppShell />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthPage />} />
    <Route path="/signup" element={<AuthPage />} />
    <Route element={<PrivateArea />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/skills/:id" element={<SkillDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export const App = () => (
  <SkillTrackProvider>
    <AppRoutes />
  </SkillTrackProvider>
);
