interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({ title, message, onConfirm, onCancel }: ConfirmationDialogProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-dark-900 bg-opacity-50">
      <div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-dark-900 mb-2">{title}</h2>
          <p className="text-dark-700 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 bg-light-100 hover:bg-light-200 text-dark-900 rounded font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-error hover:bg-error/90 text-white rounded font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
