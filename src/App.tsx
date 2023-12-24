import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./globals.css";

import { SignInForm, SignUpForm } from "./_auth/forms";
import AuthLayout from "./_auth/AuthLayout";

import {
  AllUsers,
  CreatePost,
  Explore,
  Home,
  LikedPosts,
  PostDetails,
  Profile,
  Saved,
  UpdatePost,
  UpdateProfile,
} from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <main className="flex min-h-screen">
      <Helmet>
        <title>سیرکلیفای</title>
        <meta
          name="description"
          content="بر پایهٔ Circlify، ارتباطات و گفتگوهایتان را تقویت کنید؛ این پلتفرم پویا، تعاملات بی‌درنگ، جوامع پرانرژی، و فرصت‌های شبکه‌سازی بی‌حد را برای هر کاربر فراهم می‌کند"
        />
        <meta
          name="keywords"
          content="Circlify, سیرکلیفای, social media, react app, vite, Social networking, Online community, Social platform, Connectivity, Interaction, User engagement, Sharing experiences, Networking opportunities, Digital connections, Community building, Online conversations, Collaborative spaces, Virtual communities, User-generated content, User-generated content"
        />
        <meta name="subject" content="شبکه اجتماعی سیرکلیفای" />
        <meta name="copyright"content="Omid Hajizadeh" />
        <meta name="language" content="fa"></meta>
      </Helmet>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        {/* Private Routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<UpdatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
