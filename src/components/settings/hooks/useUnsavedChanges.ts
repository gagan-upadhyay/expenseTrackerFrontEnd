import { useEffect, useCallback } from 'react';

export function useUnsavedChanges(isDirty: boolean, isSuccess: boolean) {
  // 1. Browser-level guard (Refreshes, Tab closing)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSuccess) {
        e.preventDefault();
        e.returnValue = ''; 
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSuccess]);

  // 2. Manual guard for UI buttons (Back buttons, Cancel buttons)
  const proceedWithCheck = useCallback((onConfirm: () => void) => {
    if (isDirty && !isSuccess) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (confirmed) onConfirm();
    } else {
      onConfirm();
    }
  }, [isDirty, isSuccess]);

  return { proceedWithCheck };
}