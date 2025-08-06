import './App.css';
import Filter from '../Filter/Filter';
import EventList from '../EventList/EventList';
import { useEffect, useRef, useState } from 'react';
import { fetchEvents, type EventInfo } from '../../services/EventCompetitionService';
import type { AxiosError } from 'axios';
import axios from 'axios';

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function useDelayedFlag(value: boolean, delay = 250): boolean {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    // если началась загрузка — ждём delay мс перед показом спиннера
    if (value) {
      const id = setTimeout(() => setFlag(true), delay);
      return () => clearTimeout(id);        // отменяем, если загрузка успела закончиться
    }
    // если загрузка закончилась — прячем индикатор мгновенно
    setFlag(false);
  }, [value, delay]);

  return flag;
}

function App() {   
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounced(query.trim(), 300);
    const abort = useRef<AbortController | null>(null);
    const [events, setEvents] = useState<EventInfo[]>([]);
    const [page, setPage] = useState<number>(1);
    const [countPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const showSpinner = useDelayedFlag(loading, 250);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    //const [typeRegistration, setTypeRegistration] = useState<string | null>(null);

    useEffect(() => setPage(1), [debouncedQuery]);
    useEffect(() => {
      
      abort.current?.abort();                          // отменяем предыдущий fetch
      const controller = new AbortController();
      abort.current = controller;

      const load = async () => {
        try {
          setLoading(true);
          const data = await fetchEvents(page, 10, debouncedQuery, startDate, endDate, controller.signal);
          setEvents(data.events);
          setTotalPages(Math.max(1, Math.ceil(data.totalCount / 10)));
        } catch (e) {
           if (axios.isCancel(e) || (e as AxiosError).code === "ERR_CANCELED") {
            return;
          }
          setError('Не удалось загрузить мероприятия');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

    load();
     return () => controller.abort();
  }, [page, debouncedQuery, startDate, endDate]);


  return (
    <>
      <header className="siteHeader">
        <a href="/"><img src="/logo.svg" className="logo" alt="Sport Competition" /></a>
      </header>

      <main className="content">
        <div className="eventLayout">
          <Filter onStartDateChanged={setStartDate} onEndDateChanged={setEndDate} />
          <div className="eventsArea">
            <div className="topBar">
              <input
                type="search"
                placeholder="Поиск..."
                className="searchInput"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button className="sortBtn" aria-label="Сортировать A-Z">A↕Z</button>
            </div>

            <h1 className="pageTitle">Мероприятия</h1>

            <div className="eventsWrapper">
              {showSpinner && <p className='loadingLabel'>Загрузка...</p>}
              {error && <p className='error'>{error}</p>}
              {!loading && !error && events.length !== 0 && <EventList 
                events={events}
                currentPage={page}
                totalPages={countPages}
                onPageChange={setPage}
                />}
              {!loading && !error && events.length === 0 && (
                <p className="loadingLabel">Ничего не найдено</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
