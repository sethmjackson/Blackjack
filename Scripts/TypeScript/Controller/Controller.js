var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../Models/Game", "./HTMLElements", "./HtmlHand"], function (require, exports, Game_1, html, HtmlHand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    html = __importStar(html);
    class Controller {
        constructor(currentScore) {
            this.currentScore = currentScore;
            this.debug = false;
            this.startMoney = 10000;
            html.startGameButton.addEventListener("click", (event) => this.startNewGame());
            html.betTextfield.addEventListener("keyup", (event) => this.betTextFieldListener());
            html.scoreAmount.innerText = this.startMoney.toString();
        }
        startNewGame() {
            this.game = new Game_1.Game(this.currentScore, Math.floor(parseInt(html.betTextfield.value)));
            this.resetGameHtmlData();
            this.updateCurrentScore();
            if (this.debug)
                html.testDiv.innerText = this.game.deck.toString();
            this.initialHits(true);
            html.startGameButton.style.display = "none";
            html.betSpan.style.display = "none";
            html.betTextfield.style.display = "none";
        }
        initialHits(debug) {
            if (debug) {
                //this.testAceBust()
                //this.testDoubleDown()
                //this.test21()
                this.testInsurance();
            }
            this.dealerHand.hit();
            this.playerHands[0].initialHit();
            this.playerHands[0].hit();
        }
        resetGameHtmlData() {
            html.removeDataFromDiv(html.dealerDiv);
            html.removeDataFromDiv(html.playerDiv);
            this.betDisplay(false);
            this.dealerHand = new HtmlHand_1.HtmlHand(0, this, html.dealerDiv, false);
            this.playerHands = [];
            this.playerHands.push(new HtmlHand_1.HtmlHand(0, this, html.playerDiv, true));
        }
        updateCurrentScore() {
            html.scoreAmount.innerText = this.game.score.toString();
        }
        betDisplay(display) {
            if (display) {
                html.betSpan.style.display = "inline";
                html.betTextfield.style.display = "inline";
            }
            else {
                html.betSpan.style.display = "none";
                html.betTextfield.style.display = "none";
            }
        }
        betTextFieldListener() {
            let textField = html.betTextfield;
            let number = parseInt(textField.value);
            if (isNaN(number) || number < 20) {
                html.startGameButton.disabled = true;
            }
            else
                html.startGameButton.disabled = false;
        }
        dealerTurn() {
            this.game.dealerTurn();
            html.redrawImageDiv(this.dealerHand.imageDiv, this.dealerHand);
            this.dealerHand.updateHand();
            this.endGame();
        }
        endGame() {
            let totalWinnings = 0;
            for (let hand of this.playerHands) {
                let winnings = hand.hand.winnings - hand.hand.bet;
                totalWinnings += winnings;
                hand.winningsText.innerText = hand.hand.winningText;
                if (winnings > 0)
                    hand.winningsAmount.innerText = `You gained: ${winnings}`;
                else if (winnings < 0)
                    hand.winningsAmount.innerText = `You lost: ${-winnings}`;
                else {
                    hand.winningsAmount.innerText = `You gained nothing`;
                }
            }
            this.updateCurrentScore();
            /*loop through player hands.
            * reveal winnings and winning text
            * update current score
            * reveal start new game button
            * reset game state
            *
            *
            * */
        }
    }
    exports.Controller = Controller;
});
//# sourceMappingURL=Controller.js.map