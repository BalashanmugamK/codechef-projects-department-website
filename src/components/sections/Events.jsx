
import { useState, useEffect, useRef } from 'react';
import { events } from '../../data/mockData';
import { getAnimationDelayStyle } from '../../utils/animationUtils';

const Events = () => {
    const [filter, setFilter] = useState('upcoming');
    const containerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === 'upcoming') return eventDate > today;
        if (filter === 'ongoing') return eventDate.getTime() === today.getTime();
        if (filter === 'past') return eventDate < today;
        return true;
    });

    // Determine if we should use carousel mode (> 3 items)
    const useCarousel = filteredEvents.length > 3;

    // Triple the items for infinite scroll illusion if carousel is active
    const displayEvents = useCarousel
        ? [...filteredEvents, ...filteredEvents, ...filteredEvents]
        : filteredEvents;

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !useCarousel) return;

        let animationId;
        const scrollSpeed = 1; // 1px per frame

        const performAutoScroll = () => {
            if (!isHovering && container.scrollWidth > container.clientWidth) {
                container.scrollLeft += scrollSpeed;
                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft >= maxScroll - 1) {
                    container.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(performAutoScroll);
        };

        animationId = requestAnimationFrame(performAutoScroll);
        return () => cancelAnimationFrame(animationId);
    }, [useCarousel, isHovering, filter]);

    return (
        <section className="section" id="events">
            <div className="section-header">
                <h2 className="section-title">Events</h2>
                <p className="section-subtitle">Upcoming workshops, hackathons, and community events</p>
            </div>

            <div className="tabs-container">
                {['all', 'upcoming', 'ongoing', 'past'].map((type) => (
                    <button
                        key={type}
                        className={`tab-btn ${filter === type ? 'active' : ''}`}
                        onClick={() => setFilter(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div
                className={`events-grid ${useCarousel ? 'carousel-mode' : ''}`}
                id="eventsDisplay"
                ref={containerRef}
                style={useCarousel ? { gap: '1.5rem' } : {}}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {displayEvents.map((event, idx) => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isUpcoming = eventDate > today;
                    const isOngoing = eventDate.getTime() === today.getTime();
                    const isPast = eventDate < today;
                    return (
                        <div
                            className={`event-card ${isUpcoming ? 'event-upcoming' : isOngoing ? 'event-ongoing' : 'event-past'}`}
                            key={`${event.id}-${idx}`}
                            style={{
                                animation: `fadeInUp 0.6s ease-out forwards`,
                                animationDelay: `${idx * 0.05}s`,
                                opacity: 0
                            }}
                        >
                            <div className="event-header">
                                <span className="event-chip">
                                    {isUpcoming ? 'UPCOMING' : isOngoing ? 'ONGOING' : 'PAST'}
                                </span>
                                {isOngoing && <span className="event-pill">Happening Today</span>}
                                {isUpcoming && <span className="event-pill">Happening Soon</span>}
                            </div>

                            <h3 className="event-title">{event.title}</h3>

                            <div className="event-meta">
                                <span>📅 {event.date}</span>
                                <span className="event-location">📍 VIT Chennai</span>
                            </div>

                            <p className="event-description">
                                {event.description || "Join us for an exciting session of learning and building."}
                            </p>

                            <div className="event-footer">
                                <button className="btn btn-secondary event-cta">Learn More</button>
                            </div>
                        </div>
                    );
                })}
                {filteredEvents.length === 0 && (
                    <div className="no-events-message" style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        width: '100%'
                    }}>
                        No upcoming events
                    </div>
                )}
            </div>
        </section >
    );
};

export default Events;
