import type { Category } from "../types/category";
import { axiosClient } from "./axiosClient";

export const getCategoriesList = async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>('/category');
    return response.data;
};