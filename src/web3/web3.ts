import Web3 from 'web3';

// Conectando ao nó Ethereum
const web3 = new Web3("http://127.0.0.1:7545");

// Verificando a conexão
web3.eth.net.isListening()
    .then(() => console.log('Conectado ao nó Ethereum'))
    .catch(e => console.log('Erro ao conectar ao nó Ethereum:', e));

export default web3;