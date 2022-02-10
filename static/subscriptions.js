
import calendar from '@/assets/img/pledges/calendar.jpg'
import todo from '@/assets/img/pledges/todo.jpg'
import stickers from '@/assets/img/pledges/stickers.jpg'
import sticker from '@/assets/img/pledges/sticker.jpg'
import me from '@/assets/img/pledges/me.jpg'
import cards from '@/assets/img/pledges/cards.jpg'

export default [
    { amount: 10, duration: 2, available: 50, extras: [], color: 'emerald' },
    { amount: 25, duration: 4, available: 30, color: 'pond', extras: [
        {
            id: 1,
            value: 11.99,
            image: stickers,
            text: `24 stickers assortis pour tes commandes`,
            short: '24 stickers',
            href: 'https://www.etsy.com/shop/arriereboutiquefr?section_id=35533625'
        },
        {
            id: 10,
            value: 11.99,
            image: cards,
            text: `12 cartes de remerciements assorties`,
            short: '12 cartes',
            delivery: ``,
            href: 'https://www.etsy.com/shop/arriereboutiquefr?section_id=36011364'
        },
        {
            id: 2,
            value: 14.99,
            image: calendar,
            text: `1 calendrier 2022 de celles & ceux qui osent`,
            short: '1 calendrier',
            delivery: ``,
            href: 'https://www.etsy.com/fr/ArriereBoutiqueFr/listing/1138498926'
        }
    ] },
    { amount: 45, duration: 6, available: 15, color: 'ice', extras: [
        {
            id: 4,
            value: 32.99,
            image: sticker,
            text: `72 stickers personnalisés avec ton logo`,
            short: '72 stickers logo',
            delivery: ``,
            href: 'https://www.etsy.com/fr/ArriereBoutiqueFr/listing/1092507779'
        },
        {
            id: 3,
            value: 11.99,
            image: todo,
            text: `1 calepin to-do list de l'Arrière Boutique`,
            short: '1 calepin to-do',
            delivery: ``,
            href: 'https://www.etsy.com/fr/ArriereBoutiqueFr/listing/1140982632'
        },
    ] },
    { amount: 75, duration: 6, available: 5, color: 'precious', extras: [
        {
            id: 5,
            value: 59.90,
            image: me,
            text: `45 minutes de coaching par téléphone`,
            short: 'Coaching',
            delivery: ``,
            href: 'https://calendly.com/arriere-boutique'
        }
    ] },
]