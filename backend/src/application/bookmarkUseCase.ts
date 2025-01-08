import { BookmarkRepository } from "../infrastructure/repositories/bookMarkRepository";

export const BookMarkUseCase = {
    createBookmarks : async (id: string, itemId: string,type: string) => {
         try {
                    return await BookmarkRepository.createBookmarks(id, itemId,type);
                } catch (error: any) {
                    throw new Error(`Failed to create bid: ${error.message}`);
                }
    },
    getBookmarks : async(id: string) => {
        try {
            return await BookmarkRepository.getBookmarks(id);
        } catch (error: any) {
            throw new Error(`Failed to create bid: ${error.message}`);
        }
    }
}