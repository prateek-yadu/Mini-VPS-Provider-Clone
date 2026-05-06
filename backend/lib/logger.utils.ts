import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

interface log {
    timestamp?: number;
    type: "success" | "error" | "info",
    message: string,
    vmId?: string,
    userId?: string;
    ip: string | undefined;
    route: string;
}

export const logger = {
    async log(filename: "auth" | "billing" | "instance" | "profile", log: log) {

        try {
            const __filename = fileURLToPath(import.meta.url)
            const __dirname = dirname(__filename)

            const outDir = path.join(__dirname, "..", "logs")
            
            log.timestamp = Date.now();
    
            // creates logs folder if dir does not exists
            if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir);
            }
    
            fs.appendFile(`${outDir}/${filename}.log`, JSON.stringify(log) + "\n", err => { });
        } catch (error) {
            console.log(error)
        }


    }
};