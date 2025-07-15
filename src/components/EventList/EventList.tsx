import Event from '../Event/Event'
import './EventList.css';

const days = [
  { date: '27.04', weekday: 'СБ', events: [1, 2] },
  { date: '28.04', weekday: 'ВС', events: [1, 2, 3] },
  { date: '29.04', weekday: 'ПН', events: [1] },
];

function EventList(){
    return (
        <>
            {days.map(d => (
                <section key={d.date} className="day-group">
                {/* левая плашка с датой */}
                <div className="day-group__date">
                    <span className="day-group__day">{d.date}</span>
                    <span className="day-group__weekday">{d.weekday}</span>
                </div>

                {/* список мероприятий сегодняшнего дня */}
                <ul className="day-group__events">
                    {d.events.map((_, i) => (
                    <Event key={i} />
                    ))}
                </ul>
                </section>
            ))}
        </>
    )
}

export default EventList;