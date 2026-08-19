import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AuthForm from "./pages/Auth/AuthForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Dashboard/Profile";
import Subscriptions from "./pages/Dashboard/Subscriptions";
import TransactionPage from "./pages/Dashboard/TransactionPage";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import UserInfo from "./pages/UserInfo/UserInfo";
import RoomPage from "./pages/Room/Room";
import ForgetPassword from "./pages/ForgetPassowrd/ForgetPassword";
import Success from "./pages/Dashboard/Success";
import Failed from "./pages/Dashboard/Failed";
import AdminDashboardLayout from "./pages/Admin/AdminDashboardLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AllUsers from "./pages/Admin/AllUsers";
import AdminSubscription from "./pages/Admin/Subscription";
import AdminTransaction from "./pages/Admin/Transaction";
import Settings from "./pages/Admin/Settings";
import AdminAbout from "./pages/Admin/AdminAbout";
import AdminContact from "./pages/Admin/AdminContact";
import AdminTerms from "./pages/Admin/AdminTerms";
import AdminPrivacy from "./pages/Admin/AdminPrivacy";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import AdminCredit from "./pages/Admin/AdminCredit";
import AdminDistributor from "./pages/Admin/AdminContributor";
import DistributorDashboardLayout from "./pages/Distributor/DistributorDashboardLayout";
import DistributorAllUsers from "./pages/Distributor/DistributorAllUsers";
import DistributorDashboard from "./pages/Distributor/DistributorDashboard";
import PaymentSuccess from "./pages/Distributor/PaymentSuccess";
import PaymentFailed from "./pages/Distributor/PaymentFailed";
import CallHistory from "./pages/Dashboard/CallHistory";
import Contacts from "./pages/Dashboard/Contacts";
import RazorpayCheck from "./pages/Dashboard/RazorpayPaymentValidation";
import AdminDepartments from "./pages/Admin/AdminDepartments";
import NotFound from "./pages/NotFound";
import QrCode from "./components/Dashboard/QrCode";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="*" element={<NotFound />} />
        {/* default for all guest and user */}
        <Route path="/" element={<AuthForm />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} /> */}
        <Route path="/room" element={<RoomPage />} />
        <Route path="/userInfo" element={<UserInfo />} />

        {/* user Dashboard with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contacts" element={<Contacts />} />
          {/* <Route path="call-history" element={<CallHistory />} /> */}

          {/* <Route path="success" element={<Success />} /> */}
          {/* <Route path="failed" element={<Failed />} /> */}
          {/* <Route path="subscriptions" element={<Subscriptions />} /> */}
          {/* <Route path="razorpay" element={<RazorpayCheck />} /> */}
          {/* <Route path="transactions" element={<TransactionPage />} /> */}
        </Route>

        {/* admin */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="qr-code" element={<QrCode />} />
          {/* <Route path="subscriptions" element={<AdminSubscription />} /> */}
          {/* <Route path="transactions" element={<AdminTransaction />} /> */}
          {/* <Route path="about" element={<AdminAbout />} /> */}
          {/* <Route path="contact" element={<AdminContact />} /> */}
          {/* <Route path="terms" element={<AdminTerms />} /> */}
          {/* <Route path="privacy" element={<AdminPrivacy />} /> */}
          {/* <Route path="credit" element={<AdminCredit />} /> */}
          {/* <Route path="distributor" element={<AdminDistributor />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
