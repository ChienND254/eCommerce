interface AppConfig {
    port: number;
}

interface DbConfig {
    host: string;
    port: number;
    name: string;
}

interface Config {
    app: AppConfig;
    db: DbConfig;
}

interface EnvConfig {
    DEV: Config;
    PRO: Config;
}

const DEV: Config = {
    app: {
        port: Number(process.env.DEV_APP_PORT) || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: Number(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_NAME || 'dbDev'
    }
};

const PRO: Config = {
    app: {
        port: Number(process.env.PRO_APP_PORT) || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: Number(process.env.PRO_DB_PORT) || 27017,
        name: process.env.PRO_DB_NAME || 'dbPro'
    }
};

const config: EnvConfig = { DEV, PRO };

const env = (process.env.NODE_ENV || 'DEV') as keyof EnvConfig;
const selectedConfig: Config = config[env];

export default selectedConfig;