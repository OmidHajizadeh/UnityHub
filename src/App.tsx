import { Route, Routes } from "react-router-dom";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { SignInForm, SignUpForm } from "./_auth/forms";
import AuthLayout from "./_auth/AuthLayout";

import { AllUsers, CreatePost, Explore, Home, LikedPosts, PostDetails, Profile, Saved, UpdatePost, UpdateProfile } from "./_root/pages";
import RootLayout from "./_root/RootLayout";

function App() {
  return (
    <main className="flex min-h-screen">
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
