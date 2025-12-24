import { useQuery } from '@tanstack/react-query';
import { attendanceService, employeeService } from '../services/api';

export const useActiveEmployees = () => {
    return useQuery({
        queryKey: ['active-employees'],
        queryFn: async () => {
            const { data } = await attendanceService.getActive();
            return data;
        },
        refetchInterval: 60000, // Refresh every minute
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
