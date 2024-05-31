import React from 'react'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-red-600 text-white hover:bg-red-800 rounded-full w-8 h-8 flex items-center justify-center">
                        X
                    </button>

                </div>
                {children}
            </div>
        </div>
    );
};
export default Modal