import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyChatState = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-8 m-4 mb-4 text-center">
      <div className="mb-6 bg-blue-50 p-6 rounded-full">
        <MessageSquare className="h-16 w-16 text-blue-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">No messages yet</h2>
      <p className="text-gray-500 max-w-md">
        Your conversations will appear here. Start a new chat.
      </p>
    </div>
  );
};

export default EmptyChatState;