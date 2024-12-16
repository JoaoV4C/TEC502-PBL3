"use client"

import { useEffect, useState } from 'react';
import BetCard from '../components/betCard';
import { useAccount } from '../contexts/AccountContext';
import { Bet, getUserBets } from '@/web3/web3Functions';
import { CircularProgress, Typography } from '@mui/material';


export default function MyEvents() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {account,setAccount} = useAccount()

  useEffect(() => {
      const fetchBets = async () => {
        const userBets = await getUserBets(account.account);
        if (userBets instanceof Error) {
        } else {
            setBets(userBets);
        } 
        setLoading(false);
      };

      fetchBets();
  }, [account.account]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }


  return (
      <div className="grid grid-cols-1 gap-4">
          {bets.map((bet, index) => (
              <BetCard key={index} bet={bet} />
          ))}
      </div>
  );
}