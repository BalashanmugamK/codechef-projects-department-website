import { research as researchPapers } from '../../data/mockData';
import { useCarouselAutoScroll } from '../../utils/useScrollAnimations';
import { getAnimationDelayStyle } from '../../utils/animationUtils';

const Research = () => {
    const [carouselRef, isHovered, setIsHovered] = useCarouselAutoScroll(true);

    return (
        <section className="section" id="research">
            <div className="section-header">
                <h2 className="section-title">Research & Reviews</h2>
                <p className="section-subtitle">Academic contributions and paper reviews</p>
            </div>

            <div
                className="research-grid"
                id="researchDisplay"
                ref={carouselRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Duplicate for infinite scroll effect if needed, though useScrollAnimations targets the container scroll */}
                {[...researchPapers, ...researchPapers].map((paper, index) => (
                    <div className="research-card" key={`${paper.id}-${index}`}
                        style={{
                            minWidth: '350px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            animation: 'fadeInUp 0.6s ease forwards',
                            ...getAnimationDelayStyle(index % researchPapers.length)
                        }}
                    >
                        <div className="research-header" style={{ marginBottom: '1rem' }}>
                            <div className="paper-icon" style={{
                                width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)',
                                color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                                fontSize: '1.5rem'
                            }}>
                                {paper.type === 'Paper' ? '📄' : '📖'}
                            </div>
                            <span className="research-type" style={{
                                fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: '#3b82f6'
                            }}>
                                {paper.type}
                            </span>
                        </div>
                        <h3 className="research-title" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                            {paper.title}
                        </h3>
                        <p className="research-authors" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                            {paper.authors}
                        </p>
                        <p className="research-summary" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                            {paper.summary}
                        </p>
                        <a href={paper.link} className="research-link" target="_blank" rel="noopener noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)',
                            fontWeight: 600, textDecoration: 'none', transition: 'gap 0.2s'
                        }}>
                            Read Paper 🔗
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Research;
