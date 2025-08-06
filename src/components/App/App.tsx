import './App.css';
import Filter from '../Filter/Filter';
import EventList from '../EventList/EventList';
import { useEffect, useState } from 'react';
import { fetchEvents, type EventInfo } from '../../services/EventCompetitionService';
<<<<<<< Updated upstream
=======
import type { AxiosError } from 'axios';
import type { SortOrder } from '../EventList/EventList';
import axios from 'axios';
>>>>>>> Stashed changes



function App() {
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [countPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

<<<<<<< Updated upstream
    useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents(page, 10);
        setEvents(data.events);
        //setPage(data.page)
        setTotalPages(Math.round(data.totalCount / 10))
      } catch (e) {
        setError('Не удалось загрузить мероприятия');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page]);
=======
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
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    //const [typeRegistration, setTypeRegistration] = useState<string | null>(null);

    useEffect(() => setPage(1), [debouncedQuery]);
    useEffect(() => {
      
      abort.current?.abort();                          // отменяем предыдущий fetch
      const controller = new AbortController();
      abort.current = controller;

      const load = async () => {
        try {
          setLoading(true);
          const data = await fetchEvents(page, 10, debouncedQuery, startDate, endDate, sortOrder == 'asc' ? false : true, controller.signal);
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
  }, [page, debouncedQuery, startDate, endDate, sortOrder]);
>>>>>>> Stashed changes

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <>
      <header className="siteHeader">
        <a href="/"><img src="/logo.svg" className="logo" alt="Sport Competition" /></a>
      </header>

      <main className="content">
        <div className="eventLayout">
          <Filter />
          <div className="eventsArea">
            <div className="topBar">
              <input
                type="search"
                placeholder="Поиск..."
                className="searchInput"
              />
              <button className="sortBtn" aria-label="Сортировать A-Z" onClick={toggleSortOrder}>A↕Z</button>
            </div>

            <h1 className="pageTitle">Мероприятия</h1>

            <div className="eventsWrapper">
              {loading && <p>Загрузка...</p>}
              {error && <p className='error'>{error}</p>}
              {!loading && !error && <EventList 
                events={events}
                currentPage={page}
                totalPages={countPages}
                sortOrder={sortOrder}
                onPageChange={setPage}
                />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
