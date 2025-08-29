import { IUserDto } from "../api/types/data-contracts";

export interface AuthState {
    isAuthenticated: boolean;
    user: IUserDto | null;
    isInitialized: boolean;
    isLoading: boolean;
    isFirstEnter: boolean;
}