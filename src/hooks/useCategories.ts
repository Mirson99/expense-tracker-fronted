import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategoriesList } from "../api/categories";

export const useCategories = () => {
    return useQuery({  
        queryKey: ['categories'],        
        queryFn: () => getCategoriesList(),              
        placeholderData: keepPreviousData,
        staleTime: Infinity,
    });
}