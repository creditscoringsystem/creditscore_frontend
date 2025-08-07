// pages/alert-management-dashboard/components/BulkActions.tsx
// Next.js + TypeScript – UI/logic kept identical
'use client';
import React, { useState, ChangeEvent } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

type BulkAction =
  | ''
  | 'acknowledge'
  | 'investigate'
  | 'resolve'
  | 'delete'
  | 'export';

interface BulkActionsProps {
  /** array of selected alert IDs */
  selectedAlerts: (string | number)[];
  onBulkAction: (action: BulkAction, ids: (string | number)[]) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  totalAlerts: number;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedAlerts,
  onBulkAction,
  onSelectAll,
  onClearSelection,
  totalAlerts,
}) => {
  const [selectedAction, setSelectedAction] = useState<BulkAction>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  /* options */
  const bulkActionOptions = [
    { value: '', label: 'Select Action...' },
    { value: 'acknowledge', label: 'Acknowledge Selected' },
    { value: 'investigate', label: 'Mark as Investigating' },
    { value: 'resolve', label: 'Mark as Resolved' },
    { value: 'delete', label: 'Delete Selected' },
    { value: 'export', label: 'Export to CSV' },
  ];

  /* helpers */
  const getActionIcon = (a: BulkAction) =>
    (
      {
        acknowledge: 'Check',
        investigate: 'Search',
        resolve: 'CheckCircle',
        delete: 'Trash2',
        export: 'Download',
      } as Record<BulkAction, string>
    )[a] ?? 'Settings';

  const getActionColor = (a: BulkAction) =>
    (
      {
        acknowledge: 'secondary',
        investigate: 'outline',
        resolve: 'success',
        delete: 'destructive',
        export: 'outline',
      } as Record<BulkAction, Parameters<typeof Button>[0]['variant']>
    )[a] ?? 'outline';

  /* action workflow */
  const executeAction = (action: BulkAction) => {
    onBulkAction(action, selectedAlerts);
    setSelectedAction('');
    setIsConfirmOpen(false);
  };

  const handleActionSelect = (action: BulkAction) => {
    setSelectedAction(action);
    if (action && selectedAlerts.length) {
      action === 'delete' ? setIsConfirmOpen(true) : executeAction(action);
    }
  };

  /* UI guards */
  if (selectedAlerts.length === 0) return null;

  return (
    <>
      {/* bulk bar */}
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-4">
        <div className="flex items-center justify-between">
          {/* left */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedAlerts.length === totalAlerts}
                indeterminate={
                  selectedAlerts.length > 0 && selectedAlerts.length < totalAlerts
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  e.target.checked ? onSelectAll() : onClearSelection()
                }
              />
              <span className="text-sm font-medium text-foreground">
                {selectedAlerts.length} of {totalAlerts} selected
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                options={bulkActionOptions}
                value={selectedAction}
                onChange={v => handleActionSelect(v as BulkAction)}
                placeholder="Select action..."
                className="min-w-48"
              />

              {selectedAction && (
                <Button
                  variant={getActionColor(selectedAction)}
                  size="sm"
                  iconName={getActionIcon(selectedAction)}
                  onClick={() =>
                    selectedAction === 'delete'
                      ? setIsConfirmOpen(true)
                      : executeAction(selectedAction)
                  }
                >
                  Apply
                </Button>
              )}
            </div>
          </div>

          {/* right */}
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>

        {/* quick actions */}
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground mr-2">Quick Actions:</span>

          <Button
            variant="outline"
            size="sm"
            iconName="Check"
            onClick={() => executeAction('acknowledge')}
          >
            Acknowledge All
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="CheckCircle"
            onClick={() => executeAction('resolve')}
          >
            Resolve All
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => executeAction('export')}
          >
            Export
          </Button>
        </div>
      </div>

      {/* confirm delete modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-elevation-3 p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Icon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Deletion</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete {selectedAlerts.length} selected alerts?
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 mb-4">
              <p className="text-sm text-muted-foreground">
                <Icon name="Info" size={16} className="inline mr-1" />
                This action cannot be undone. Deleted alerts will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                iconName="Trash2"
                onClick={() => executeAction('delete')}
              >
                Delete {selectedAlerts.length} Alerts
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;
