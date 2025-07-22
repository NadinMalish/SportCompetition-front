import React from 'react';
import './Event.css';
import { type EventInfo } from '../../services/EventCompetitionService';

interface Props {
  event: EventInfo;
}

const format = (date: Date | string) =>
  new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const Event: React.FC<Props> = ({ event }) => {
  const now = new Date();

  let badgeText = 'Регистрация открыта';
  let badgeMod  = 'open';

  if (now < new Date(event.registrationDate)) {
    badgeText = 'Регистрация скоро';
    badgeMod  = 'coming';
  } else if (now > new Date(event.registryDate)) {
    badgeText = 'Регистрация закрыта';
    badgeMod  = 'closed';
  }

  return (
    <div className="event-item">
      <div className="event-item__left">
        <div className="event-item__title-wrap">
          <h3 className="event-item__title">{event.name}</h3>

          <span className={`event-item__badge event-item__badge--${badgeMod}`}>
            {badgeText}
          </span>
        </div>

        <span className="event-item__date">
          {format(event.beginDate)} – {format(event.endDate)}
        </span>
      </div>

      <button className="event-item__arrow" aria-label="Подробнее">
        ›
      </button>
    </div>
  );
};

export default Event;