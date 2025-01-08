import { BookmarkRepository } from "../infrastructure/repositories/bookMarkRepository";

export const BookMarkUseCase = {
    createBookmarks : async (id: string, itemId: string,type: string) => {
         try {
                    return await BookmarkRepository.createBookmarks(id, itemId,type);
                } catch (error: any) {
                    throw new Error(`Failed to create bid: ${error.message}`);
                }
    },
    getBookmarks : async(userId: string) => {
        try {
            const bookmark = await BookmarkRepository.getBookmarks(userId);
            return bookmark
        } catch (error: any) {
            throw new Error(`Failed to get bookmark: ${error.message}`);
        }
    },
    deleteBookmark: async (userId: string, itemId: string, type: string) => {
        try {
            const bookmark = await BookmarkRepository.getBookmarks(userId);
            if (!bookmark) {
                return false;
            }
            const itemIndex = bookmark.items.findIndex((item) => item.itemId.toString() === itemId && item.type === type);
            if (itemIndex > -1) {
                bookmark.items.splice(itemIndex, 1);
                await bookmark.save();
                return true;
            }
            return false;
        } catch (error: any) {
            throw new Error(`Failed to remove bookmark: ${error.message}`);
        }
    },
    
}