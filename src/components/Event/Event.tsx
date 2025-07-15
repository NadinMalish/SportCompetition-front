import './Event.css';

function Event(){
    return(
        <>
            <li className="event-item">
                <div className="event-item__left">
                    <div className="event-item__title-wrap">
                        <h3 className="event-item__title">Название мероприятия</h3>

                        <span className="event-item__badge event-item__badge--closed">
                            Регистрация закрыта
                        </span>
                    </div>

                    <span className="event-item__date">12.12.2024 – 13.12.2024</span>
                </div>

                <button className="event-item__arrow" aria-label="Подробнее">›</button>
            </li>
        </>
    )
}

export default Event;