import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "../components/Header";
import { AdminPanelPage } from "../pages/AdminPanelPage";
import { AdminContactsPage } from "../pages/AdminContactsPage";
import { AdminAuditPage } from "../pages/AdminAuditPage";
import { AdminBookingsPage } from "../pages/AdminBookingsPage";
import { AdminCurrenciesPage } from "../pages/AdminCurrenciesPage";
import { AdminOffersPage } from "../pages/AdminOffersPage";
import { AdminProvidersPage } from "../pages/AdminProvidersPage";
import { AdminSectionsPage } from "../pages/AdminSectionsPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";
import { ActivityContextPage } from "../pages/ActivityContextPage";
import { ContactPage } from "../pages/ContactPage";
import { DashboardPage } from "../pages/DashboardPage";
import { FacilityProfilePage } from "../pages/FacilityProfilePage";
import { HomePage } from "../pages/HomePage";
import { ListingPage } from "../pages/ListingPage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RegisterPage } from "../pages/RegisterPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { ReservationsPage } from "../pages/ReservationsPage";
import { ReviewsPage } from "../pages/ReviewsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SmartPlanPage } from "../pages/SmartPlanPage";
import { SuperAdminPage } from "../pages/SuperAdminPage";
import { UserTripsPage } from "../pages/UserTripsPage";
import { UserSupportPage } from "../pages/UserSupportPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/manger" element={<ListingPage category="food" titleKey="nav.eat" />} />
          <Route path="/dormir" element={<ListingPage category="sleep" titleKey="nav.sleep" />} />
          <Route
            path="/activites"
            element={<ListingPage category="activity" titleKey="nav.activities" />}
          />
          <Route path="/facility/:id" element={<FacilityProfilePage />} />
          <Route path="/offers/:id" element={<FacilityProfilePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/activity-context" element={<ActivityContextPage />} />
            <Route path="/smart-plan" element={<SmartPlanPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-trips" element={<UserTripsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/support" element={<UserSupportPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["admin", "super_admin", "user"]} />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["admin", "super_admin"]} />}>
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/admin/providers" element={<AdminProvidersPage />} />
            <Route path="/admin/offers" element={<AdminOffersPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/currencies" element={<AdminCurrenciesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/clients" element={<AdminUsersPage initialAudience="clients" />} />
            <Route path="/admin/partners" element={<AdminUsersPage initialAudience="partners" />} />
            <Route path="/admin/sections" element={<AdminSectionsPage />} />
            <Route path="/admin/contacts" element={<AdminContactsPage />} />
            <Route path="/admin/audit" element={<AdminAuditPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["super_admin"]} />}>
            <Route path="/super-admin" element={<SuperAdminPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
