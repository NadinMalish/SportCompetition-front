import React, { useMemo } from 'react';
import { type EventInfo } from '../../services/EventCompetitionService';
import Event from '../Event/Event';
import './EventList.css';


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
  events?: EventInfo[];
  currentPage: number; 
  totalPages: number;
   onPageChange: (page: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events = [], currentPage, totalPages, onPageChange }) => {
  console.log(currentPage);
  console.log(totalPages);
  
  //Группировка событий по дню начала
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

    //Сортировка по дате
    return Array.from(map.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [events]);

  const visiblePages = useMemo(() => {
    // Показываем 1 … (p-2) (p-1) p (p+1) (p+2) … last
    const delta = 2;
    const pages: (number | "dots")[] = [];

    const add = (p: number | "dots") => pages[pages.length - 1] !== p && pages.push(p);

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || Math.abs(i - currentPage) <= delta) {
        add(i);
      } else if (pages[pages.length - 1] !== "dots") {
        add("dots");
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="day-list">
      {dayGroups.map(({ date, events }) => {
        const { day, weekday } = getDateParts(date);

        return (
          <section key={date.toISOString()} className="day-group">
            <div className="day-group__date">
              <span className="day-group__day">{day}</span>
              <span className="day-group__weekday">{weekday}</span>
            </div>

            <ul className="day-group__events">
              {events.map((ev) => (
                <li key={ev.id}>
                  <Event event={ev} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

    <nav className="pagination" aria-label="Навигация по страницам">
        <button 
          className="pagination__btn" 
          aria-label="Предыдущая страница"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}            
          >‹</button>

      {visiblePages.map((p, idx) =>
        p === "dots" ? ( <span key={`dots-${idx}`} className="pagination__page">…</span> ) : (
          <button
            key={p}
            className={
              "pagination__page" +
              (p === currentPage ? " pagination__page--current" : "")
            }
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        aria-label="Следующая страница"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  </div>
  );
};

export default EventList;
