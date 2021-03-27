export class Person {
    id = '';
    firstName = '';
    lastName = '';
    email = '';
    gender = '';
    ip = '';
    constructor({
        id, first_name, last_name, email, gender, ip_address
    }){
        if (
            typeof id !== 'number'
            || (typeof first_name != 'string' && first_name.length > 50)
            || (typeof first_name != 'string' && first_name.length > 50)
            || (typeof email != 'string' && email.length > 50)
        ) throw new Error('Not a good person.')

        Object.assign(this, {
            id,
            firstName: first_name,
            lastName: last_name,
            email,
            gender,
            ip: ip_address
        })
    }
}
