export default [
    {
        id: `free`,
        name: `Gratuit`,
        color: 'light',
        prices: {
            base: 0
        },
        features: {
            pages: [
                { label: `1 page` },
                { label: `Modules basiques` }
            ],
            fun: [
                { label: `No fun :(`, no: true },
            ],
            orders: [
                { label: `Pas de gestion de commande`, no: true }
            ],
            tools: [
                { label: `1 boutique Etsy` },
                { label: `30 mots-clés / jour` },
                { label: `Calculatrice de profit` },
            ],
        }
    }, {
        id: `basic`,
        name: `Basique`,
        color: 'pond',
        icon: 'sparkles',
        prices: {
            base: 9.99,
            early: 4.99
        },
        features: {
            pages: [
                { label: `2 pages` },
                { label: `Modules avancés`, dev: true },
            ],
            orders: [
                { label: `5 commandes / jour`, dev: true },
                { label: `Messages cadeau`, highlight: true, dev: true },
                { label: `Profit par commande`, highlight: true, dev: true },
            ],
            fun: [
                { label: `Création de bannière de boutique`, highlight: true, dev: true },
            ],
            tools: [
                { label: `200 mots-clés / jour` },
                { label: `Comparateur de prix`, highlight: true, dev: true }
            ],
        }
    }, {
        id: `creation`,
        name: `Création`,
        color: 'precious',
        icon: 'stars',
        prices: {
            base: 16.99,
            early: 11.99
        },
        features: {
            pages: [
                { label: `Pages illimitées`, highlight: true, tooltip: 'gay' },
                { label: `Lien personnalisable`, highlight: true },
                { label: `Utilise tes propres images`, dev: true },
                { label: `Cacher le logo l'Arrière Boutique` },
            ],
            fun: [
                { label: `Organise des jeux-concours`, highlight: true, dev: true },
                { label: `Génération d'images produit`, highlight: true, dev: true },
            ],
            orders: [
                { label: `50 commandes / jour`, dev: true },
                { label: `Intégration Mondial Relay`, highlight: true, dev: true },
            ],
            tools: [
                { label: `Jusqu'à 5 boutiques Etsy`, highlight: true },
                { label: `Mots-clés illimités` }
            ],
        }
    },
]

// {
//     id: `unlimited`,
//     name: `Illimité`,
//     prices: {
//         base: 24.99
//     },
//     features: {
//         pages: [
//             { label: `Pages illimitées` },
//             { label: `Pas de logo l`Arrière Boutique` },
//         ],
//         fun: [
//             { label: `100 mots-clés / jour` },
//         ],
//         orders: [
//             { label: `Commandes illimitées` },
//             { label: `Impression de messages cadeau` }
//         ],
//         tools: [
//             { label: `Mots-clés illimités` }
//         ],
//     }
// },