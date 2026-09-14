export interface User {
    id?: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt?: string;
}

export interface DataEntry {
    id: number;
    title: string;
    content: string | null;
    filePath: string | null;
    fileName: string | null;
    fileType: string | null;
    category: Category | null;
    uploadedBy: User;
    createdAt?: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}