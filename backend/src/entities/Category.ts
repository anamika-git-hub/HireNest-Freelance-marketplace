export interface Icategory {
    id?: string;
    name: string;
    image: string | null | undefined;
    description?: string;
    createdAt?: Date;
    state?: 'active' | 'inactive';
}