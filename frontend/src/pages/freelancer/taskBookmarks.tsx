import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import BookmarksList from "../../components/shared/bookmarkList";

interface Task {
    _id: string;
    projectName: string;
    category: string;
    timeline: string;
    timeLeft?: string;
}

const TaskBookmarks: React.FC = () => {
    const renderTask = (task: Task, handleRemove: (id: string) => void) => (
        <Link to={`/freelancer/task-detail/${task._id}`} key={task._id}>
            <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b last:border-b-0 py-4">
                <div className="sm:w-3/4 w-full">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium">{task.projectName}</h2>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                        <AiOutlineClockCircle className="mr-2" />
                        {task.timeLeft}
                    </div>
                </div>

                <div className="flex items-center mt-4 sm:mt-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleRemove(task._id);
                        }}
                        className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                    >
                        <FaTrash className="mr-1" /> Remove
                    </button>
                </div>
            </li>
        </Link>
    );

    return (
        <BookmarksList<Task>
            type="task"
            title="Bookmarked Tasks"
            fetchUrl="/freelancers/tasks-list"
            detailUrlPrefix="/freelancer/task-detail"
            renderItem={renderTask}
            emptyMessage="No bookmarked tasks found"
            searchPlaceholder="Search bookmarked tasks..."
        />
    );
};

export default TaskBookmarks;