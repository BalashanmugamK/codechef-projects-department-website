
import { useState } from 'react';
import { events } from '../../data/mockData';
import { getAnimationDelayStyle } from '../../utils/animationUtils';

const Events = () => {
    const [filter, setFilter] = useState('upcoming');

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (filter === 'upcoming') return eventDate >= today;
        if (filter === 'past') return eventDate < today;
        return true;
    });

    return (
        <section className="section" id="events">
            <div className="section-header">
                <h2 className="section-title">Events</h2>
                <p className="section-subtitle">Upcoming workshops, hackathons, and community events</p>
            </div>

            <div className="tabs-container">
                {['all', 'upcoming', 'past'].map((type) => (
                    <button
                        key={type}
                        className={`tab-btn ${filter === type ? 'active' : ''}`}
                        onClick={() => setFilter(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div className="events-grid carousel-mode" id="eventsDisplay">
                {filteredEvents.map((event, idx) => {
                    const eventDate = new Date(event.date);
                    const isUpcoming = eventDate >= new Date().setHours(0, 0, 0, 0);
                    return (
                        <div
                            className={`event-card ${isUpcoming ? 'event-upcoming' : 'event-past'}`}
                            key={event.id}
                            style={getAnimationDelayStyle(idx)}
                        >
                            <div className="event-header">
                                <span className="event-chip">
                                    {isUpcoming ? 'UPCOMING' : 'PAST'}
                                </span>
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
            </div>
        </section >
    );
};

export default Events;
