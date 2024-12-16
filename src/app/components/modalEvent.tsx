import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { createBetEvent } from '../../web3/web3Functions'; // Importe a função aqui

interface ModalEventProps {
    open: boolean;
    handleClose: () => void;
}

const ModalEvent: React.FC<ModalEventProps> = ({ open, handleClose }) => {
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreate = async () => {
        if (!name1 || !name2 || !date) {
            setError('Todos os campos são obrigatórios.');
            setSuccess(''); // Limpa a mensagem de sucesso
            return;
        }

        try {
            const endTime = new Date(date).getTime() / 1000; // Convertendo a data para timestamp Unix
            const result = await createBetEvent("0xBD6f33F0E3f021354b13a38C68C9fe649C9f94B5", name1, name2, endTime);
            if (result instanceof Error) {
                setError(result.message);
                setSuccess(''); // Limpa a mensagem de sucesso
            } else {
                setSuccess('Evento criado com sucesso!');
                setError('');
                setName1('');
                setName2('');
                setDate('');
                console.log(result.message);
            }
        } catch (error) {
            setError('Erro ao criar o evento');
            setSuccess(''); // Limpa a mensagem de sucesso
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20">
                <h2 className="text-xl mb-4">Criar evento</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-700 mb-4">{success}</p>}
                <TextField
                    label="Name 1"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    error={!name1 && !!error}
                    helperText={!name1 && !!error ? 'Este campo é obrigatório' : ''}
                />
                <TextField
                    label="Name 2"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    error={!name2 && !!error}
                    helperText={!name2 && !!error ? 'Este campo é obrigatório' : ''}
                />
                <TextField
                    type="date"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    error={!date && !!error}
                    helperText={!date && !!error ? 'Este campo é obrigatório' : ''}
                />
                <div className="flex justify-end space-x-4">
                    <Button variant="contained" color="primary" onClick={handleCreate}>
                        Criar
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalEvent;