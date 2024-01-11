import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';


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


//User
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

export async function setUserNameAsyncStorage(userName) {
    try {
        await AsyncStorage.setItem('@UserName', userName);
    } catch (e) {
    }
}

export async function getUserNameAsyncStorage() {
    try {
        const response = await AsyncStorage.getItem('@UserName');
        return response;

    } catch (e) {
        return 'deu errado no get';
    }
}

export async function removeUserNameAsyncSotorage() {
    try {
        await AsyncStorage.removeItem('@UserName');
        
    } catch (e) {

    }
}


export default async function isValidToken() {
    const token = localStorage.getItem('@TokenAuthentication');

    try {
        if(!token) {
            return false;
        }
        
        await api.get('/test/token');
        
        return true;

    } catch(e) {
        return false;
    }
    
}