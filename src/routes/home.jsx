import '../styles/home.css';
import anime from 'animejs';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import imagenesCarrusel from '../helpers/home/imagenesCarrusel';
import { Carousel } from 'react-bootstrap';
import Footer from './components/footer';


export default function Home() {
    const contentBox = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Revisa si el contenedor es visible
                if (entries[0].isIntersecting) {
                    anime({
                        targets: contentBox.current,
                        scale: [1, 1.5],
                        opacity: [0.5, 1],
                        duration: 1000,
                        easing: 'easeInOutQuad',
                        direction: 'alternate',
                        loop: false
                    });
                    observer.unobserve(contentBox.current);
                }
            },
            { threshold: 0.1 } 
        );

        if (contentBox.current) {
            observer.observe(contentBox.current);
        }

        return () => {
            if (contentBox.current) {
                observer.unobserve(contentBox.current);
            }
        };
    }, []);


    return(
        <>
            <div id="home" className="home-container">
                <header >
                    <h1>EventCraft</h1>
                    <p>Tu historia, nuestro lugar</p>
                </header>
            </div>
            <div className="container1">
                <div className="backgroundH-image">
                    <div ref={contentBox} className="contentH-box">
                        <h2>Haciendo Historia</h2>
                        <h1>En Cada Evento</h1>
                        <p>
                            Rodeado de espacios verdes, EventCraft es una alternativa diferente, que ofrece un servicio personalizado y de excelencia, donde podrás encontrar profesionalismo y calidez. Inmerso en un amplio parque, sus alrededores y vistas son incomparables.
                        </p>
                        <button className="info-button" onClick={() => navigate('/nosotros')}>Más información</button>
                    </div>
                </div>
            </div>
            <div className='container2'>
                <h2>Salones con versatilidad para adaptarse
                a diferentes formatos.</h2>
                <button className="info-button" onClick={() => navigate('/salonesCliente')}>Conocé más</button>
            </div>

            <div className="image-buttons-container">
                <div className="image-container">
                    <img src="/images/paisaje5.jpg" alt="Imagen 1" />
                    <button className="image-button" onClick={() => navigate('/eventosSociales')}>Eventos Sociales</button>
                </div>
                <div className="image-container">
                    <img src="/images/paisaje4.jpg" alt="Imagen 2" />
                    <button className="image-button" onClick={() => navigate('/eventosCorporativos')}>Eventos Corporativos</button>
                </div>
            </div>

            <Carousel className="carousel-container">
                    {imagenesCarrusel.map((imagen, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={imagen}
                                alt={`Slide ${index + 1}`}
                            />
                        </Carousel.Item>
                    ))}
            </Carousel>
            <Footer/>
        </>
    )
}