import axios from "axios";

export const fetchEvents = async () => {
    try
    {
        const response = await axios.get("http://localhost:5226/EventInfo")
        console.log(response);
    }
    catch(e)
    {
        console.error(e)
    }
};