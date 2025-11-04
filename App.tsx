import React, { useState, useEffect } from 'react';
import { Trip, Member } from './types';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';

const DEFAULT_TRIPS: Trip[] = [
  {
    id: 'default-trip-1',
    name: 'Kerala Backwaters Escape',
    destination: 'Alleppey, Kerala',
    startDate: '2024-09-10',
    endDate: '2024-09-15',
    budgetPerPerson: 20000,
    members: [
      { id: 'member-1', name: 'Rohan' },
      { id: 'member-2', name: 'Priya' },
      { id: 'member-3', name: 'Amit' },
    ],
    expenses: [
      {
        id: 'expense-1',
        description: 'Flights to Kochi',
        amount: 18000,
        category: 'Transport',
        paidById: 'member-1',
        date: '2024-08-01T12:00:00.000Z',
      },
      {
        id: 'expense-2',
        description: 'Houseboat rental (2 nights)',
        amount: 15000,
        category: 'Accommodation',
        paidById: 'member-2',
        date: '2024-08-05T12:00:00.000Z',
      },
      {
        id: 'expense-3',
        description: 'Kathakali show tickets',
        amount: 1500,
        category: 'Activities',
        paidById: 'member-3',
        date: '2024-09-11T12:00:00.000Z',
      },
      {
        id: 'expense-4',
        description: 'Local food and groceries',
        amount: 8000,
        category: 'Food',
        paidById: 'member-1',
        date: '2024-09-12T12:00:00.000Z',
      },
       {
        id: 'expense-5',
        description: 'Seafood dinner at a toddy shop',
        amount: 2500,
        category: 'Food',
        paidById: 'member-2',
        date: '2024-09-13T12:00:00.000Z',
      },
    ],
  }
];

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
        const savedTrips = localStorage.getItem('trips');
        const parsedTrips = savedTrips ? JSON.parse(savedTrips) : null;
        // Basic validation to ensure we have an array
        return Array.isArray(parsedTrips) && parsedTrips.length > 0 ? parsedTrips : DEFAULT_TRIPS;
    } catch (error) {
        console.error("Failed to parse trips from localStorage", error);
        return DEFAULT_TRIPS;
    }
  });

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    try {
        localStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
        console.error("Failed to save trips to localStorage", error);
    }
  }, [trips]);

  const handleAddTrip = (tripData: Omit<Trip, 'id' | 'members' | 'expenses'> & { firstMemberName: string }) => {
    const firstMember: Member = { id: Date.now().toString(), name: tripData.firstMemberName || 'Me' };
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString() + Math.random(),
      members: [firstMember],
      expenses: [],
    };
    setTrips(prevTrips => [...prevTrips, newTrip]);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prevTrips =>
      prevTrips.map(trip => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };
  
  const handleSelectTrip = (trip: Trip) => {
    setSelectedTripId(trip.id);
  };

  const handleGoBack = () => {
    setSelectedTripId(null);
  };

  const selectedTrip = trips.find(trip => trip.id === selectedTripId) || null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {selectedTrip ? (
        <TripDetail
          trip={selectedTrip}
          onUpdateTrip={handleUpdateTrip}
          onGoBack={handleGoBack}
        />
      ) : (
        <TripList
          trips={trips}
          onSelectTrip={handleSelectTrip}
          onAddTrip={handleAddTrip}
        />
      )}
    </div>
  );
};

export default App;
