import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { FaUsers, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import ConfirmMessage from "../../components/shared/ConfirmMessage";

interface Freelancer {
    _id: string;
    profileImage: string;
    name: string;
    tagline: string;
}

interface ApiResponse {
    data: Freelancer[];
    totalPages: number;
    message: string;
}

const FreelancerBookmarks: React.FC = () => {
    const [bookmarks, setBookmarks] = useState<Freelancer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 4;
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 600);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const getBookmarksAndFreelancers = async () => {
            try {
                const bookmarkResponse = await axiosConfig.get("/users/bookmarks");
                const bookmarksData = bookmarkResponse.data.bookmark.items;
                const freelancerBookmarkIds = bookmarksData
                    .filter((bookmark: { type: string }) => bookmark.type === "freelancer")
                    .map((bookmark: { itemId: string }) => bookmark.itemId);

                const freelancerResponse = await axiosConfig.get<ApiResponse>(
                    "/client/freelancer-list",
                    {
                        params: {
                            page: currentPage,
                            limit: ITEMS_PER_PAGE,
                            searchTerm: debouncedSearchTerm,
                            bookmarkedFreelancerIds: freelancerBookmarkIds
                        },
                    }
                );
                setBookmarks(freelancerResponse.data.data);
                setTotalPages(freelancerResponse.data.totalPages);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookmarks or freelancers", err);
                setError("Failed to fetch bookmarks or freelancers");
                setLoading(false);
            }
        };

        getBookmarksAndFreelancers();
    }, [currentPage, debouncedSearchTerm]);

    const handleRemove = (id: string) => {
        setConfirmRemove(id);
    };

    const confirmRemoveBookmark = async () => {
        const userId = localStorage.getItem("userId");
        if (confirmRemove) {
            try {
                await axiosConfig.delete(`/users/bookmarks/${confirmRemove}`, {
                    data: { userId, type: "freelancer" },
                });

                setBookmarks((prevBookmarks) =>
                    prevBookmarks.filter((bookmark) => bookmark._id !== confirmRemove)
                );

                setConfirmRemove(null);
            } catch (err) {
                console.error("Error removing bookmark:", err);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (loading) return <Loader visible={loading} />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6 pt-24 bg-gray-100 min-h-screen">
            <div className="mb-6">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search bookmarked freelancers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 bg-white rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-blue-600 font-semibold mb-4">
                    <FaUsers className="mr-2" /> Bookmarked Freelancers
                </div>
                {bookmarks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {debouncedSearchTerm
                            ? "No freelancers match your search"
                            : "No bookmarked freelancers found"}
                    </div>
                ) : (
                    <ul>
                        {bookmarks.map((freelancer, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center border-b last:border-b-0 py-4"
                            >
                                <div className="w-3/4">
                                    <Link to={`/client/freelancer-detail/${freelancer._id}`}>
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={freelancer.profileImage || "/default-avatar.jpg"}
                                                alt={freelancer.name}
                                                className="w-12 h-12 rounded-full border-2 border-gray-300"
                                            />
                                            <div>
                                                <h2 className="text-lg font-medium">{freelancer.name}</h2>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    {freelancer.tagline}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleRemove(freelancer._id)}
                                        className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                                    >
                                        <FaTrash className="mr-1" /> Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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

            {confirmRemove && (
                <ConfirmMessage
                    message="Are you sure you want to remove this bookmark?"
                    onConfirm={confirmRemoveBookmark}
                    onCancel={() => setConfirmRemove(null)}
                />
            )}
        </div>
    );
};

export default FreelancerBookmarks;