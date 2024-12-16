"use client";

import React, { useEffect, useState } from 'react';
import EventCard from './components/eventCard';
import { BetEvent, getOpenBetEvents } from '../web3/web3Functions';
import { useAccount } from './contexts/AccountContext';
import { CircularProgress } from '@mui/material';

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<BetEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {account, setAccount} = useAccount();

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await getOpenBetEvents();
      if (result instanceof Error) {
        console.log(result.message);
      } else {
        setEvents(result);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="event-list-page">
      {events.map((event, key) => (
        <EventCard
          key={key}
          eventId={event.eventId}
          name1={event.name1}
          name2={event.name2}
          bet1={event.bets1}
          bet2={event.bets2}
          endTime={event.endTime}
          account={account.account}
          open={event.open}
        />
      ))}
    </div>
  );
};

export default EventListPage;