import { useState, useEffect } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getUsuarios, createUsuario, deleteUsuario, updateUsuario } from '../helpers/usuarios/usuariosService';
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import '../styles/salonesForm.css'
import '../styles/errors.css'

const schema = yup.object({
    nombreUsuario: yup.string().required("Este campo es obligatorio"),
    nombre: yup.string().required("Este campo es obligatorio"),
    apellido: yup.string().required("Este campo es obligatorio"),
    correo: yup.string().email('el correo electronico no es valido').required('el correo electronico es requerido'),
    rol: yup.string().required("Este campo es obligatorio"),
    claveHasheada: yup.string().required('La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }).required();

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioAEditar, setusuarioAEditar] = useState(null);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [showUsuarios, setshowUsuarios] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        async function ObtenerUsuarios() {
            try {
                const response = await getUsuarios();
                setUsuarios(response.data.datos);
                console.log(response.data);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerUsuarios(); 
    }, []);

    const onSubmit = async (data) => {
        try {
            if (usuarioAEditar) {
                await updateUsuario(usuarioAEditar.id, data);
                setUsuarios(usuarios.map(usuario => usuario.id === usuarioAEditar.id 
                    ? { ...data, id: usuarioAEditar.id } 
                    : usuario));
                setusuarioAEditar(null);  
            } else {
                console.log(data);
                const response = await createUsuario(data);
                setUsuarios([...usuarios, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            console.log("Mensaje de error", error.message);
            if (error.message === "El usuario que intenta crear ya existe" || error.message === "Ya existe un usuario con el mismo nombre. Elija otro nombre."){
                console.error('Error al crear:', error);
                setError("nombreUsuario", { type: "manual", message: "El usuario que intenta crear ya existe" });
            } else {
                console.error("Error:", error);
                setError("form", { type: "manual", message: "Error al crear el usuario." });
            }
        }
    };


    const handleDeleteUsuario = (usuarioId) => {
        setUsuarioAEliminar(usuarioId);
        setShowConfirmDialog(true);
    };

    const handleEditUsuario = (usuario) => {
        setusuarioAEditar(usuario);
        setFormVisible(true);
    };

    const confirmarDeleteUsuario = async () => {
        try {
            await deleteUsuario(usuarioAEliminar);
            setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioAEliminar));
            setUsuarioAEliminar(null); 
            setshowUsuarios(true);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            setError("Error al eliminar el usuario.");
        }
    };

    const cancelarDeleteUsuario = () => {
        setUsuarioAEliminar(null); 
        setshowUsuarios(true);
        setShowConfirmDialog(false);
    };

    return(
        <>
            <Container>
                <h1>USUARIOS</h1> 
                <hr/>
                <br/>
                {showUsuarios && !formVisible && !usuarioAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear Usuario
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{usuarioAEditar ? "Editar Usuario" : "Alta Usuario"}</h2>
                    <div className="separator"></div>
                    <br/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="nombreUsuario">
                                    <Form.Label>Nombre de Usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre de Usuario"
                                        {...register("nombreUsuario")}
                                    />
                                    {errors.nombreUsuario && <p className="error-message">{errors.nombreUsuario.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre"
                                        {...register("nombre")}
                                    />
                                    {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="apellido">
                                    <Form.Label>Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Apellido"
                                        {...register("apellido")}
                                    />
                                    {errors.apellido && <p className="error-message">{errors.apellido.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="correo">
                                    <Form.Label>Correo electronico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Correo electronico"
                                        {...register("correo")}
                                    />
                                    {errors.correo && <p className="error-message">{errors.correo.message}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="rol">
                                    <Form.Label>Rol</Form.Label>
                                    <Form.Select {...register("rol")}>
                                        <option value="">Seleccione un rol</option>
                                        <option value="admin">Admin</option>
                                        <option value="cliente">Cliente</option>
                                    </Form.Select>
                                    {errors.rol && <p className="error-message">{errors.rol.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="claveHasheada">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Contraseña"
                                        {...register("claveHasheada")}
                                    />
                                    {errors.claveHasheada && <p className="error-message">{errors.claveHasheada.message}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Guardar Usuario
                            </Button>
                            <Button variant="primary" className="ms-2" onClick={() => {setFormVisible(false); setusuarioAEditar(null); reset();}}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                    </>
                )}

                {showUsuarios && !formVisible && usuarios && (
                    <div>
                        {usuarios.map((usuario) => (
                            <div key={usuario.id}>
                                <hr />
                                <h3>{usuario.nombreUsuario}</h3>
                                <ul>
                                    <li>Nombre: {usuario.nombre}</li>
                                    <li>Apellido: {usuario.apellido}</li>
                                    <li>Correo: {usuario.correo}</li>
                                    <li>Rol: {usuario.rol}</li>
                                </ul>
                                <Button variant="danger" onClick={() => handleDeleteUsuario(usuario.id)}>Eliminar</Button>
                                <Button variant="warning" className="ms-2" onClick={() => handleEditUsuario(usuario)}>Editar</Button>
                            </div>
                        ))}
                    </div>
                )}

                {usuarioAEliminar && (
                    <ConfirmarEliminacion
                        show={showConfirmDialog} 
                        onConfirm={confirmarDeleteUsuario}
                        onCancel={cancelarDeleteUsuario}
                    />
                )}
            </Container>
        </>
    );
}