import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import MainSidebar from "@/components/shared/MainSidebar";
import PageWrapper from "@/lib/framer-motion/PageWrapper";

const RootLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null
    ) {
      navigate("/sign-in");
    }
  }, []);

  return (
    <div className="w-full md-flex md:ms-[270px]">
      <Topbar />
      <section className="root-container">
        <MainSidebar />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </section>

      <Bottombar />
      <div dir="ltr">
        <ReactQueryDevtools />
      </div>
    </div>
  );
};

export default RootLayout;
