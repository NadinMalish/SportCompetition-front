import './Filter.css';

interface FilterProps {
  onStartDateChanged: (date: string | null) => void;
  onEndDateChanged: (date: string | null) => void;
  //onTypeRegistrationSet: (val: string | null) => void
}
                                                                         // onTypeRegistrationSet
const Filter: React.FC<FilterProps> = ({ onStartDateChanged, onEndDateChanged }) => {
    return (
    <aside className="filter">
        <h3 className="filter__title">Фильтр</h3>

        <fieldset className="filter__block">
            <legend className="filter__legend">Дата проведения</legend>

            <label className="filter__label">
                <span className="filter__label-text">Начало</span>
                <input className="filter__input" type="date" name="startDate" onChange={e => onStartDateChanged(e.target.value)}/>
            </label>

            <label className="filter__label">
                <span className="filter__label-text">Конец</span>
                <input className="filter__input" type="date" name="endDate" onChange={e => onEndDateChanged(e.target.value)}/>
            </label>
        </fieldset>

        
        <fieldset className="filter__block">
            <legend className="filter__legend">Регистрация</legend>

            <label className="filter__radio">
                <input type="radio" name="registration" value="open" />
                <span className="filter__radio-text">Открыта</span>
            </label>

            <label className="filter__radio">
                <input type="radio" name="registration" value="closed" />
                <span className="filter__radio-text">Закрыта</span>
            </label>

            <label className="filter__radio">
                <input type="radio" name="registration" />
                <span className="filter__radio-text">Все</span>
            </label>
        </fieldset>
    </aside>
    )
}

export default Filter;