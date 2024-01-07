import { Navigate, Outlet } from "react-router-dom";

import PageWrapper from "@/lib/framer-motion/PageWrapper";
import { useUserContext } from "@/context/AuthContext";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <section className="flex flex-1 justify-center items-center flex-col py-10 bg-auth bg-no-repeat bg-cover bg-center">
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </section>
      )}
    </>
  );
};

export default AuthLayout;
