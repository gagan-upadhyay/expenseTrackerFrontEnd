import { useState, useCallback } from 'react';

export function useFileUpload(onFileAccepted: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover") setIsDragging(true);
    else setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) onFileAccepted(file);
  }, [onFileAccepted]);

  return { isDragging, handleDrag, handleDrop };
}
