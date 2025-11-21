export interface DBConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface SessionState {
    sourceConfig?: DBConfig;
    targetConfig?: DBConfig;
    sourceConnected: boolean;
    targetConnected: boolean;
}
