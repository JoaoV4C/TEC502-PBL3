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
    bets1: string;
    bets2: string;
    endTime: string;
    open: boolean;
    result: boolean;
    betCreator: string;
}

export interface Bet {
    name1: string;
    name2: string;
    open: boolean;
    result: boolean;
    choice: boolean;
    value: string;
}

interface ContractExecutionError extends Error {
    cause?: {
        message: string;
    };
    code?: number;
}

function handleError(error: unknown): string {
    console.log(error);
    if (error instanceof Error) {
        const contractError = error as ContractExecutionError;
        const messageError = contractError.cause?.message;
        if (messageError) {
            if (messageError.includes('insufficient funds for gas * price + value')) {
                return 'Saldo insuficiente';
            }
            const revertMessageMatch = messageError.match(/revert (.*)/);
            if (revertMessageMatch) {
                return revertMessageMatch[1];
            }
        }
    }
    return 'Erro desconhecido';
}

export async function closeBetEvent(account: string, eventId: bigint): Promise<{ message: string } | Error> {
    try {
        await betManager.methods.closeBetEvent(eventId).send({ from: account, gas: "1299999" });
        return { message: 'Evento de aposta encerrado com sucesso' };
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}

export async function placeBet(account: string, eventId: bigint, amount: string, betOn: boolean): Promise<{ message: string } | Error> {
    try {
        const amountInWei = web3.utils.toWei(amount, 'ether');
        await betManager.methods.placeBet(eventId, betOn).send({ from: account, value: amountInWei, gas: "1299999" });
        return { message: 'Aposta realizada com sucesso' };
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}

export async function createBetEvent(account: string, name1: string, name2: string, endTime: number): Promise<{ message: string } | Error> {
    try {
        await betManager.methods.createBetEvent(name1, name2, endTime).send({ from: account, gas: "1299999" });
        return { message: 'Evento de aposta criado com sucesso' };
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}

export async function getAccountBalance(account: string): Promise<string | Error> {
    try {
        const balance = await web3.eth.getBalance(account);
        return web3.utils.fromWei(balance, 'ether');
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}

export async function getAccounts(): Promise<string[] | Error> {
    try {
        const accounts = await web3.eth.getAccounts();
        return accounts;
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}

export async function convertEventsToData(events: void | [] | (unknown[] & [])) {
    const eventsData = events as BetEvent[]
    const eventsTransfomed: BetEvent[] = eventsData.map((event) => ({
        eventId: web3.utils.toBigInt(event.eventId),
        name1: event.name1,
        name2: event.name2,
        bets1: web3.utils.fromWei(event.bets1, 'ether'), 
        bets2: web3.utils.fromWei(event.bets2, 'ether'), 
        endTime: new Date(Number(web3.utils.toBigInt(event.endTime).toString()) * 1000).toISOString().split('T')[0],
        open: event.open,
        result: event.result,
        betCreator: event.betCreator
    }));    
    return eventsTransfomed
}

export async function convertBetsToData(bets: void | [] | (unknown[] & [])) {
    const betsData = bets as Bet[]
    const betsTransfomed: Bet[] = betsData.map((bet) => ({
        name1: bet.name1,
        name2: bet.name2,
        open: bet.open,
        result: bet.result,
        choice: bet.choice,
        value: web3.utils.fromWei(bet.value, 'ether')
    }));    
    return betsTransfomed
}

export async function getUserBets(account:string): Promise<Bet[] | Error> {
    try {
        const bets = await betManager.methods.getUserBets(account).call();
        const betsTransfomed = convertBetsToData(bets)
        if (!bets || bets.length === 0) {
            return new Error('Nenhuma aposta encontrada');
        }
        return betsTransfomed;
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}

export async function getOpenBetEvents(): Promise<BetEvent[] | Error> {
    try {
        const events = await betManager.methods.getOpenBetEvents().call();
        const eventsTransfomed = convertEventsToData(events)
        if (!events || events.length === 0) {
            return new Error('Nenhum evento aberto encontrado');
        }
        return eventsTransfomed;
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}

export async function getBetEventsByCreator(account: string): Promise<any[] | Error> {
    try {
        const events = await betManager.methods.getBetsByCreator(account).call()
        const eventsTransfomed = convertEventsToData(events)
        if (!events || events.length === 0) {
            return new Error('Nenhum evento encontrado para o usuário');
        }
        return eventsTransfomed;
    } catch (error: unknown) {
        const errorHandled = handleError(error);
        return new Error(errorHandled);
    }
}
