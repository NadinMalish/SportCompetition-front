import React from "react";
import "./Competition.css";

export type CompetitionProps = {
  date: string;
  title: string;
  description?: string;
};

const Competition: React.FC<CompetitionProps> = ({ date, title, description }) => {
  return (
    <li className="competition card">
      <div className="competition__grid">
        <div className="competition__date">{date}</div>

        <div className="competition__main">
          <h3 className="competition__title">{title}</h3>
          {description && <p className="competition__desc">{description}</p>}
        </div>

        <button className="competition__btn" aria-label="Записаться">
          Записаться
        </button>
      </div>
    </li>
  );
};

export default Competition;
