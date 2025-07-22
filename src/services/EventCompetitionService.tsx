import axios from "axios";

export interface PagedResult {
    items: EventInfo[],
    totalCount: number,
    page: number,
    pageSize: number
} 

export interface EventInfo {
    id: number;
    name: string;
    beginDate: string;
    endDate: string;
    registrationDate: string;
    registryDate: string;
    isCompleted: boolean;
}

export const fetchEvents = async (page = 1, pageSize = 20): Promise<PagedResult> => {
    const { data } = await axios.get<PagedResult>("http://localhost:5226/api/v1/EventInfo",
        { params: { page, pageSize }}
    );
    return data;
};