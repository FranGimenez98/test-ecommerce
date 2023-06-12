import { useState } from "react";

interface ErrorState {
  error: boolean;
  errorMessage: string;
}

interface ErrorActions {
  showError: (message: string) => void;
  hideError: () => void;
}

type UseError = ErrorState & ErrorActions;

function useError(): UseError {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (message: string) => {
    setError(true);
    setErrorMessage(message);
  };

  const hideError = () => {
    setError(false);
    setErrorMessage("");
  };

  return {
    error,
    errorMessage,
    showError,
    hideError,
  };
}

export default useError;
