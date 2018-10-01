// Saves options to chrome.storage
const save_options = (skinColor) => {
    chrome.storage.sync.set({skinColor}, () => {
        // Update status to let user know options were saved.
        let status = document.querySelector('#status');
        status.textContent = 'Options saved.';
        setTimeout(() => status.textContent = '', 750);
    });
};
const skinColorSelected = document.querySelector('#skinColor');
const restore_options = () => chrome.storage.sync.get({skinColor: "default"}, items => skinColorSelected.value = items.skinColor);
document.addEventListener('DOMContentLoaded', restore_options);
skinColorSelected.addEventListener('change', () => save_options(skinColorSelected.value), false);
