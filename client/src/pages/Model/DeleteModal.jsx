export default function DeleteModal({ onClose, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] transition-opacity duration-300">
      {/* Modal Card */}
      <div className=" bg-gray-100 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-scaleIn border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <h2 className="text-xl font-semibold text-black mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-700 mb-6 text-sm">
          Are you sure you want to delete this? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700  hover:bg-gray-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
