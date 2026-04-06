
import { useState, useEffect, useRef } from 'react';
import { events } from '../../data/mockData';
import { classifyEvent, sortEvents, formatEventDate, getHappeningSoon } from '../../utils/dateUtils';

const Events = () => {
    const [filter, setFilter] = useState('upcoming');
    const [hoveredEventId, setHoveredEventId] = useState(null);
    const containerRef = useRef(null);
    const animationIdRef = useRef(null);
    const isHoveringRef = useRef(false);
    const [isHovering, setIsHovering] = useState(false);

    const resolvedEvents = events.map((event) => ({
        ...event,
        start: new Date(event.startDate || event.date),
        end: new Date(event.endDate || event.date)
    }));

    const filteredEvents = sortEvents(
        resolvedEvents.filter((event) => {
            const category = classifyEvent(event);
            if (filter === 'all') return true;
            return category === filter;
        }),
        filter
    );

    const useCarousel = filteredEvents.length > 3;
    const displayEvents = useCarousel
        ? [...filteredEvents, ...filteredEvents, ...filteredEvents]
        : filteredEvents;

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !useCarousel) return;

        const scrollSpeed = 1;

        const animate = () => {
            if (!isHoveringRef.current && container.scrollWidth > container.clientWidth) {
                container.scrollLeft += scrollSpeed;
                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft >= maxScroll - 2) {
                    container.scrollLeft = 0;
                }
            }
            animationIdRef.current = requestAnimationFrame(animate);
        };

        animationIdRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationIdRef.current);
    }, [useCarousel, filter]);

    const handleHover = (hovering) => {
        isHoveringRef.current = hovering;
        setIsHovering(hovering);
    };

    const capitalizeLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

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
                        {capitalizeLabel(type)}
                    </button>
                ))}
            </div>

            <div
                className={`events-grid ${useCarousel ? 'carousel-mode' : ''}`}
                ref={containerRef}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
            >
                {displayEvents.map((event, idx) => {
                    const category = classifyEvent(event);
                    const isSoon = getHappeningSoon(event);
                    return (
                        <div
                            className={`event-card ${category === 'upcoming' ? 'event-upcoming' : category === 'ongoing' ? 'event-ongoing' : 'event-past'} ${hoveredEventId === (event.id || `${event.title}-${idx}`) ? 'event-highlighted' : ''}`}
                            key={`${event.id || event.title}-${idx}`}
                            onMouseEnter={() => { handleHover(true); setHoveredEventId(event.id || `${event.title}-${idx}`); }}
                            onMouseLeave={() => { handleHover(false); setHoveredEventId(null); }}
                            style={{ animation: `fadeInUp 0.55s ease-out forwards`, animationDelay: `${idx * 0.04}s`, opacity: 0 }}
                        >
                            <div className="event-header">
                                <span className="event-chip">{capitalizeLabel(category)}</span>
                                {category === 'ongoing' && <span className="event-pill">Happening Today</span>}
                                {isSoon && <span className="event-pill">Happening Soon</span>}
                            </div>

                            <h3 className="event-title">{event.title}</h3>

                            <div className="event-meta">
                                <span>📅 {formatEventDate(event.date, event.time)}</span>
                                <span className="event-location">📍 {event.location || 'VIT Chennai'}</span>
                            </div>

                            <p className="event-description">
                                {event.description || 'Join our upcoming event for hands-on learning and community collaboration.'}
                            </p>

                            <div className="event-footer">
                                <button className="btn btn-secondary event-cta">Learn More</button>
                            </div>
                        </div>
                    );
                })}

                {filteredEvents.length === 0 && (
                    <div className="empty-state-box">
                        <div className="empty-icon">📅</div>
                        <p>No {capitalizeLabel(filter)} events at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Events;
