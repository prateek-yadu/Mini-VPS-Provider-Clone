import { pool } from "../db/config.js";
import send from "../utils/response/response.js";
import { Request, Response } from "express";
import { isExpired } from "../utils/validators/planValidators.js";

interface customRequest extends Request {
    id?: string;
}

export const me = async (req: customRequest, res: Response) => {

    try {
        const id = req.id; // gets user id 

        // fetches user data 
        const [user, fields]: any = await pool.query('SELECT name, email, phone, profile_image as profileImage FROM users WHERE id=?', [id]);

        if (user.length != 0) {
            // sends user data 
            send.ok(res, "User Found", user[0]);
        } else {
            send.notFound(res, "User Not Found");
        }
    } catch (error) {
        send.internalError(res);
    }
};

export const subscribedPlans = async (req: customRequest, res: Response) => {

    try {
        const id = req.id; // gets user id 
        const { is_expired, in_use } = req.query; // gets user query

        // fetches user subscribed plans 
        const [user_plan]: any = await pool.query('SELECT u.id, u.in_use, u.purchased_at, u.expires_at, p.name, p.vCPU, p.memory, p.storage, p.backups FROM user_plans u INNER JOIN plans p ON u.plan_id=p.id WHERE u.user_id=?', [id]);

        let filteredPlan = user_plan; // adds query filtering if required

        // handles is_expired query
        switch (is_expired) {
            case "true":
                filteredPlan = filteredPlan.filter((item: { expires_at: Date; }) => {
                    const isPlanExpired: boolean = isExpired(item.expires_at);
                    if (isPlanExpired) {
                        return item;
                    }
                });
                break;

            case "false":
                filteredPlan = filteredPlan.filter((item: { expires_at: Date; }) => {
                    const isPlanExpired: boolean = isExpired(item.expires_at);
                    if (!isPlanExpired) {
                        return item;
                    }
                });

            default:
                break;
        }

        // handles in_use query
        switch (in_use) {
            case "true":
                filteredPlan = filteredPlan.filter((item: { in_use: number; }) => item.in_use === 1);
                break;

            case "false":
                filteredPlan = filteredPlan.filter((item: { in_use: number; }) => item.in_use === 0);

            default:
                break;
        }

        if (filteredPlan.length != 0) {
            // sends subscribed plan data 
            send.ok(res, "Plan Found", filteredPlan);
        } else {
            send.notFound(res, "You are not subscribed to any plan.");
        }
    } catch (error) {
        send.internalError(res);
    }
};