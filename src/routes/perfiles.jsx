import { Link, Outlet } from "react-router-dom";

export default function Perfiles() {
  const perfiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      {
        perfiles.map((perfil) => (
          <Link key={perfil} to={`/perfil/${perfil}`}>
            Perfil {perfil}
          </Link>
        ))
      }
      <div>
        <Outlet />
      </div>
    </>
  );
}
