import EMOJIS from '@/static/emojis.json'
import ICONS from '@/static/icons.json'

export function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomizeArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
    
    return array
}

export function randomEmoji() {
    return EMOJIS[randomBetween(0, EMOJIS.length - 1)] + '️'
}

export function randomIcon() {
    return ICONS[randomBetween(0, ICONS.length - 1)]
}

export function sortDate (items, property = 'date') {
    items = items.slice()
    return items.sort((a, b) => b[property].diff(a[property]))
}

export function sortPastFuture (items, property = 'date') {
    let pastItems = items.filter(item => item[property].isBefore(new Date())).sort((a, b) => b[property].diff(a[property]))
    let futureItems = items.filter(item => item[property].isAfter(new Date())).sort((a, b) => a[property].diff(b[property]))

    return [ ...futureItems, ...pastItems ]
}

export function setPropertyFor (items, search, value) {

    return items.map(item => ({
        ...item, [Object.keys(value)[0]]: item[Object.keys(search)[0]] == Object.values(search)[0] ? Object.values(value)[0] : item[Object.keys(value)[0]]
    }))
}