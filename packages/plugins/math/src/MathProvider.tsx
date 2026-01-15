import React, { ReactNode, useState, useCallback } from 'react';
import { usePluginContext } from '../../../react/src/components/PluginManager';
import { insertMathCommand, updateMathCommand, MathData } from './MathPlugin';
import { MathDialog } from './MathDialog';
import './MathDialog.css';

interface MathProviderProps {
  children: ReactNode;
}

export const MathProvider: React.FC<MathProviderProps> = ({ children }) => {
  const { registerCommand } = usePluginContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMath, setEditingMath] = useState<MathData | null>(null);

  React.useEffect(() => {
    registerCommand('insertMath', handleInsertMath);
    registerCommand('updateMath', handleUpdateMath);
  }, [registerCommand]);

  const handleInsertMath = useCallback(() => {
    // Store current selection before dialog opens
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      // Update the stored selection in the plugin
      // We need to call the insertMathCommand to store selection
      insertMathCommand();
    }
    setEditingMath(null);
    setDialogOpen(true);
  }, []);

  const handleUpdateMath = useCallback((mathData: MathData) => {
    console.log('MathProvider: handleUpdateMath called - EDITING EXISTING MATH:', mathData);
    setEditingMath(mathData);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingMath(null);
  }, []);

  const handleInsert = useCallback((mathData: MathData) => {
    console.log('MathProvider: handleInsert called with data:', mathData);
    updateMathCommand(mathData);
    setDialogOpen(false);
    setEditingMath(null);
  }, []);

  return (
    <>
      {children}
      {dialogOpen && (
        <MathDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          onInsert={handleInsert}
          initialData={editingMath}
        />
      )}
    </>
  );
};
