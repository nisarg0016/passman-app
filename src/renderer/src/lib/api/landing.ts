import axios from 'axios'

async function login(username: string, password: string, otp: string = "000000", twofa: boolean = false): Promise<{ twoFAverif: boolean, loginSuccess: boolean, response: any }> {
    return new Promise(async (resolve, reject) => {
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

async function register(username: string, password: string, checkPass: string) {
    const data = {
        username: username,
        password: password,
        check_password: checkPass
    }
    await axios
        .post('http://127.0.0.1:5000/api/register', data)
        .then((response) => {
            console.log(response.data)
        })
        .catch((e) => {
            console.log(e)
        })
    return true
}

export { login, register }