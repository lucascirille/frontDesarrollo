import { Outlet } from "react-router-dom";
import Layout from "./components/layout";
import LayoutCliente from "./components/layoutCliente";

export default function Root() {
  
  const isAdmin = false;

  return (
    <>
      {isAdmin ? (
        <Layout>
          <Outlet />
        </Layout>
      ) : (
        <LayoutCliente>
          <Outlet />
        </LayoutCliente>
      )}
    </>
  );
}
