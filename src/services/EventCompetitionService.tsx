import axios from "axios";

export interface EventInfo {
    id: number;
    name: string;
    beginDate: string;        // ← строки ISO
    endDate: string;
    registrationDate: string;
    registryDate: string;
    isCompleted: boolean;
}

export const fetchEvents = async (): Promise<EventInfo[]> => {
    const { data } = await axios.get<EventInfo[]>("http://localhost:5226/api/v1/EventInfo");
    return data;
};