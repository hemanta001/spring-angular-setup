import {UserRole} from '@modules/auth/models/UserRole';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: UserRole[];
    username: string;
}
