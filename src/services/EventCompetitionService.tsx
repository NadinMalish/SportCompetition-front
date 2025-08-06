import axios from "axios";

export interface PagedResult {
    events: EventInfo[],
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

export const fetchEvents = async (page: number = 1, pageSize: number = 10, search: string = "", startDate: string | null, endDate: string | null, typeRegistration: boolean | null, signal?: AbortSignal): Promise<PagedResult> => {
    const { data } = await axios.get<PagedResult>("http://localhost:5226/api/v1/EventInfo",
        { 
            params: 
            { 
                page, 
                pageSize, 
                search,
                startDate,
                endDate,
                typeRegistration
            }, signal 
        }
    );
    console.log(startDate)
    console.log(endDate)
    return data;
};