"use client";

import React, { useEffect, useState } from 'react';
import EventCard from './components/eventCard';
import { getOpenBetEvents } from '../web3/web3Functions';

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
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
      {/* {events.map((event, index) => (
        <EventCard
          key={index}
          name1={event.name1}
          name2={event.name2}
          bet1={event.bet1}
          bet2={event.bet2}
          endTime={event.endTime}
          onBet={() => console.log('Bet clicked')}
          onEnd={() => console.log('End clicked')}
        />
      ))} */}
      <EventCard
          key={1}
          name1={"Flamengo"}
          name2={"Bahia"}
          bet1={1000}
          bet2={2999}
          endTime={"18/12/2024"}
          onBet={() => console.log('Bet clicked')}
          onEnd={() => console.log('End clicked')}
        />
      <EventCard
          key={2}
          name1={"Vasco"}
          name2={"Botafogo"}
          bet1={1000}
          bet2={2999}
          endTime={"18/12/2024"}
          onBet={() => console.log('Bet clicked')}
          onEnd={() => console.log('End clicked')}
        />
    </div>
  );
};

export default EventListPage;