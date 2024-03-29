import { Route, Routes, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";

import AuthLayout from "@/_auth/AuthLayout";
import SignInForm from "@/_auth/forms/SignInForm";
import Home from "@/_root/pages/Home";
import Offline from "@/_root/pages/Offline";
import NotFound from "@/_root/pages/NotFound";
import RootLayout from "@/_root/RootLayout";
import Spinner from "@/components/loaders/Spinner";
import AuditsFallback from "@/components/suspense-fallbacks/AuditsFallback";
import ProfileFallback from "@/components/suspense-fallbacks/ProfileFallback";
import ExploreFallback from "@/components/suspense-fallbacks/ExploreFallback";
import AllUsersFallback from "@/components/suspense-fallbacks/AllUsersFallback";
import PostDetailsFallback from "@/components/suspense-fallbacks/PostDetailsFallback";

import "./globals.css";

const SignUpForm = lazy(() => import("./_auth/forms/SignUpForm"));
const ForgetPasswordForm = lazy(
  () => import("./_auth/forms/ForgetPasswordForm")
);
const ResetPasswordForm = lazy(() => import("./_auth/forms/ResetPasswordForm"));
const Explore = lazy(() => import("./_root/pages/Explore"));
const AllUsers = lazy(() => import("./_root/pages/AllUsers"));
const CreatePost = lazy(() => import("./_root/pages/CreatePost"));
const UpdatePost = lazy(() => import("./_root/pages/UpdatePost"));
const PostDetails = lazy(() => import("./_root/pages/PostDetails"));
const Profile = lazy(() => import("./_root/pages/Profile"));
const UpdateProfile = lazy(() => import("./_root/pages/UpdateProfile"));
const Audits = lazy(() => import("./_root/pages/Audits"));

function App() {
  const location = useLocation();
  if (!navigator.onLine) {
    console.log("from app.tsx");

    return <Offline />;
  }
  return (
    <>
      <Helmet>
        <title>یونیتی هاب</title>
        <meta
          name="description"
          content="بر پایهٔ UnityHub، ارتباطات و گفتگوهایتان را تقویت کنید؛ این پلتفرم پویا، تعاملات بی‌درنگ، جوامع پرانرژی، و فرصت‌های شبکه‌سازی بی‌حد را برای هر کاربر فراهم می‌کند"
        />
        <meta
          name="keywords"
          content="UnityHub, یونیتی هاب, social media, react app, vite, Social networking, Online community, Social platform, Connectivity, Interaction, User engagement, Sharing experiences, Networking opportunities, Digital connections, Community building, Online conversations, Collaborative spaces, Virtual communities, User-generated content, User-generated content"
        />
        <meta name="subject" content="شبکه اجتماعی یونیتی هاب" />
        <meta name="copyright" content="Omid Hajizadeh" />
        <meta name="language" content="fa" />
        <meta name="theme-color" content="#877EFF" />
      </Helmet>
      <main className="flex min-h-screen">
        <AnimatePresence mode="wait">
          <Routes key={location.key} location={location.pathname}>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignInForm />} />
              <Route
                path="/sign-up"
                element={
                  <Suspense fallback={<Spinner size={50} />}>
                    <SignUpForm />
                  </Suspense>
                }
              />
              <Route
                path="/forget-password"
                element={
                  <Suspense fallback={<Spinner size={50} />}>
                    <ForgetPasswordForm />
                  </Suspense>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <Suspense fallback={<Spinner size={50} />}>
                    <ResetPasswordForm />
                  </Suspense>
                }
              />
            </Route>

            {/* Private Routes */}
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route
                path="/explore"
                element={
                  <Suspense fallback={<ExploreFallback />}>
                    <Explore />
                  </Suspense>
                }
              />
              <Route
                path="/all-users"
                element={
                  <Suspense fallback={<AllUsersFallback />}>
                    <AllUsers />
                  </Suspense>
                }
              />
              <Route
                path="/create-post"
                element={
                  <Suspense fallback={<Spinner size={50} />}>
                    <CreatePost />
                  </Suspense>
                }
              />
              <Route
                path="/audits"
                element={
                  <Suspense fallback={<AuditsFallback />}>
                    <Audits />
                  </Suspense>
                }
              />
              <Route
                path="/update-post/:id"
                element={
                  <Suspense fallback={<Spinner size={50} />}>
                    <UpdatePost />
                  </Suspense>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <Suspense fallback={<PostDetailsFallback />}>
                    <PostDetails />
                  </Suspense>
                }
              />
              <Route
                path="/profile/:id/*"
                element={
                  <Suspense fallback={<ProfileFallback />}>
                    <Profile />
                  </Suspense>
                }
              />
              <Route
                path="/update-profile"
                element={
                  <Suspense fallback={<Spinner size={50} />}>
                    <UpdateProfile />
                  </Suspense>
                }
              />
            </Route>

            {/* <Route path="/offline" element={<Offline />} /> */}

            <Route path="/*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
