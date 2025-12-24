import { useQuery } from '@tanstack/react-query';
import { predictionService } from '../services/api';

export const useForecast = () => {
    return useQuery({
        queryKey: ['forecast'],
        queryFn: async () => {
            const { data } = await predictionService.getForecast();
            return data;
        },
        staleTime: 60 * 60 * 1000, // 1 hour freshness for forecasts
    });
};
