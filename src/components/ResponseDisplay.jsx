import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

const ResponseDisplay = ({ response }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!response) return null;

  const { goal, completed, final_message, steps } = response;

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-pink-900/40 to-pink-800/40 border border-pink-500/30 rounded-2xl backdrop-blur-sm shadow-lg shadow-pink-500/10">
      {/* Essential Information */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-pink-200 mb-2">Execution Result</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-medium">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  completed 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {completed ? '✓ Completed' : '⋯ In Progress'}
                </span>
              </div>
              <div>
                <span className="text-gray-300 font-medium">Goal:</span>
                <span className="ml-2 text-gray-200 break-words">{goal}</span>
              </div>
              <div>
                <span className="text-gray-300 font-medium">Message:</span>
                <span className="ml-2 text-gray-200 break-words">{final_message}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Details Section */}
        <div className="mt-4 border-t border-pink-500/20 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-pink-300 hover:text-pink-200 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg p-2"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Hide detailed information' : 'Show detailed information'}
          >
            <span className="font-medium">Detailed Information</span>
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-4 bg-gray-800/70 p-4 rounded-xl border border-pink-500/20 animate-fadeIn">
              <h4 className="text-md font-semibold text-pink-200 mb-3">Execution Steps</h4>
              {steps && steps.length > 0 ? (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-sm font-semibold">
                          Step {step.step_number}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          step.status === 'success' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300 text-xs overflow-x-auto whitespace-pre-wrap break-words'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      
                      {step.action && (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Tool:</span>
                            <span className="ml-2 text-gray-200 font-mono">{step.action.tool}</span>
                          </div>
                          {step.action.command && (
                            <div>
                              <span className="text-gray-400">Command:</span>
                              <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-200 overflow-x-auto whitespace-pre-wrap break-words">
                                {step.action.command}
                              </pre>
                            </div>
                          )}
                          {step.action.shell && (
                            <div>
                              <span className="text-gray-400">Shell:</span>
                              <span className="ml-2 text-gray-200">{step.action.shell}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {step.execution && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="text-gray-400">Execution Status:</span>
                              <span className={`ml-2 font-semibold ${
                                step.execution.success ? 'text-green-300' : 'text-red-300 text-xs overflow-x-auto whitespace-pre-wrap break-words'
                              }`}>
                                {step.execution.message}
                              </span>
                            </div>
                            {step.execution.details && (
                              <>
                                {step.execution.details.stdout && (
                                  <div>
                                    <span className="text-gray-400">Output:</span>
                                    <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-200 text-xs overflow-x-auto whitespace-pre-wrap break-words">
                                      {step.execution.details.stdout}
                                    </pre>
                                  </div>
                                )}
                                {step.execution.details.stderr && (
                                  <div>
                                    <span className="text-gray-400">Error:</span>
                                    <pre className="mt-1 p-2 bg-red-900/30 rounded text-red-200 text-xs overflow-x-auto whitespace-pre-wrap break-words">
                                      {step.execution.details.stderr}
                                    </pre>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No execution steps available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay;