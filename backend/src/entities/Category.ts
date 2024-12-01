export interface Icategory {
    id?: string;
    name: string;
    description?: string;
    createdAt?: Date;
    state?: 'active' | 'inactive';
}