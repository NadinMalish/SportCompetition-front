import axios from "axios";

export interface PagedResult {
    events: EventInfo[],
    totalCount: number,
    page: number,
    pageSize: number
} 

export interface Potent {
    id: number;
    lastname: string;
    firstname: string;
    surname: string;
    date_birth: Date;
    gender: string;
    email: string,
    login: string
}

export interface Competition {
    id: number;
    name: string;
    description: string;
    beginDate: Date;
    endDate: Date;
    RegistyDate: Date;
}

export interface EventInfo {
    id: number;
    name: string;
    description: string;
    beginDate: Date;
    endDate: Date;
    registrationDate: Date;
    registryDate: Date;
    isCompleted: boolean;
    organizer: Potent
    competitions: Competition[]
}

export type DocItem = {
  id: number;          
  fileName?: string;
  commentDoc?: string;
  idDocType?: number | null;
  idEvent?: number | null;
  idCompetition?: number | null;
};

export const fetchEvents = async (page: number = 1, pageSize: number = 10, search: string = "", startDate: string | null, endDate: string | null | null, 
    orderByDesc: boolean, signal?: AbortSignal): Promise<PagedResult> => {
    const { data } = await axios.get<PagedResult>("http://localhost:5226/api/v1/EventInfo",
        { 
            params: 
            { 
                page, 
                pageSize, 
                search,
                startDate,
                endDate,
                orderByDesc
            }, signal 
        }
    );
    return data;
};

export const fetchEventById = async (id: number, signal?: AbortSignal): Promise<EventInfo> => {
    const { data } = await axios.get<EventInfo>("http://localhost:5226/api/v1/EventInfo/" + id,
        {
            signal 
        }
    );
    return data;
};

export const listEventDocs = async (eventId: number, signal?: AbortSignal): Promise<DocItem[]> => {
  const { data } = await axios.get<DocItem[]>(`http://localhost:5226/Doc/by-event`, { params: { eventId }, signal });
  return data;
};

export const listCompetitionDocs = async (competitionId: number, signal?: AbortSignal): Promise<DocItem[]> => {
  const { data } = await axios.get<DocItem[]>(
    `http://localhost:5226/Doc/by-competition`, { params: { competitionId }, signal }
  );
  return data;
};

export const downloadUrl = (docId: number) => `http://localhost:5226/Doc/${docId}/download`;