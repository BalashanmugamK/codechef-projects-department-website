import { useState, useEffect } from 'react';
import { getAnimationDelayStyle } from '../../utils/animationUtils';

const About = () => {
    const [aboutText, setAboutText] = useState(
        "The Projects Department at CodeChef VIT Chennai focuses on collaborative, hands-on learning. We guide members through project-based workflows, industry best practices, and research opportunities. Our members contribute to open-source projects, organize workshops, and participate in cross-disciplinary initiatives that solve real problems."
    );

    useEffect(() => {
        const updateAbout = () => {
            const storedContent = JSON.parse(localStorage.getItem('contentData')) || {};
            if (storedContent.aboutText) {
                setAboutText(storedContent.aboutText);
            }
        };

        updateAbout();
        window.addEventListener('contentUpdate', updateAbout);
        return () => window.removeEventListener('contentUpdate', updateAbout);
    }, []);

    return (
        <section className="section" id="about">
            <div className="section-header">
                <h2 className="section-title">About Projects Department</h2>
                <p className="section-subtitle">
                    We build real-world applications, conduct research, and mentor students to ship impactful software.
                </p>
            </div>

            <div className="card about-card" style={{
                animation: 'fadeInUp 0.6s ease forwards',
                ...getAnimationDelayStyle(0)
            }}>
                <p>
                    {aboutText}
                </p>
            </div>
        </section>
    );
};

export default About;
