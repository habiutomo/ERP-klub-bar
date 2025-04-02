import { useState, createContext, useContext } from "react";

interface ConfirmationState {
  show: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
}

interface ConfirmationContextType {
  confirmationState: ConfirmationState;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmation: () => void;
}

const initialState: ConfirmationState = {
  show: false,
  title: "",
  message: "",
  onConfirm: undefined,
};

export const ConfirmationContext = createContext<ConfirmationContextType>({
  confirmationState: initialState,
  showConfirmation: () => {},
  closeConfirmation: () => {},
});

export const useConfirmation = () => {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(initialState);

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationState({
      show: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeConfirmation = () => {
    setConfirmationState({ ...confirmationState, show: false });
  };

  return {
    confirmationState,
    showConfirmation,
    closeConfirmation,
  };
};
