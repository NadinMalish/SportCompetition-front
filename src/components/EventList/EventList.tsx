import React, { useMemo } from 'react';
import { type EventInfo } from '../../services/EventCompetitionService';
import Event from '../Event/Event';
import './EventList.css';   // ← вернули подключение CSS


/** Хелпер: превращаем Date → { day: '15', weekday: 'Пн' } */
const getDateParts = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
  const weekday = new Intl.DateTimeFormat('ru-RU', options)
    .format(date)
    .replace('.', '');          // убираем точку после «Пн.»
  return {
    day: date.getDate().toString().padStart(2, '0'),
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
  };
};

interface EventListProps {
  events: EventInfo[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  /** Группируем события по дню начала */
  const dayGroups = useMemo(() => {
    const map = new Map<
      string,
      { date: Date; events: EventInfo[] }
    >();

    events.forEach((e) => {
      const date = new Date(e.beginDate);          // ISO-строка → Date
      const key = date.toISOString().slice(0, 10); // YYYY-MM-DD

      if (!map.has(key)) {
        map.set(key, { date, events: [] });
      }
      map.get(key)!.events.push(e);
    });

    /** превращаем Map → массив и сортируем по дате **/
    return Array.from(map.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [events]);

  return (
    <div className="day-list">
      {dayGroups.map(({ date, events }) => {
        const { day, weekday } = getDateParts(date);

        return (
          <section key={date.toISOString()} className="day-group">
            {/* левая плашка с датой */}
            <div className="day-group__date">
              <span className="day-group__day">{day}</span>
              <span className="day-group__weekday">{weekday}</span>
            </div>

            {/* список мероприятий текущего дня */}
            <ul className="day-group__events">
              {events.map((ev) => (
                <li key={ev.id}>
                  {/* передаём объект события внутрь компонента Event */}
                  <Event event={ev} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

export default EventList;
