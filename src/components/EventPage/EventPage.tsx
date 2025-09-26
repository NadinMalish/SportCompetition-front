import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./EventPage.css";
import Competition from "./Competition";
import { useParams } from "react-router-dom";
import { fetchEventById, type EventInfo } from "../../services/EventCompetitionService";

// форматирование дат
const fmt = (iso?: Date) => {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d.toLocaleDateString("ru-RU");
};
const range = (a?: Date, b?: Date) => {
  const A = fmt(a);
  const B = fmt(b);
  if (A && B) return `${A} – ${B}`;
  return A ?? B ?? "";
};

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventInfo>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // <-- было undefined

  useEffect(() => {
    const abort = new AbortController();

    (async () => {
      try {
        setLoading(true); // <-- ставим перед запросом
        const data = await fetchEventById(Number(id), abort.signal);
        setEvent(data as unknown as EventInfo);
      } catch (e: any) {
        if (e?.name === "CanceledError") return;
        setError("Не удалось загрузить событие");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort(); // <-- cleanup, отменяем прошлый запрос
  }, [id]); // <-- важна зависимость

  if (loading) {
    return (
      <>
        <Header />
        <main className="content">
          <p className="loadingLabel">Загрузка…</p>
        </main>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Header />
        <main className="content">
          <p className="error">{error ?? "Событие не найдено"}</p>
        </main>
      </>
    );
  }

  const org = event.organizer
    ? `${event.organizer.firstname} ${event.organizer.surname} ${event.organizer.lastname ?? ""}`.trim()
    : null;

  return (
    <>
      <Header />
      <main className="content">
        <section className="eventPage">
          <article className="eventPage__hero card">
            <div className="eventPage__heroGrid">
              <div className="eventPage__heroText">
                <h1 className="eventPage__title">{event.name}</h1>

                <div className="eventPage__meta">
                  <span className="eventPage__date">
                    {range(event.beginDate, event.endDate)}
                  </span>
                  {org && (
                    <>
                      <span className="eventPage__dot">•</span>
                      <span className="eventPage__organizer">Организатор: {org}</span>
                    </>
                  )}
                </div>

                {event.description && (
                  <p className="eventPage__desc">{event.description}</p>
                )}
              </div>

              <div className="eventPage__media">
                <img className="eventPage__image" src="image.png" alt={event.name} />
              </div>
            </div>
          </article>

          <section className="eventPage__section">
            <h2 className="eventPage__asideTitle">Доступные состязания</h2>
            <ul className="eventPage__list">
              {event.competitions?.map((c) => (
                <Competition
                  key={c.id}
                  date={range(c.beginDate, c.endDate)}
                  title={c.name}
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
