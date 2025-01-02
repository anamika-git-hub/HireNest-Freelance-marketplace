export interface Icategory {
    id?: string;
    name: string;
    image: string;
    description?: string;
    createdAt?: Date;
    state?: 'active' | 'inactive';
}