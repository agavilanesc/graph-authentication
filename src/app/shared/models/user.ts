export interface User {
    created_at: string;
    email: string;
    email_verified_at?: string;
    id?: number;
    last_name: string;
    name: string;
    updated_at?: string;
    avatar?: string;
    azure_id?: string;
    azure_token?: string;
    azure_time_zone?: string;
    team_id: number;
    roles?: Role[];
}

export interface Role {
    id      : number;
    name    : string;
    checked : boolean;
}