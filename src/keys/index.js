/*
import { default as keyStoreIndexeddb } from './key-store-indexeddb.js';
import { default as keyStoreLocalstorage } from './key-store-localstorage.js';

let keyStore;

var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isSafari || iOS) {
    keyStore = keyStoreLocalstorage;
} else {
    keyStore = keyStoreIndexeddb;
}*/

export { default as keyStore } from './key-store-indexeddb.js';
export { default as Key } from './key.js';
export { default as KeyType } from './key-type.js';
