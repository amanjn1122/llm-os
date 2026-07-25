import React from 'react';
import { XMarkIcon } from './Icons';

const HistorySidebar = ({ isOpen, onClose, history }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 border-l border-pink-500/30 shadow-2xl shadow-pink-500/20 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-sidebar-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-500/30 bg-gradient-to-r from-pink-900/40 to-pink-800/40">
          <h2 id="history-sidebar-title" className="text-xl font-bold text-pink-200">
            Execution History
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-pink-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Close history sidebar"
          >
            <XMarkIcon className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* History List */}
        <div className="overflow-y-auto h-[calc(100%-5rem)] p-6">
          {history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/50 border border-pink-500/20 rounded-xl p-4 hover:border-pink-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : `Entry ${index + 1}`}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.completed 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {item.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-gray-400">Goal:</span>
                      <p className="text-gray-200 mt-1 break-words">{item.goal}</p>
                    </div>
                    
                    {item.final_message && (
                      <div className="text-sm">
                        <span className="text-gray-400">Message:</span>
                        <p className="text-gray-200 mt-1 break-words">{item.final_message}</p>
                      </div>
                    )}

                    {item.steps && item.steps.length > 0 && (
                      <div className="text-xs text-gray-400 mt-2">
                        {item.steps.length} step{item.steps.length !== 1 ? 's' : ''} executed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-pink-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">No execution history yet</p>
              <p className="text-gray-500 text-xs mt-2">Your execution history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;