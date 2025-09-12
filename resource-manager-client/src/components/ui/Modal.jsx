import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // This effect handles closing the modal when the user presses the 'Escape' key.
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    // Cleanup the event listener when the modal is closed
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    // The semi-transparent backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity"
// Clicking the backdrop will close the modal
    >
      {/* The Modal's content panel */}
      <div
        className="relative w-full max-w-lg mx-auto bg-black border border-[#1a1b26] rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()} // This prevents clicks inside the modal from closing it
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-[#edeef4] hover:text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Modal Body: This is where the form will go */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
