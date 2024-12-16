'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ModalEvent from './modalEvent';
import { AccountCircle } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { getAccountBalance, getAccounts } from '../../web3/web3Functions'; // ajuste o caminho conforme necessário
import { useAccount } from '../contexts/AccountContext';
import Link from 'next/link';


const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const {account ,setAccount} = useAccount()

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

    const handleSelectAccount = (account: string) => {
        console.log("PASSEI AQUI")
        getAccountBalance(account).then(balance => {
            if (balance instanceof Error) {
                setAccount({
                    account: account,
                    balance: '0'
                })
            } else {
                setAccount({
                    account: account,
                    balance: balance
                })
            }
        });
        handleClose()
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" flexGrow={1}>
                    <Link href='/'>
                        <Button color="inherit" >Home</Button>
                    </Link>
                    <Link href='/my-bets'>
                        <Button color="inherit" >Minhas Apostas</Button>
                    </Link>
                    <Link href='/my-events'>
                        <Button color="inherit" >Meus Eventos</Button>
                    </Link>
                </Box>
                <Button color="inherit" onClick={handleOpenModal} className="mr-4">Criar Evento</Button>
                <Typography>
                    Saldo: {account.balance} ETH
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
                            <MenuItem key={index} onClick={() => handleSelectAccount(account)}>Account {index} - {account}</MenuItem>
                        ))}
                    </Menu>
                </div>
            </Toolbar>
            <ModalEvent open={openModal} handleClose={handleCloseModal} />
        </AppBar>
    );
};

export default Navbar;
