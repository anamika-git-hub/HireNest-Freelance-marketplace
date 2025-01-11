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
            let bookmark = await BookMarkUseCase.getBookmarks(userId);
            res.status(201).json({bookmark });
        } catch (error) {
            next(error);
        }
    },
    deleteBookmarks: async (req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params
            const { type, userId } = req.body;
            
            const result = await BookMarkUseCase.deleteBookmark(userId,id, type);
    
            if (result) {
                res.status(200).json({ message: "Bookmark removed successfully" });
            } else {
                res.status(404).json({ message: "Bookmark not found" });
            }
        } catch (error) {
            next(error);
        }
    },
    
}