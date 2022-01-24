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
    }
}