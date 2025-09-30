import React from "react";
import "./Competition.css";

export type CompetitionProps = {
  date: string;
  title: string;
  description?: string;
  docs?: { id: number; fileName?: string }[];
  makeDownloadLink?: (id: number) => string; 
};

const Competition: React.FC<CompetitionProps> = ({ date, title, description, docs, makeDownloadLink }) => {
  return (
    <li className="competition card">
      <div className="competition__grid">
        <div className="competition__date">{date}</div>

        <div className="competition__main">
          <h3 className="competition__title">{title}</h3>
          {description && <p className="competition__desc">{description}</p>}

          {docs && docs.length > 0 && (
            <ul className="competition__docs">
              {docs.map(d => (
                <li key={d.id}>
                  <a
                    className="competition__docLink"
                    href={makeDownloadLink ? makeDownloadLink(d.id) : `#doc-${d.id}`}
                  >
                    {d.fileName ?? `Документ #${d.id}`}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="competition__btn" aria-label="Записаться">
          Записаться
        </button>
      </div>
    </li>
  );
};

export default Competition;
