import App from './App.svelte';

window.onload = function () {
    const app = new App({
        target: document.getElementById('svelte_root')
    })
}
