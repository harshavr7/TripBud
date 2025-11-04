
import React, { useState } from 'react';
import { Trip } from '../types';
import AddTripModal from './AddTripModal';
import { PlusIcon, CalendarIcon, MapPinIcon, UsersIcon } from './icons';

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onAddTrip: (tripData: Omit<Trip, 'id' | 'members' | 'expenses'> & { firstMemberName: string }) => void;
}

const TripCard: React.FC<{ trip: Trip; onSelect: () => void }> = ({ trip, onSelect }) => (
  <div onClick={onSelect} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 space-y-4">
    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{trip.name}</h3>
    <div className="text-gray-600 dark:text-gray-300 space-y-2">
      <div className="flex items-center space-x-2">
        <MapPinIcon className="h-5 w-5 text-gray-400" />
        <span>{trip.destination}</span>
      </div>
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-gray-400" />
        <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center space-x-2">
        <UsersIcon className="h-5 w-5 text-gray-400" />
        <span>{trip.members.length} member{trip.members.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  </div>
);

const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip, onAddTrip }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstMemberName, setFirstMemberName] = useState('Me');

  const handleAddTrip = (tripData: Omit<Trip, 'id' | 'members' | 'expenses'>) => {
    onAddTrip({ ...tripData, firstMemberName });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Trips</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No trips</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new trip.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onSelect={() => onSelectTrip(trip)} />
          ))}
        </div>
      )}
      <AddTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddTrip={handleAddTrip} 
      />
    </div>
  );
};

export default TripList;
