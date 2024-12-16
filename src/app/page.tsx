"use client";

import React, { useEffect, useState } from 'react';
import EventCard from './components/eventCard';
import { BetEvent, getOpenBetEvents } from '../web3/web3Functions';

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<BetEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="event-list-page">
      {events.map((event, index) => (
        <EventCard
          key={index}
          name1={event.name1}
          name2={event.name2}
          bet1={event.bets1}
          bet2={event.bets2}
          endTime={event.endTime}
          onBet={() => console.log('Bet clicked')}
          onEnd={() => console.log('End clicked')}
        />
      ))}
    </div>
  );
};

export default EventListPage;