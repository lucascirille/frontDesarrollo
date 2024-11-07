import React from 'react';
import '../styles/nosotros.css';
import anime from 'animejs';
import { useEffect, useRef } from 'react';
import Footer from './components/footer';
import { Container, Row, Col } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Nosotros() {
    const contentBox = useRef(null);

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
            <div id="home" className="about-container">
                <header className="about-header">
                    <h1 className="about-title">Conoce EventCraft</h1>
                    <p className="about-subtitle">Tu espacio ideal para eventos inolvidables</p>
                </header>
            </div>

            <div className="about-content">
                <div className="section-container">
                    <h2 className="section-title">¿Quiénes somos?</h2>
                    <p className="section-description">
                        En EventCraft nos especializamos en ofrecer espacios de calidad para todo tipo de eventos.
                        Con una atención personalizada y un enfoque
                        en crear experiencias únicas, nuestro sistema está diseñado para adaptarse a tus necesidades.
                    </p>
                </div>

                <div className="section2-container">
                    <div className="backgroundN-image">
                        <div ref={contentBox} className="contentN-box">
                            <h2 className="section-title">Nuestra Misión</h2>
                            <p className="section-description">
                                Nuestra misión es brindarte un lugar excepcional para que puedas crear recuerdos inolvidables
                                junto a tus seres queridos o colegas. Nos comprometemos a ofrecer un servicio de excelencia,
                                con todas las comodidades y la tecnología para que tu evento sea todo un éxito.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="section3-container">
                    <h2 className="section-title">Nuestros Valores</h2>
                    <Container>
                        <Row className="values-row">
                            <Col xs={12} md={6} lg={3} className="value-item">
                                <div className="value-box value-color-1">
                                    <h3 className="value-title">Calidez y Personalización</h3>
                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={3} className="value-item">
                                <div className="value-box value-color-2">
                                    <h3 className="value-title">Excelencia en el servicio</h3>
                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={3} className="value-item">
                                <div className="value-box value-color-3">
                                    <h3 className="value-title">Innovación y Tecnología</h3>
                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={3} className="value-item">
                                <div className="value-box value-color-4">
                                    <h3 className="value-title">Compromiso con la experiencia del cliente</h3>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div className="section-container">
                    <h2 className="section-title">¿Por qué elegirnos?</h2>
                    <p className="section-description">
                        Nuestra empresa se encuentra ubicada en el corazón de Florencio Varela.
                        Ofrecemos opciones personalizadas, paquetes preestablecidos y espacios interiores y exteriores
                        para adaptarnos a cualquier tipo de evento.
                    </p>
                </div>

                <div className="contact-section">
                    <div className='contact-text'>
                        <h2 className="section-title">TU EVENTO, </h2>
                        <h1 className="contact-title">UN RECUERDO INOLVIDABLE</h1>
                        <br/>
                        <div className="contact-info">
                            <p><i className="fas fa-phone-alt"></i> +54 9 11 2345-6789</p>
                            <p><i className="fas fa-envelope"></i> contacto@eventcraft.com</p>
                            <p><i className="fas fa-map-marker-alt"></i> Calle Ficticia 123, Florencio Varela, Buenos Aires</p>
                        </div>
                    </div>
                    <img src="/images/EVENTCRAFT.jpeg" alt="Imagen de contacto" className="contact-image" />
                </div>
            </div>
            <Footer />
        </>
    )
}