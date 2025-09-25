import React from "react";
import Header from "../Header/Header";
import "./EventPage.css";
import Competition from "./Competition";

const competitions = [
  {
    id: 1,
    date: "12.06.2024",
    title: "Бег с препятствиями",
    description:
      "Описание препятствий: этапы, правила, инвентарь. Укажите ограничение по времени, количество попыток и критерии победы.",
  },
  { id: 2, date: "12.06.2024", title: "Эстафета" },
  { id: 3, date: "13.06.2024", title: "Метание мяча" },
];

const EventPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="content">
        <section className="eventPage">
          <article className="eventPage__hero card">
            <div className="eventPage__heroGrid">
              <div className="eventPage__heroText">
                <h1 className="eventPage__title">Весёлые старты</h1>

                <div className="eventPage__meta">
                  <span className="eventPage__date">12.06.2024 – 13.06.2024</span>
                  <span className="eventPage__dot">•</span>
                  <span className="eventPage__organizer">Организатор: Иванов И. И.</span>
                </div>

                <p className="eventPage__desc">
                  Это информационное описание мероприятия. Кратко расскажите цель,
                  место проведения, требования к участникам и формат. Уточните, где
                  найти регламент и как задать вопросы.
                </p>
                <p className="eventPage__desc">
                  Второй абзац — детали по расписанию, наградам и безопасностям.
                  Если есть возрастные группы или деление по уровням — опишите это.
                </p>
              </div>

              <div className="eventPage__media">
                <img
                  className="eventPage__image"
                  src="https://images.unsplash.com/photo-1533560904424-6d1f1b1f1fbc?q=80&w=1200&auto=format&fit=crop"
                  alt="Иллюстрация мероприятия"
                />
              </div>
            </div>
          </article>

          <section className="eventPage__section">
            <h2 className="eventPage__asideTitle">Доступные состязания</h2>
            <ul className="eventPage__list">
              {competitions.map((c) => (
                <Competition
                  key={c.id}
                  date={c.date}
                  title={c.title}
                  description={c.description}
                />
              ))}
            </ul>
          </section>
        </section>
      </main>
    </>
  );
};

export default EventPage;
