import { useQuery } from '@tanstack/react-query';
import { fuelService } from '../services/api';

export const useFuelStocks = () => {
    return useQuery({
        queryKey: ['fuel-stocks'],
        queryFn: async () => {
            const { data } = await fuelService.getStocks();
            return data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
        staleTime: 10000,
    });
};
