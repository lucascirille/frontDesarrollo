import { useParams } from "react-router-dom";

export default function Perfil() {
  const param = useParams();

  return (
    <div>
      <h1>Perfil {param.Id}</h1>
    </div>
  );
}

