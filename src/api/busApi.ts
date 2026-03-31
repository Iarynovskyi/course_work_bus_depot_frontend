import { BUS } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/buses';

export const fetchBuses = async (): Promise<BUS[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch buses');
    return response.json();
};

export const createBus = async (bus: Partial<BUS>): Promise<string> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bus),
    });
    const message = await response.text();
    if (!response.ok) throw new Error(message);
    return message;
};

export const createBusesBulk = async (buses: Partial<BUS>[]): Promise<string> => {
    const response = await fetch(`${API_URL}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buses),
    });
    return response.text();
};

