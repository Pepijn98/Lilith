export interface AuthResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
}

export interface Auth extends AuthResponse {
    expires_at: Date;
}
