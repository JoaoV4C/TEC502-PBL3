import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import 'tailwindcss/tailwind.css';
import ModalBet from './modalBet';

interface EventCardProps {
    name1: string;
    name2: string;
    bet1: number;
    bet2: number;
    endTime: string;
    onBet: () => void;
    onEnd: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ name1, name2, bet1, bet2, endTime, onEnd}) => {
    const [openModal, setOpenModal] = useState(false);
    
    const handleOpenModal = () => {
        setOpenModal(true);

    };

    const handleCloseModal = () => {
        setOpenModal(false);
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
                <div className="mt-4 flex justify-between">
                    <Button variant="contained" color="primary" onClick={handleOpenModal}>
                        Apostar
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onEnd}>
                        Encerrar
                    </Button>
                </div>
            </CardContent>
            <ModalBet open={openModal} handleClose={handleCloseModal} name1 = {name1} name2 = {name2} />
        </Card>
    );
};

export default EventCard;