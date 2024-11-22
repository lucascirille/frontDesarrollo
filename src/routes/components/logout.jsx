import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/logout.css' 

const LogoutForm = () => {
  const { cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    handleSubmit,
  } = useForm(); 

  const onSubmit = async () => {
    await cerrarSesion();  
    navigate('/');  
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <div className="logout-container">
      <div className="logout-form">
        <form onSubmit={handleSubmit(onSubmit)} className="text-center">
          <h2 className="text-center mb-4">Cerrar Sesión</h2>
          <div className="mb-3">
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
          </div>

          <button type="submit" className="btn btn-danger me-2">Cerrar Sesión</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogoutForm;

