import Web3 from 'web3';
import contractBetJson from '../../build/contracts/BetManager.json';
import contractAddressJson from '../../build/contracts/ContractAddress.json';

// Conectando ao nó Ethereum
const web3 = new Web3("http://127.0.0.1:7545");

const contractABI = contractBetJson.abi;
const contractAddress = contractAddressJson.contractAddress; // Endereço do contrato implantado

const betManager = new web3.eth.Contract(contractABI, contractAddress);

export interface BetEvent {
    eventId: bigint;
    name1: string;
    name2: string;
    bets1: bigint;
    bets2: bigint;
    endTime: string;
    open: boolean;
    result: boolean;
    betCreator: string;
}

export async function createBetEvent(account: string, name1: string, name2: string, endTime: number) : Promise<{ message: string } | Error> {
    try {
        await betManager.methods.createBetEvent(name1, name2, endTime).send({ from: account, gas : "1299999" });
        return {message : 'Evento de aposta criado com sucesso'};
    } catch (error) {
        return {message : 'Erro ao criar o evento'};
    }
}

export async function getAccountBalance(account: string): Promise<string | Error> {
    try {
        const balance = await web3.eth.getBalance(account);
        return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
        return new Error('Erro ao obter saldo da conta');
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

export async function convertEventsToData(events: void | [] | (unknown[] & [])) {
    const eventsData = events as BetEvent[]
    const eventsTransfomed: BetEvent[] = eventsData.map((event) => ({
        eventId: web3.utils.toBigInt(event.eventId),
        name1: event.name1,
        name2: event.name2,
        bets1: BigInt(web3.utils.fromWei(event.bets1, 'ether')), 
        bets2: BigInt(web3.utils.fromWei(event.bets2, 'ether')), 
        endTime: new Date(Number(web3.utils.toBigInt(event.endTime).toString()) * 1000).toISOString().split('T')[0],
        open: event.open,
        result: event.result,
        betCreator: event.betCreator
    }));    
    return eventsTransfomed
}

export async function getOpenBetEvents(): Promise<BetEvent[] | Error> {
    try {
        const events = await betManager.methods.getOpenBetEvents().call();
        const eventsTransfomed = convertEventsToData(events)
        if (!events || events.length === 0) {
            throw new Error('Nenhum evento aberto encontrado');
        }
        return eventsTransfomed;
    } catch (error: any) {
        if (error instanceof Error) {
            return new Error(error.message);
        } else {
            return new Error('Erro desconhecido');
        }
    }
}

export async function getBetEventsByCreator(account: string): Promise<any[] | Error> {
    try {
        const events = await betManager.methods.getBetsByCreator(account).call()
        const eventsTransfomed = convertEventsToData(events)
        if (!events || events.length === 0) {
            throw new Error('Nenhum evento encontrado para o usuário');
        }
        return eventsTransfomed;
    } catch (error: any) {
        if (error instanceof Error) {
            return new Error(error.message);
        } else {
            return new Error('Erro desconhecido');
        }
    }
}