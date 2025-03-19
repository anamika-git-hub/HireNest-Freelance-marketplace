import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { BookMarkUseCase } from "../../application/bookmarkUseCase";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import { sendResponse } from "../../utils/responseHandler";
import { BookmarkMessages } from "../constants/responseMessages";

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }

  export const BookMarkController = {
    createBookmarks: async (req: Req, res: Res, next: Next) => {
      try {
        const { itemId, type, userId } = req.body;
        const bookmark = await BookMarkUseCase.createBookmarks(userId, itemId, type);
        
        sendResponse(res, HttpStatusCode.CREATED, {
          message: BookmarkMessages.CREATE_SUCCESS,
          bookmark
        });
      } catch (error) {
        next(error);
      }
    },
    
    getBookmarks: async(req: CustomRequest, res: Res, next: Next) => {
      try {
        const userId = req.user?.userId || '';
        const bookmark = await BookMarkUseCase.getBookmarks(userId);
        
        sendResponse(res, HttpStatusCode.OK, {
          message: BookmarkMessages.FETCH_SUCCESS,
          bookmark
        });
      } catch (error) {
        next(error);
      }
    },
    
    deleteBookmarks: async (req: Req, res: Res, next: Next) => {
      try {
        const { id } = req.params;
        const { type, userId } = req.body;
        
        const result = await BookMarkUseCase.deleteBookmark(userId, id, type);
    
        if (result) {
          sendResponse(res, HttpStatusCode.OK, {
            message: BookmarkMessages.DELETE_SUCCESS
          });
        } else {
          sendResponse(res, HttpStatusCode.NOT_FOUND, {
            message: BookmarkMessages.NOT_FOUND
          });
        }
      } catch (error) {
        next(error);
      }
    }
  };