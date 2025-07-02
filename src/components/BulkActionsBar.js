import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Eye, Download, Trash2, X 
} from 'lucide-react';
import { Button } from './ui/button';

export function BulkActionsBar({ 
  selectedCount, 
  onClearSelection, 
  onBulkStatusChange, 
  onBulkExport, 
  onBulkDelete 
}) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">{selectedCount}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {selectedCount} application{selectedCount > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Change Actions */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkStatusChange('reviewing')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Review
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkStatusChange('accepted')}
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkStatusChange('rejected')}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>

              {/* Other Actions */}
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              <Button
                size="sm"
                variant="outline"
                onClick={onBulkExport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onBulkDelete}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="p-1 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 