let localStorage = {};

export default {  
    setItem(key, value) {
        return Object.assign(localStorage, {[key]: value});
    },
    getItem(key) {
        return localStorage[key];
    },
    removeItem(key) {
        console.log(localStorage)
        delete localStorage[key]
        return localStorage
    },
    hasOwnProperty(key) {
        return localStorage.hasOwnProperty(key)
    },
    clear() {
        localStorage = {};
    }
};