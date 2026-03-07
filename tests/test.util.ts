import { createToken } from "../src/lib/jwt.js";
import { ADMIN_ID } from "./test.config.js";

export const getAdminToken = () => {
    return createToken(ADMIN_ID, 'ADMIN');
}
