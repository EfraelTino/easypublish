export interface Users{
    id: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    full_name: string;
    status: 'active' | 'inactive';
}