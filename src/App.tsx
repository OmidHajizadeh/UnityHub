import { Route, Routes, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";

import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import "./globals.css";
import Home from "./_root/pages/Home";
import ExploreFallback from "./components/suspense-fallbacks/ExploreFallback";
import AllUsersFallback from "./components/suspense-fallbacks/AllUsersFallback";
import PostDetailsFallback from "./components/suspense-fallbacks/PostDetailsFallback";
import Spinner from "./components/loaders/Spinner";
import ProfileFallback from "./components/suspense-fallbacks/ProfileFallback";

const SignInForm = lazy(() => import("./_auth/forms/SignInForm"));
const SignUpForm = lazy(() => import("./_auth/forms/SignUpForm"));
const Explore = lazy(() => import("./_root/pages/Explore"));
const AllUsers = lazy(() => import("./_root/pages/AllUsers"));
const CreatePost = lazy(() => import("./_root/pages/CreatePost"));
const UpdatePost = lazy(() => import("./_root/pages/UpdatePost"));
const PostDetails = lazy(() => import("./_root/pages/PostDetails"));
const Profile = lazy(() => import("./_root/pages/Profile"));
const UpdateProfile = lazy(() => import("./_root/pages/UpdateProfile"));

function App() {
  const location = useLocation();
  return (
    <main className="flex min-h-screen">
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
      <AnimatePresence mode="wait">
        <Routes key={location.key} location={location.pathname}>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/sign-in"
              element={
                <Suspense fallback={<Spinner size={50} />}>
                  <SignInForm />
                </Suspense>
              }
            />
            <Route
              path="/sign-up"
              element={
                <Suspense fallback={<Spinner size={50} />}>
                  <SignUpForm />
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
              path="/update-profile/:id"
              element={
                <Suspense fallback={<Spinner size={50} />}>
                  <UpdateProfile />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
      <Toaster />
      <SonnerToaster />
    </main>
  );
}

export default App;
