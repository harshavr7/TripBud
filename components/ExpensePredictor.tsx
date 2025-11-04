import React, { useState, useCallback } from 'react';
import { predictExpense, BudgetPrediction } from '../services/geminiService';
import { LightbulbIcon } from './icons';

interface ExpensePredictorProps {
  destination: string;
  durationInDays: number;
  numberOfMembers: number;
}

const ExpensePredictor: React.FC<ExpensePredictorProps> = ({ destination, durationInDays, numberOfMembers }) => {
  const [prediction, setPrediction] = useState<BudgetPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePrediction = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setPrediction(null);
    try {
      const result = await predictExpense(destination, durationInDays, numberOfMembers);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'Failed to predict budget. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [destination, durationInDays, numberOfMembers]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">AI Budget Predictor</h3>
      <button
        onClick={handleGeneratePrediction}
        disabled={isLoading}
        className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors disabled:bg-teal-400 disabled:cursor-not-allowed w-full"
      >
        <LightbulbIcon className="h-5 w-5 mr-2" />
        {isLoading ? 'Predicting...' : 'Get AI Budget Prediction'}
      </button>

      {isLoading && (
         <div className="mt-4 flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            <p className="text-gray-600 dark:text-gray-300">Analyzing budget data...</p>
        </div>
      )}

      {error && <p className="mt-4 text-center text-red-500 dark:text-red-400">{error}</p>}
      
      {prediction && (
        <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Budget Per Person</p>
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 my-2">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(prediction.predictedBudgetPerPerson)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">{prediction.breakdown}</p>
        </div>
      )}
    </div>
  );
};

export default ExpensePredictor;
