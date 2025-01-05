

import React from "react";
import { PuffLoader } from "react-spinners";

interface LoaderProps {
  visible: boolean;
}

const Loader: React.FC<LoaderProps> = ({ visible }) => {
    if (!visible) return null;
  return (
    <div className="flex justify-center  items-center h-screen bg-custom-blue">
      <PuffLoader size={60} color={"#123abc"} loading={true} />
    </div>
  );
};

export default Loader;

// const Loader: React.FC<LoaderProps> = ({ visible }) => {
//   if (!visible) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
//     </div>
//   );
// };

// export default Loader;
