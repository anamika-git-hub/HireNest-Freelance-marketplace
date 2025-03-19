import { Res } from "../infrastructure/types/serverPackageTypes";
import { HttpStatusCode } from "../interfaces/constants/httpStatusCodes";

interface ResponseData {
    message: string;
    [key: string]: any;
}

export const sendResponse = (
    res: Res,
    statusCode: HttpStatusCode,
    data:ResponseData
) => {
    return res.status(statusCode).json(data);
}