import { BookmarkModel } from "../models/BookMarkModel";

export const BookmarkRepository = {
    createBookmarks : async (userId:string,itemId: string, type: string) => {
        let bookmark = await BookmarkModel.findOne({ userId});
        if (!bookmark) {
        bookmark = new BookmarkModel({ userId, items: [{ itemId, type }] });
        } else if (!bookmark.items.some((item) => item.itemId.toString() === itemId && item.type === type)) {
        bookmark.items.push({ itemId, type });
        }
        await bookmark.save()
    },

    getBookmarks: async (userId: string) => {
        const bookmark = await BookmarkModel.findOne({ userId});   
        return bookmark
    },
    
}