export default {
    meta: {
        append: ` | L'Arrière Boutique`
    },
    blog: {
        categories: {
            news: {
                label: 'Tout sur Etsy',
                description: `Tout sur le monde de la création artisanale et de la vente en ligne.`
            },
            identity: {
                label: 'Identité de marque',
                description: `Afficher ton histoire et ton unicité pour te faire ta place.`
            },
            value: {
                label: 'Valeur perçue',
                description: `Mettre en valeur tes produits auprès de tes clients potentiels.`
            },
            seo: {
                label: 'Référencement',
                description: `Optimiser ta boutique pour être visible sur Etsy et ailleurs.`
            },
        }
    },
    errors: {
        default: {
            generic: `Une erreur est survenue, peux-tu réessayer ?`,
            emailNotFound: `Cet e-mail n'est pas enregistré, peut-être veux-tu plutôt t'inscrire ?`,
            wrongCredentials: `Ton mot de passe est incorrect, peux-tu réessayer s'il-te-plaît ?`,
            missingFields: `On dirait qu'il me manque des informations, tu veux bien vérifier s'il-te-plaît ?`,
            alreadyRegistered: `Merveilleux, tu as déjà un compte ! Essaye plutôt de te connecter.`,
        }
    },
    EmailingForm: {
        errors: {
            'missingFields': `On dirait qu'il me manque des informations, tu veux bien vérifier s'il-te-plaît ?`,
            'invalid-parameter': `Je crois qu'il y a une erreur dans ton adresse mail, tu veux bien vérifier s'il-te-plaît ?`,
            'duplicate-parameter': `J'admire beaucoup ton enthousiasme mais tu fais déjà partie de la liste !`,
            'challenge-failed': `Oh oh, on dirait que notre système de sécurité te considère comme un robot... Peux-tu réessayer plus tard ?`
        }
    },
    tiers: {
        categories: {
            pages: {
                label: 'Pages personnalisées'
            },
            orders: {
                label: 'Gestion des commandes'
            },
            fun: {
                label: 'Fonctions cools'
            },
            tools: {
                label: 'Outils'
            },
        }
    },
    modules: {
        requirements: {
            shop: `au moins 1 boutique Etsy connectée`
        }
    }
}