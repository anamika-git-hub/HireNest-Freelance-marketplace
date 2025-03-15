import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../../components/shared/Loader";
import ConfirmMessage from "../../components/shared/ConfirmMessage";

interface BaseItem {
    _id: string;
}

interface BookmarksListProps<T extends BaseItem> {
    type: "task" | "freelancer";
    title: string;
    fetchUrl: string;
    detailUrlPrefix: string;
    renderItem: (item: T, handleRemove: (id: string) => void) => React.ReactNode;
    emptyMessage?: string;
    searchPlaceholder?: string;
}

interface ApiResponse<T> {
    data: T[];
    totalPages: number;
    message: string;
}

function BookmarksList<T extends BaseItem>({
    type,
    title,
    fetchUrl,
    renderItem,
    emptyMessage = "No bookmarks found",
    searchPlaceholder = "Search bookmarks..."
}: BookmarksListProps<T>) {
    const [bookmarks, setBookmarks] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 4;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== debouncedSearchTerm) {
                setCurrentPage(1);
            }
            setDebouncedSearchTerm(searchTerm);
        }, 600);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, debouncedSearchTerm]);

    useEffect(() => {
        if (isFocused && inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
        }
    }, [loading, bookmarks, isFocused]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const getBookmarkedItems = async () => {
            setLoading(true);
            try {
                const bookmarkResponse = await axiosConfig.get("/users/bookmarks");
                const bookmarksData = bookmarkResponse.data.bookmark.items;
                
                const bookmarkedItemIds = bookmarksData
                    .filter((bookmark: { type: string }) => bookmark.type === type)
                    .map((bookmark: { itemId: string }) => bookmark.itemId);
                
                if (bookmarkedItemIds.length === 0) {
                    setBookmarks([]);
                    setTotalPages(1);
                    setLoading(false);
                    return;
                }

                const paramKey = type === "task" ? "bookmarkedTaskIds" : "bookmarkedFreelancerIds";
                const params = {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    searchTerm: debouncedSearchTerm,
                    [paramKey]: bookmarkedItemIds
                };

                const response = await axiosConfig.get<ApiResponse<T>>(fetchUrl, { params });
                
                let processedData = response.data.data;
                if (type === "task") {
                    processedData = processedData.map((item: any) => ({
                        ...item,
                        timeLeft: calculateTimeLeft(item.timeline),
                    }));
                }

                setBookmarks(processedData);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (err) {
                console.error(`Error fetching bookmarked ${type}s:`, err);
                setError(`Failed to fetch bookmarked ${type}s`);
                setLoading(false);
            }
        };

        getBookmarkedItems();
    }, [currentPage, debouncedSearchTerm, fetchUrl, type]);

    const calculateTimeLeft = (timeline: string): string => {
        const deadline = new Date(timeline);
        const now = new Date();
        const timeDiff = deadline.getTime() - now.getTime();

        if (timeDiff <= 0) {
            return "Task deadline reached";
        }
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        return `${days} days, ${hours} hours left`;
    };

    const handleRemove = (id: string) => {
        setConfirmRemove(id);
    };

    const confirmRemoveBookmark = async () => {
        const userId = localStorage.getItem("userId");
        if (confirmRemove) {
            try {
                await axiosConfig.delete(`/users/bookmarks/${confirmRemove}`, {
                    data: { userId, type },
                });

                setBookmarks((prevBookmarks) =>
                    prevBookmarks.filter((bookmark) => bookmark._id !== confirmRemove)
                );

                if (bookmarks.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }

                setConfirmRemove(null);
            } catch (err) {
                console.error(`Error removing ${type} bookmark:`, err);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (loading) return <Loader visible={loading} />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6 pt-24 bg-gray-100 min-h-screen select-none">
            <div className="mb-6">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="p-2 border border-gray-300 bg-white rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-blue-600 font-semibold mb-4">
                    <FaUsers className="mr-2" /> {title}
                </div>
                {bookmarks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {debouncedSearchTerm ? `No ${type}s match your search` : emptyMessage}
                    </div>
                ) : (
                    <ul>
                        {bookmarks.map((item, index) => renderItem(item, handleRemove))}
                    </ul>
                )}
            </div>

            {bookmarks.length > 0 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <FaChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages || 1 }, (_, i) => i + 1)
                        .filter(pageNumber => {
                            if (pageNumber === 1 || pageNumber === totalPages) return true;
                            if (Math.abs(pageNumber - currentPage) <= 2) return true;
                            return false;
                        })
                        .map((page, index, array) => {
                            if (index > 0 && array[index] - array[index - 1] > 1) {
                                return (
                                    <React.Fragment key={`ellipsis-${page}`}>
                                        <span className="w-8 h-8 flex items-center justify-center text-gray-700">
                                            ...
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(page)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                                page === currentPage
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                );
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                        page === currentPage
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <FaChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {confirmRemove && (
                <ConfirmMessage
                    message={`Are you sure you want to remove this ${type} bookmark?`}
                    onConfirm={confirmRemoveBookmark}
                    onCancel={() => setConfirmRemove(null)}
                />
            )}
        </div>
    );
}

export default BookmarksList;