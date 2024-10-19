import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../helpers/autenticacion/validationSchemas';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { iniciarSesion } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    await iniciarSesion(data); 
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <input
          type="text"
          className="form-control"
          id="nombreUsuario"
          {...register('nombreUsuario')}
        />
        {errors.nombreUsuario && <p className="text-danger">{errors.nombreUsuario.message}</p>}
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          id="clave"
          {...register('clave')}
        />
        {errors.clave && <p className="text-danger">{errors.clave.message}</p>}
      </div>

      <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
    </form>
  );
};

export default LoginForm;
