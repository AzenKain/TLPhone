export type UpdateUserDto = {
    userId: string; 
    isDisplay?: boolean; 
    email: string; 
    username: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    role?: string[]; 
    phoneNumber?: string; 
    birthday?: Date;
    address?: string; 
    gender?: string; 
};

export type UpdateProfileDto = {
    phoneNumber?: string | null;
    lastName?: string | null;
    gender?: string | null;
    firstName?: string | null;
    address?: string | null;
    imgDisplay?: string | null;
    birthday?: Date | null;
};