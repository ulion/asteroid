const genericStorage = {};

export function get (key) {
    return new Promise((resolve, reject) => {
        if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.local.get(key, data => resolve(data[key]));
        } else if (typeof localStorage !== "undefined") {
            resolve(localStorage[key]);
        } else if (typeof AsyncStorage !== "undefined") {
            AsyncStorage.getItem(key, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        } else if (typeof wx !== "undefined" && wx.getStorage) {
            wx.getStorage({
                key,
                success: res => {
                    resolve(res.data)
                },
                fail: reject
            });
        } else {
            resolve(genericStorage[key]);
        }
    });
}

export function set (key, value) {
    return new Promise((resolve, reject) => {
        if (typeof chrome !== "undefined" && chrome.storage) {
            const data = {
                [key]: value
            };
            chrome.storage.local.set(data, resolve);
        } else if (typeof localStorage !== "undefined") {
            localStorage[key] = value;
            resolve();
        } else if (typeof AsyncStorage !== "undefined") {
            AsyncStorage.setItem(key, value, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        } else if (typeof wx !== "undefined" && wx.setStorage) {
            wx.setStorage({
                key,
                data: value,
                success: resolve,
                fail: reject
            });
        } else {
            genericStorage[key] = value;
            resolve();
        }
    });
}

export function del (key) {
    return new Promise((resolve, reject) => {
        if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.local.remove(key, resolve);
        } else if (typeof localStorage !== "undefined") {
            delete localStorage[key];
            resolve();
        } else if (typeof AsyncStorage !== "undefined") {
            AsyncStorage.removeItem(key, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        } else if (typeof wx !== "undefined" && wx.removeStorage) {
            wx.removeStorage({
                key,
                success: resolve,
                fail: reject
            });
        } else {
            delete genericStorage[key];
            resolve();
        }
    });
}
