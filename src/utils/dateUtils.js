/**
 * Utility functions for date handling and event classification
 */

const normalizeToMidnight = (input) => {
  const date = new Date(input);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const classifyEvent = (event) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const start = new Date(event.startDate || event.date || event);
  const end = new Date(event.endDate || event.date || event);

  const startOfStart = normalizeToMidnight(start);
  const endOfEnd = new Date(end);
  endOfEnd.setHours(23, 59, 59, 999);

  if (endOfEnd < now) return 'past';
  if (startOfStart > now) return 'upcoming';
  return 'ongoing';
};

export const getHappeningSoon = (event) => {
  const start = new Date(event.startDate || event.date || event);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (classifyEvent(event) !== 'upcoming') return false;

  const daysDiff = Math.ceil((normalizeToMidnight(start) - now) / (1000 * 60 * 60 * 24));
  return daysDiff <= 14;
};

export const sortEvents = (events, filter = 'all') => {
  const clone = [...events];

  return clone.sort((a, b) => {
    const aStart = new Date(a.startDate || a.date || a);
    const bStart = new Date(b.startDate || b.date || b);

    const aClass = classifyEvent(a);
    const bClass = classifyEvent(b);

    if (filter === 'upcoming') {
      if (aClass !== bClass) return aClass === 'upcoming' ? -1 : 1;
      return aStart - bStart;
    }

    if (filter === 'ongoing') {
      if (aClass !== bClass) return aClass === 'ongoing' ? -1 : 1;
      return aStart - bStart;
    }

    if (filter === 'past') {
      if (aClass !== bClass) return aClass === 'past' ? -1 : 1;
      return new Date(b.date || bStart) - new Date(a.date || aStart);
    }

    // All
    if (aClass !== bClass) {
      const order = { upcoming: 0, ongoing: 1, past: 2 };
      return order[aClass] - order[bClass];
    }
    return aStart - bStart;
  });
};

export const formatEventDate = (dateString, timeString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (timeString) {
    return `${formattedDate} · ${timeString}`;
  }

  return formattedDate;
};
