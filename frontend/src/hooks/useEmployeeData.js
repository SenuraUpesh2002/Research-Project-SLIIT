import { useQuery } from '@tanstack/react-query';
import { attendanceService, employeeService } from '../services/api';

export const useActiveEmployees = () => {
    return useQuery({
        queryKey: ['active-employees'],
        queryFn: async () => {
            const { data } = await attendanceService.getActive();
            return data;
        },
        // Refresh frequently so the dashboard sees a new check‑in almost instantly.
        // 5 seconds is a good balance between responsiveness and network load.
        refetchInterval: 5000, // Refresh every 5 seconds
    });
};

export const useMyAttendance = () => {
    return useQuery({
        queryKey: ['my-attendance'],
        queryFn: async () => {
            const { data } = await attendanceService.getMyAttendance();
            return data;
        },
    });
};

export const useAllEmployees = () => {
    return useQuery({
        queryKey: ['all-employees'],
        queryFn: async () => {
            const { data } = await employeeService.getAll();
            return data;
        },
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
};
