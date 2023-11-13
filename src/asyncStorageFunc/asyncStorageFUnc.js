import CryptoJS from "crypto-js";
import AsyncStorage from '@react-native-async-storage/async-storage';

//Logged
export async function setLoggedAsyncStorage(logged) {
    try {
        await AsyncStorage.setItem('@Logged', JSON.stringify(logged));
    } catch(e) {
        
    }
}

export async function getLoggedAsyncStorage() {
    try {
        
        const logged = JSON.parse(await AsyncStorage.getItem('@Logged'));

        return logged;

    } catch (e) {
        
        return false;
    }
}

export async function removeLoggedAsyncSotorage() {
    try {
        await AsyncStorage.removeItem('@Logged');
        
    } catch (e) {

    }
}

// Identifier BPA-I
export async function setIdentifierBPAIAsyncStorage(identifier) {
    try {
        const key = "KD19SJW2mXwsdowda14";

        const numeroCriptografado = CryptoJS.AES.encrypt(identifier, key.toString()).toString();

        await AsyncStorage.setItem('@IdentifierBPAI', numeroCriptografado);
    } catch (e) {
    }
}

export async function getIdentifierBPAIAsyncStorage() {
    try {
        const key = "KD19SJW2mXwsdowda14";
        
        const response = await AsyncStorage.getItem('@IdentifierBPAI');

        return CryptoJS.AES.decrypt(response, key.toString()).toString();

    } catch (e) {
        return 'deu errado no get';
    }
}

export async function removeIdentifierBPAIAsyncSotorage() {
    try {
        await AsyncStorage.removeItem('@IdentifierBPAI');
        
    } catch (e) {

    }
}

// Month
export async function setMonthAsyncStorage(month) {
    await AsyncStorage.setItem('@Month', month);
}

export async function getMonthAsyncStorage() {
    return await AsyncStorage.getItem('@Month');
}

export async function removeMonthAsyncSotorage() {
    await AsyncStorage.removeItem('@Month');
}


// Year
export async function setYearAsyncStorage(year) {
    await AsyncStorage.setItem('@Year', year);
}

export async function getYearAsyncStorage() {
    return await AsyncStorage.getItem('@Year');
}

export async function removeYearAsyncSotorage() {
    await AsyncStorage.removeItem('@Year');
}


// Token
export async function setTokenAsyncStorage(token) {
    try {
        await AsyncStorage.setItem('@TokenAuthentication', token);
    } catch (e) {
    }
}

export async function getTokenAsyncStorage() {
    try {
        const response = await AsyncStorage.getItem('@TokenAuthentication');
        return response;

    } catch (e) {
        return 'deu errado no get';
    }
}

export async function removeTokenAsyncSotorage() {
    try {
        await AsyncStorage.removeItem('@TokenAuthentication');
        
    } catch (e) {

    }
}

// User
export async function setUserAsyncStorage(user) {
    try {
        await AsyncStorage.setItem('@User', JSON.stringify(user));
    } catch(e) {
    }
}

export async function getUserAsyncStorage() {
    try {
        
        const userAsync = await AsyncStorage.getItem('@User');

        if (userAsync) {

            const user = JSON.parse(userAsync);

            return user
        }

        return null;

    } catch (e) {
        return 'deu errado no getUserAsyncStorage';
    }
}

export async function removeUserAsyncSotorage() {
    try {
        await AsyncStorage.removeItem('@User');
        
    } catch (e) {

    }
}
