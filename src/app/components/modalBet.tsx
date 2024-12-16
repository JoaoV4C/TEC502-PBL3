import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { placeBet } from '../../web3/web3Functions'; // Importe a função placeBet
import { useAccount } from '../contexts/AccountContext';

interface ModalBetProps {
    open: boolean;
    handleClose: () => void;
    name1: string;
    name2: string;
    eventId: bigint; // Adicione eventId como prop
    account: string; // Adicione account como prop
}

const ModalBet: React.FC<ModalBetProps> = ({ open, handleClose, name1, name2, eventId, account}) => {
    const [name1Checked, setName1Checked] = useState(false);
    const [name2Checked, setName2Checked] = useState(false);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!open) {
            setName1Checked(false);
            setName2Checked(false);
            setValue('');
            setError('');
            setSuccess('');
        }
    }, [open]);

    const handleBet = async () => {
        if (!name1Checked && !name2Checked) {
            setError('Você deve selecionar pelo menos um nome.');
            setSuccess('');
            return;
        }

        if (!value) {
            setError('O valor é obrigatório.');
            setSuccess('');
            return;
        }

        const betOn = name1Checked ? true : false;

        try {
            console.log(account)
            const result = await placeBet(account, eventId, value, betOn);
            if (result instanceof Error) {
                setError(result.message);
                setSuccess('');
            } else {
                setSuccess(result.message);
                setError('');
                setName1Checked(false);
                setName2Checked(false);
                setValue('');
            }
        } catch (error) {
            setError('Erro ao realizar a aposta.');
            setSuccess('');
        }
    };

    const handleName1Change = (checked: boolean) => {
        setName1Checked(checked);
        if (checked) {
            setName2Checked(false);
        }
    };

    const handleName2Change = (checked: boolean) => {
        setName2Checked(checked);
        if (checked) {
            setName1Checked(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20">
                <h2 className="text-xl mb-4">Realizar Aposta</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-700 mb-4">{success}</p>}
                <div className="flex justify-center items-center mb-4 space-x-4">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={name1Checked}
                                onChange={(e) => handleName1Change(e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                        }
                        label={<span style={{ fontSize: '1.2rem' }}>{name1}</span>}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={name2Checked}
                                onChange={(e) => handleName2Change(e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                        }
                        label={<span style={{ fontSize: '1.2rem' }}>{name2}</span>}
                    />
                </div>
                <TextField
                    label="Valor"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    error={!value && !!error}
                    helperText={!value && !!error ? 'Este campo é obrigatório' : ''}
                />
                <div className="flex justify-end space-x-4">
                    <Button variant="contained" color="primary" onClick={handleBet}>
                        Apostar
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalBet;