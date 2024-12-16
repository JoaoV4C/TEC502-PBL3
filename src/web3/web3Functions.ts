import Web3 from 'web3';
import contractBetJson from '../../build/contracts/BetManager.json';
import contractAddressJson from '../../build/contracts/ContractAddress.json';

// Conectando ao nó Ethereum
const web3 = new Web3("http://127.0.0.1:7545");

const contractABI = contractBetJson.abi;
const contractAddress = contractAddressJson.contractAddress; // Endereço do contrato implantado

const betManager = new web3.eth.Contract(contractABI, contractAddress);

export async function createBetEvent(account: string, name1: string, name2: string, endTime: number) : Promise<{ message: string } | Error> {
    try {
        await betManager.methods.createBetEvent(name1, name2, endTime).send({ from: account });
        return {message : 'Evento de aposta criado com sucesso'};
    } catch (error) {
        return {message : 'Erro ao criar o evento'};
    }
}

export async function getAccounts(): Promise<string[] | Error> {
    try {
        const accounts = await web3.eth.getAccounts();
        return accounts;
    } catch (error) {
        return new Error('Erro ao obter contas');
    }
}

export async function getOpenBetEvents(): Promise<any[] | Error> {
    try {
        const events = await betManager.methods.getOpenBetEvents().call();
        if (!events || events.length === 0) {
            throw new Error('Nenhum evento aberto encontrado');
        }
        return events;
    } catch (error: any) {
        if (error instanceof Error) {
            return new Error(error.message);
        } else {
            return new Error('Erro desconhecido');
        }
    }
}

export async function getBetEventsByUser(): Promise<any[] | Error> {
    try {
        const events = await betManager.methods.getBetsByCreator(contractAddressJson.contractAddress).call();
        if (!events || events.length === 0) {
            throw new Error('Nenhum evento encontrado para o usuário');
        }
        return events;
    } catch (error: any) {
        if (error instanceof Error) {
            return new Error(error.message);
        } else {
            return new Error('Erro desconhecido');
        }
    }
}