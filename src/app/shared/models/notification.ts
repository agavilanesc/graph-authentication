export interface Notification {
    title        : string;
    message      : string;
    type         : string;
    created_at   : string;
    is_read?     : boolean;
    is_favorite? : boolean;
    to           : string[];
    me?          : boolean;
}
