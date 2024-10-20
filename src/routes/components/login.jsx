import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../helpers/autenticacion/validationSchemas';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { iniciarSesion, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await iniciarSesion(data); 
    if (success) {
      navigate('/'); 
    }
  };

  const handleRegister = () => {
    navigate('/register'); 
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

      {error && <p className="text-danger">{error}</p>}

      <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      <button type="button" className="btn btn-secondary" onClick={handleRegister}>
        Registrate
      </button>
    </form>
  );
};

export default LoginForm;
