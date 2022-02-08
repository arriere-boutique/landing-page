export default {
    email (v) {
        let errors = []

        try {
            v = new URL(v)
            if (v.protocol !== 'http:' && v.protocol !== 'https:') throw 'error'
        } catch (e) {
            errors = ['Ce lien ne semble pas correct']
        }

        return { valid: errors.length == 0, errors }
    },
    password (v) {
        let errors = []

        if (v.length < 6) errors.push('Ton mot de passe doit faire au moins 6 caractères.')

        return { valid: errors.length == 0, errors }
    },
    slug (v) {
        let errors = []
        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

        if (format.test(v)) errors.push('Cette valeur ne peut pas contenir de caractères spéciaux.')
        if (v.length < 3) errors.push('Ton nom de boutique ne peut pas être inférieur à 3 caractères')
        if (v.length > 20) errors.push('Ton nom de boutique ne peut pas excéder 20 caractères')

        return { valid: errors.length == 0, errors }

    }
}