import React from 'react';
import '../styles/nosotros.css';
import anime from 'animejs';
import { useEffect, useRef } from 'react';

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
                <div className="section1-container">
                    <h2 className="section-title">¿Quiénes somos?</h2>
                    <p className="section-description">
                        En EventCraft nos especializamos en ofrecer espacios de calidad para todo tipo de eventos.
                        Con una atención personalizada y un enfoque
                        en crear experiencias únicas, nuestro sistema está diseñado para adaptarse a tus necesidades.
                    </p>
                </div>

                <div className="section2-container">
                    <div className="background-image">
                        <div ref={contentBox} className="content-box">
                            <h2 className="section-title">Nuestra Misión</h2>
                            <p className="section-description">
                                Nuestra misión es brindarte un lugar excepcional para que puedas crear recuerdos inolvidables
                                junto a tus seres queridos o colegas. Nos comprometemos a ofrecer un servicio de excelencia,
                                con todas las comodidades y la tecnología para que tu evento sea todo un éxito.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="video-container">
                    <video controls width="100%" className="video-player">
                        <source src="/videos/video1.mp4" type="video/mp4" />
                        Tu navegador no soporta el formato de video.
                    </video>
                </div>

                <div className="section3-container">
                    <h2 className="section-title">Nuestros Valores</h2>
                    <ul className="values-list">
                        <li>Calidez y Personalización</li>
                        <li>Excelencia en el servicio</li>
                        <li>Innovación y Tecnología</li>
                        <li>Compromiso con la experiencia del cliente</li>
                    </ul>
                </div>

                <div className="section4-container">
                    <h2 className="section-title">¿Por qué elegirnos?</h2>
                    <p className="section-description">
                        Nuestro salón está ubicado en el corazón de Florencio Varela, con acceso a estacionamiento
                        gratuito, seguridad y todas las comodidades para hacer de tu evento una experiencia única.
                        Ofrecemos opciones personalizadas, paquetes preestablecidos y espacios interiores y exteriores
                        para adaptarnos a cualquier tipo de evento.
                    </p>
                </div>
            </div>
        </>
    )
}