import './App.css';
import Filter from '../Filter/Filter';
import EventList from '../EventList/EventList';
import { useEffect } from 'react';
import { fetchEvents } from '../../services/EventCompetition';



function App() {

  useEffect(() => {
    const fetchData = async () => {
      await fetchEvents();
    }

    fetchData();
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
              <EventList />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
