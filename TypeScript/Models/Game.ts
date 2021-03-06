import {Hand} from "./Hand"
import {Deck} from "./Deck"
import {Card} from "./Card"

export class Game {
    dealerCards: Hand
    playerCards: Hand[]
    deck: Deck
    numberOfDecks = 3
    highScore: number


    constructor (public score: number, bet: number) {
        this.dealerCards = new Hand(0, 0)
        this.playerCards = []
        this.playerCards.push(new Hand(this.applyBet(bet), 0))
        this.deck = new Deck(this.numberOfDecks)
        this.deck.shuffle()
    }

    applyBet (bet: number) {
        this.score -= bet
        return bet
    }

    hit (hand: Hand, card?: Card): Card {

        if (card == undefined) {
            card = hand.addCardFromDeck(this.deck)
        }

        else hand.addCardFromCard(card)

        return card
    }


    playerStay (handIndex: number) {
        this.playerCards[handIndex].stayed = true
    }


    checkWinner () {

        for (let hand of this.playerCards) {
            hand.decideWinner(this.dealerCards)
            this.score += hand.winnings
        }
    }

    checkEndoPlayerTurn (): boolean {

        for (let hand of this.playerCards) {
            if (hand.stayed === false) {
                return false
            }
        }

        return true
    }

    dealerTurn () {
        while (Math.floor(this.dealerCards.getLowestScore()) < 17 && this.dealerCards.getHighestScore() != 21)
            this.hit(this.dealerCards)
        this.checkWinner()
    }

    splitPlayerHand (handIndex: number) {
        let hand = this.playerCards[handIndex]
        let newHand = new Hand(this.applyBet(hand.bet), this.playerCards.length)

        newHand.addCardFromCard(hand.cards.pop())
        this.hit(hand)
        this.hit(newHand)
        this.playerCards.push(newHand)
    }

    doubleDown (handIndex: number) {
        let hand = this.playerCards[handIndex]
        hand.bet += this.applyBet(hand.bet)
        this.hit(hand)
        this.playerStay(handIndex)
    }

    surrender (handIndex: number) {
        let hand = this.playerCards[handIndex]
        hand.surrender = true
        this.playerStay(handIndex)
    }

    insureHand (handIndex: number) {
        let hand = this.playerCards[handIndex]
        let insureAmount = hand.bet / 2
        hand.insurance = insureAmount
        this.score -= insureAmount
    }

}
