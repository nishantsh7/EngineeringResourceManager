const ConfirmDelete = ({ resourceName, onConfirm, onCancel, isDeleting }) => {
  return (
    <div>
      <p className="text-sm text-[#A9A9A9] mb-6">
        Are you sure you want to delete the project "{resourceName}"? This will also remove all of its assignments. This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="py-2 px-4 bg-[#2D2D2D] hover:bg-[#3f3f3f] text-[#EAEAEA] font-semibold rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 cursor-pointer"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
