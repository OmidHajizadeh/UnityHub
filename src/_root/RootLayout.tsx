import { Outlet } from "react-router-dom";

import Bottombar from "@/components/shared/Bottombar";
import MainSidebar from "@/components/shared/MainSidebar";
import Topbar from "@/components/shared/Topbar";
import PageWrapper from "@/lib/framer-motion/PageWrapper";

const RootLayout = () => {
  return (
    <div className="w-full md-flex md:ms-[270px]">
      <Topbar />
      <section className="flex flex-1 h-full">
        <MainSidebar />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
