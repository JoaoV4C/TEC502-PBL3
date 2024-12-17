import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import 'tailwindcss/tailwind.css';
import ModalBet from './modalBet';
import { closeBetEvent } from '../../web3/web3Functions'; // Certifique-se de ajustar o caminho conforme necessário

interface EventCardProps {  
    eventId: bigint;
    name1: string;
    name2: string;
    bet1: string;
    bet2: string;
    endTime: string;
    account: string;
    open: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ eventId, name1, name2, bet1, bet2, endTime, account, open }) => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleEndEvent = async () => {
        setLoading(true);
        const response = await closeBetEvent(account, eventId);
        if (response instanceof Error) {
            alert(`Erro: ${response.message}`);
        } else {
            alert(response.message);
        }
        setLoading(false);
    };

    return (
        <Card className="event-card m-4 p-4 shadow-lg">
            <CardContent>
                <Typography variant="h5" component="div">
                    {name1} vs {name2}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Apostas {name1}: {bet1} ETH
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Apostas {name2}: {bet2} ETH
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Data de Encerramento: {endTime}
                </Typography>
                <Typography className = "mt-1" variant="body2" color={open ? "primary" : "error"} >
                    {open ? 'Aposta Aberta' : 'Aposta Encerrada'}
                </Typography>
                <div className="mt-2 flex justify-between">
                    <Button variant="contained" color="primary" onClick={handleOpenModal} disabled={!open}>
                        Apostar
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleEndEvent} disabled={loading || !open}>
                        {loading ? 'Encerrando...' : 'Encerrar'}
                    </Button>
                </div>
            </CardContent>
            <ModalBet open={openModal} handleClose={handleCloseModal} name1={name1} name2={name2} eventId={eventId} account={account}/>
        </Card>
    );
};

export default EventCard;