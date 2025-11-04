
import React, { useState, useCallback } from 'react';
import { generateItinerary } from '../services/geminiService';
import { SparklesIcon } from './icons';

interface ItineraryPlannerProps {
  destination: string;
  durationInDays: number;
  budget: number;
}

const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({ destination, durationInDays, budget }) => {
  const [itinerary, setItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateItinerary = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setItinerary('');
    try {
      const result = await generateItinerary(destination, durationInDays, budget);
      setItinerary(result);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [destination, durationInDays, budget]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">AI Trip Planner</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Let our AI assistant create a personalized itinerary for your trip to {destination}.
      </p>
      <button
        onClick={handleGenerateItinerary}
        disabled={isLoading}
        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        <SparklesIcon className="h-5 w-5 mr-2" />
        {isLoading ? 'Generating...' : 'Generate AI Itinerary'}
      </button>

      {isLoading && (
         <div className="mt-4 flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="text-gray-600 dark:text-gray-300">Our AI is planning your adventure...</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
      
      {itinerary && (
        <div className="mt-6 prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {itinerary}
        </div>
      )}
    </div>
  );
};

export default ItineraryPlanner;
