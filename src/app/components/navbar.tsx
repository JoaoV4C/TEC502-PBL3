'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ModalEvent from './modalEvent';
import { AccountCircle } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { getAccounts } from '../../web3/web3Functions'; // ajuste o caminho conforme necessário

interface NavbarProps {
    balance: number;
}

const Navbar: React.FC<NavbarProps> = ({ balance = 0 }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            const accounts = await getAccounts();
            if (!(accounts instanceof Error)) {
                setAccounts(accounts);
            }
        };
        fetchAccounts();
    }, []);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" flexGrow={1}>
                    <Button color="inherit" href='/'>Home</Button>
                    <Button color="inherit" href='/my-bets'>Minhas Apostas</Button>
                    <Button color="inherit" href='/my-events'>Meus Eventos</Button>
                </Box>
                <Button color="inherit" onClick={handleOpenModal} className="mr-4">Criar Evento</Button>
                <Typography>
                    Saldo: {balance.toFixed(2)} ETH
                </Typography>

                <div>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {accounts.map((account, index) => (
                            <MenuItem key={index} onClick={handleClose}>Account {index} - {account}</MenuItem>
                        ))}
                    </Menu>
                </div>
            </Toolbar>
            <ModalEvent open={openModal} handleClose={handleCloseModal} />
        </AppBar>
    );
};

export default Navbar;
