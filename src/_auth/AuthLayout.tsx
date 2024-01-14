import { Outlet, useNavigate } from "react-router-dom";

import PageWrapper from "@/lib/framer-motion/PageWrapper";
import { useEffect } from "react";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") !== "[]" &&
      localStorage.getItem("cookieFallback") !== null
    ) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10 bg-auth bg-no-repeat bg-cover bg-center">
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </section>
    </>
  );
};

export default AuthLayout;
