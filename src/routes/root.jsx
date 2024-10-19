import { Outlet } from "react-router-dom";
import Layout from "./components/layout";
import LayoutCliente from "./components/layoutCliente";
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";


export default function Root() {
  const { role } = useContext(AuthContext);

  return (
    <>
      { role === 'Admin' ? (
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
