import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./EventPage.css";
import Competition from "./Competition";
import { useParams } from "react-router-dom";
import { fetchEventById, listEventDocs, listCompetitionDocs, downloadUrl, type DocItem, type EventInfo } from "../../services/EventCompetitionService";
import axios from "axios";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [eventDocs, setEventDocs] = useState<DocItem[]>([]);
  const [compDocs, setCompDocs] = useState<Record<number, DocItem[]>>({});

  useEffect(() => {
    const abort = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchEventById(Number(id), abort.signal);
        const ev = data as unknown as EventInfo;
        setEvent(ev);

        // грузим документы мероприятия
        const [evDocs, perCompetition] = await Promise.all([
          listEventDocs(Number(id)),
          // на каждое состязание — запрос документов
          Promise.all(
            (ev.competitions ?? []).map(async c => {
              const docs = await listCompetitionDocs(c.id);
              return [c.id, docs] as const;
            })
          ),
        ]);

        setEventDocs(evDocs);
        setCompDocs(Object.fromEntries(perCompetition)); // { [competitionId]: DocItem[] }
      } catch(e: unknown) {
        if (axios.isCancel?.(e)) {
          return;
      }
        console.error(e);
        setError("Не удалось загрузить событие");
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [id]);

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

                {/* документы мероприятия */}
                {eventDocs.length > 0 && (
                  <div className="eventPage__docs">
                    <strong>Документы мероприятия:</strong>
                    <ul>
                      {eventDocs.map(d => (
                        <li key={d.id}>
                          <a href={downloadUrl(d.id)}>
                            {d.fileName ?? `Документ #${d.id}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                  docs={compDocs[c.id]}
                  makeDownloadLink={downloadUrl}
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
