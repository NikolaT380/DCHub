import axios from 'axios';
import type { User, Category, DataEntry, RegisterRequest, LoginRequest, LoginResponse } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    register: (data: RegisterRequest) =>
        api.post<User>('/user/register', data),

    login: (data: LoginRequest) =>
        api.post<LoginResponse>('/user/login', data),

    getMe: () =>
        api.get<User>('/user/me'),

    getByUsername: (username: string) =>
        api.get<User>(`/user/${username}`),
};

export const categoryApi = {
    getAll: () =>
        api.get<Category[]>('/categories'),

    getById: (id: number) =>
        api.get<Category>(`/categories/${id}`),

    create: (data: { name: string; description: string }) =>
        api.post<Category>('/categories/add', data),

    delete: (id: number) =>
        api.delete<void>(`/categories/${id}/delete`),
};

export const dataEntryApi = {
    getAll: () =>
        api.get<DataEntry[]>('/data_entries'),

    getMy: () =>
        api.get<DataEntry[]>('/data_entries/my'),

    getById: (id: number) =>
        api.get<DataEntry>(`/data_entries/${id}`),

    addText: (title: string, content: string, categoryId?: number) => {
        const params = new URLSearchParams({ title, content });
        if (categoryId) params.append('categoryId', categoryId.toString());
        return api.post<DataEntry>(`/data_entries/add-text?${params.toString()}`);
    },

    addFile: (title: string, file: File, categoryId?: number) => {
        const formData = new FormData();
        formData.append('file', file);

        const params = new URLSearchParams({ title });
        if (categoryId) params.append('categoryId', categoryId.toString());

        return api.post<DataEntry>(`/data_entries/add-file?${params.toString()}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    delete: (id: number) =>
        api.delete<DataEntry>(`/data_entries/${id}/delete`),
};