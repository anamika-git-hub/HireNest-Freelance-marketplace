import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { BookMarkUseCase } from "../../application/bookmarkUseCase";

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
export const BookMarkController = {
    createBookmarks: async (req: Req, res: Res, next: Next) => {
            try {
                
                const {itemId, type, userId} = req.body;
                let bookmark = BookMarkUseCase.createBookmarks(userId,itemId,type);

                res.status(201).json({ message: "Bookmark created successfully",bookmark });
            } catch (error) {
                next(error);
            }
        },
    getBookmarks: async(req:CustomRequest, res: Res, next: Next) => {
        try {
                
            const userId = req.user?.userId || '';
            let bookmark = BookMarkUseCase.getBookmarks(userId);

            res.status(201).json({bookmark });
        } catch (error) {
            next(error);
        }
    }
}