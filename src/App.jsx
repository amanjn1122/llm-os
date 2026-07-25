import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, PaperAirplaneIcon, ClockIcon } from './components/Icons';
import ResponseDisplay from './components/ResponseDisplay';
import HistorySidebar from './components/HistorySidebar';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [autoAccept, setAutoAccept] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        
        // If auto-accept is enabled, send request immediately
        if (autoAccept) {
          await sendRequest(transcript);
        } else {
          // Populate text field when auto-accept is disabled
          setInputText(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [autoAccept]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setError(null);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const sendRequest = async (text) => {
    if (!text.trim()) {
      setError('Please enter some text or use voice input.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Replace with your actual API endpoint
      const apiEndpoint = 'http://127.0.0.1:8000/run';
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          // timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
      
      // Add to history with timestamp
      setHistory(prev => [{
        ...data,
        timestamp: new Date().toISOString()
      }, ...prev]);
      
      setInputText('');
    } catch (err) {
      console.error('API call error:', err);
      setError(err.message || 'Failed to send request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest(inputText);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* History Button - Fixed to top right of page */}
      <button
        onClick={() => setIsHistoryOpen(true)}
        className="fixed top-4 right-4 p-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white transition-all duration-200 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 flex items-center gap-2 z-50"
        aria-label="Open execution history"
      >
        <ClockIcon className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">History</span>
        {history.length > 0 && (
          <span className="bg-white text-pink-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {history.length}
          </span>
        )}
      </button>
      
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent mb-3 drop-shadow-lg tracking-tight break-words">
            llm-OS
          </h1>
          <p className="text-gray-300 text-lg tracking-normal break-words">
            Type or speak to send your message
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-effect rounded-3xl p-8 md:p-10">
          {/* Auto-Accept Checkbox */}
          <div className="mb-6 flex items-center justify-center">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={autoAccept}
                onChange={(e) => setAutoAccept(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-pink-500 text-pink-500 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer transition-all"
              />
              <span className="text-gray-200 font-medium group-hover:text-pink-400 transition-colors">
                Auto-accept voice input
              </span>
            </label>
            <div className="ml-2 group relative">
              <svg className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-gray-800 border border-pink-500/30 text-white text-sm rounded-lg shadow-lg shadow-pink-500/20 z-10">
                When enabled, voice input will be sent to the backend immediately without populating the text field.
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Container */}
            <div className="relative">
              <label htmlFor="textInput" className="sr-only">
                Enter your message
              </label>
              <input
                id="textInput"
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="w-full px-6 py-4 pr-32 text-lg rounded-2xl border-2 border-pink-500/30 input-focus transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                disabled={isLoading}
                aria-label="Text input field"
              />
              
              {/* Mic Button */}
              <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className={`absolute right-20 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-200 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg shadow-pink-500/50'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 flex items-center justify-center"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Status Messages */}
            {isRecording && (
              <div className="flex items-center justify-center gap-2 text-red-400 animate-pulse">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-slow shadow-lg shadow-red-500/50"></div>
                <span className="font-medium">Listening...</span>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-pink-400">
                <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Sending...</span>
              </div>
            )}
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-lg backdrop-blur-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-200 font-medium break-words">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Response Display */}
          <ResponseDisplay response={response} />
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Click the microphone to use voice input or type directly.
            {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
              <span className="block mt-1 text-amber-400">
                ⚠️ Voice input is not supported in your browser.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
      />
    </div>
  );
};

export default App;
