// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract BetManager {
    struct Bet {
        address bettor;
        bool choice;
        uint256 value;
    }

    struct BetView {
        string name1;
        string name2;
        bool open;
        bool result;
        bool choice;
        uint256 value;
    }

    struct BetEvent {
        uint256 eventId;
        string name1;
        string name2;
        uint256 bets1;
        uint256 bets2;
        bool open;
        bool result; // true if name2 wins, false if name1 wins
        uint256 endTime;
        address betCreator;
    }

    BetEvent[] public betEvents;
    uint256 public nextEventId;
    mapping(uint256 => Bet[]) public bets;

    function createBetEvent(
        string memory _name1,
        string memory _name2,
        uint256 _endTime
    ) public {
        BetEvent memory newBetEvent = BetEvent({
            eventId: nextEventId,
            name1: _name1,
            name2: _name2,
            bets1: 0,
            bets2: 0,
            open: true,
            result: false,
            endTime: _endTime,
            betCreator: msg.sender
        });

        betEvents.push(newBetEvent);
        nextEventId += 1;
    }

    function placeBet(uint256 _betEventId, bool _choice) public payable {
        require(_betEventId < betEvents.length, "BetEvent does not exist");
        require(betEvents[_betEventId].open, "BetEvent is closed");
        require(msg.value > 0, "Bet value must be greater than 0");

        Bet memory newBet = Bet({
            bettor: msg.sender,
            choice: _choice,
            value: msg.value
        });

        bets[_betEventId].push(newBet);

        if (_choice) {
            betEvents[_betEventId].bets1 += msg.value;
        } else {
            betEvents[_betEventId].bets2 += msg.value;
        }
    }

    function closeBetEvent(uint256 _betEventId) public {
        require(_betEventId < betEvents.length, "BetEvent does not exist");
        require(betEvents[_betEventId].open, "BetEvent is already closed");
        require(block.timestamp >= betEvents[_betEventId].endTime, "Betting time has not ended");
        require(betEvents[_betEventId].betCreator == msg.sender, "Only the event creator can close the event");

        betEvents[_betEventId].open = false;
        betEvents[_betEventId].result = betEvents[_betEventId].bets2 > betEvents[_betEventId].bets1;

        uint256 totalBets = betEvents[_betEventId].bets1 + betEvents[_betEventId].bets2;
        uint256 winnerTotalBets = betEvents[_betEventId].result ? betEvents[_betEventId].bets2 : betEvents[_betEventId].bets1;
        uint256 commission = (totalBets * 5) / 100;
        uint256 payoutPool = totalBets - commission;

        if (winnerTotalBets > 0) {
            for (uint256 i = 0; i < bets[_betEventId].length; i++) {
                if (bets[_betEventId][i].choice == betEvents[_betEventId].result) {
                    uint256 payout = (bets[_betEventId][i].value * payoutPool) / winnerTotalBets;
                    payable(bets[_betEventId][i].bettor).transfer(payout);
                }
            }
        } else {
            for (uint256 i = 0; i < bets[_betEventId].length; i++) {
                payable(bets[_betEventId][i].bettor).transfer(bets[_betEventId][i].value);
            }
        }

        payable(betEvents[_betEventId].betCreator).transfer(commission);
    }

    function getUserBets(address _user) public view returns (BetView[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < betEvents.length; i++) {
            for (uint256 j = 0; j < bets[i].length; j++) {
                if (bets[i][j].bettor == _user) {
                    count++;
                }
            }
        }

        BetView[] memory userBets = new BetView[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < betEvents.length; i++) {
            for (uint256 j = 0; j < bets[i].length; j++) {
                if (bets[i][j].bettor == _user) {
                    userBets[index] = BetView({
                        name1: betEvents[i].name1,
                        name2: betEvents[i].name2,
                        open: betEvents[i].open,
                        result: betEvents[i].result,
                        choice: bets[i][j].choice,
                        value: bets[i][j].value
                    });
                    index++;
                }
            }
        }

        return userBets;
    }

    function getBetsByCreator(address _creator) public view returns (BetEvent[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < betEvents.length; i++) {
            if (betEvents[i].betCreator == _creator) {
                count++;
            }
        }

        BetEvent[] memory creatorBetEvents = new BetEvent[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < betEvents.length; i++) {
            if (betEvents[i].betCreator == _creator) {
                creatorBetEvents[index] = betEvents[i];
                index++;
            }
        }

        return creatorBetEvents;
    }

    function getOpenBetEvents() public view returns (BetEvent[] memory) {
        uint256 openCount = 0;
        for (uint256 i = 0; i < betEvents.length; i++) {
            if (betEvents[i].open) {
                openCount++;
            }
        }

        BetEvent[] memory openBetEvents = new BetEvent[](openCount);
        uint256 index = 0;
        for (uint256 i = 0; i < betEvents.length; i++) {
            if (betEvents[i].open) {
                openBetEvents[index] = betEvents[i];
                index++;
            }
        }

        return openBetEvents;
    }
}
