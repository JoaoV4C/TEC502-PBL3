import React from 'react';
import { Card, CardContent, Typography} from '@mui/material';

interface BetCardProps {
    bet:{
        name1: string;
        name2: string;
        value: string;
        choice: boolean;
        open: boolean;
        result: boolean;
    }
}

const BetCard: React.FC<BetCardProps> = ({bet}) => {
    return (
        <Card className="shadow-lg">
            <CardContent>
                <Typography variant="h6" component="div">
                    {bet.name1} vs {bet.name2}
                </Typography>
                <Typography color="textSecondary">
                    Aposta: {bet.value} ETH
                </Typography>
                <Typography color="textSecondary">
                    Escolha: {bet.choice ? bet.name1 : bet.name2}
                </Typography>
                <Typography color="textSecondary">
                    Status: {bet.open ? 'Aberto' : 'Fechado'}
                </Typography>
                {bet.open ?
                <Typography color="textSecondary">
                Aguardando resultado
                </Typography> 
                : 
                <Typography color="textSecondary">
                Resultado: {bet.result ? bet.name2 : bet.name1}
                </Typography>
                }
                
            </CardContent>
        </Card>
    )
};

export default BetCard;