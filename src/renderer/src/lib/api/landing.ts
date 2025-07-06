import axios from 'axios'

async function vaultFetch(username: string, token: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const data = {
            username: username
        }
        const authHeader = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        await axios
            .post('http://127.0.0.1:5000/api/getvault', data, authHeader)
            .then((response) => {
                localStorage.setItem('vault', JSON.stringify(response.data.entries))
                return resolve(response.data)
            })
            .catch((e) => {
                return reject({response: e.response})
            })
    })
}

async function login(username: string, password: string, otp: string = "000000", twofa: boolean = false): Promise<{ twoFAverif: boolean, loginSuccess: boolean, response: any }> {
    return new Promise(async (resolve, reject) => {
        console.log(twofa)
        if (twofa) {
            const data = {
                username: username,
                password: password,
                otp: otp
            }
            await axios
                .post('http://127.0.0.1:5000/api/loginotp', data)
                .then((response) => {
                    if (response.data.two_fa == true) {
                        return resolve({
                            twoFAverif: true,
                            loginSuccess: true,
                            response: response.data
                        })
                    } else {
                        return resolve({
                            twoFAverif: false,
                            loginSuccess: true,
                            response: response.data
                        })
                    }
                })
                .catch((e) => {
                    console.log(e)
                    return reject({
                        twoFAverif: false,
                        loginSuccess: false,
                        response: e.response.data
                    })
                })
        } else {
            const data = {
                username: username,
                password: password
            }
            await axios
                .post('http://127.0.0.1:5000/api/login', data)
                .then((response) => {
                    if (response.data.two_fa == true) {
                        return resolve({
                            twoFAverif: true,
                            loginSuccess: true,
                            response: response.data
                        })
                    } else {
                        return resolve({
                            twoFAverif: false,
                            loginSuccess: true,
                            response: response.data
                        })
                    }
                })
                .catch((e) => {
                    console.log(e)
                    return reject({
                        twoFAverif: false,
                        loginSuccess: false,
                        response: e.response.data
                    })
                })
            }
    })
    
}

async function register(username: string, password: string, checkPass: string): Promise<any> {
    const data = {
        username: username,
        password: password,
        check_password: checkPass
    }
    return new Promise(async (resolve, reject) => {
        await axios
            .post('http://127.0.0.1:5000/api/register', data)
            .then((response) => {
                return resolve(response.data)
            })
            .catch((e) => {
                return reject({response: e.response.data})
            })
    })
}

export { login, register, vaultFetch }