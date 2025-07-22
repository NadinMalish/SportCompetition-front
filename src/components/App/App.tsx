import './App.css';
import Filter from '../Filter/Filter';
import EventList from '../EventList/EventList';
import { useEffect, useState } from 'react';
import { fetchEvents, type EventInfo } from '../../services/EventCompetitionService';



function App() {
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [countPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data.events);
        setPage(data.page)
        setTotalPages(data.totalCount / 10)
      } catch (e) {
        setError('Не удалось загрузить мероприятия');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


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
              <button className="sortBtn" aria-label="Сортировать A-Z">A↕Z</button>
            </div>

            <h1 className="pageTitle">Мероприятия</h1>

            <div className="eventsWrapper">
              {loading && <p>Загрузка...</p>}
              {error && <p className='error'>{error}</p>}
              {!loading && !error && <EventList 
                events={events}
                currentPage={page}
                totalPages={countPages}
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
