let lastCounterUsed;
let positionFromTop;
let documentHeight;

let scrollHistory = 0;
let emojisRankLimit = 0;
let emojis = "";
let emojisNames = [];

const createEmojis = (emojis) => {
    let row = document.createElement('div');
    row.classList = "row";
    emojis.forEach((emoji) => {
        row.innerHTML += `<div class='emoji'>${emoji}</div>`;
    });
    document.querySelector(".emojis.list").appendChild(row)
};

const showBadge = () => {
    document.querySelector("#badge").classList.add('active');
};

const showEmojis = (container) => {
    setTimeout(() => {
        document.querySelectorAll(`${container} .emoji`).forEach((emoji) => {
            emoji.classList.remove('scaleDown');
            emoji.addEventListener('click', () => {
                document.querySelector('.clipboard').value = emoji.innerHTML;
                document.querySelector('.clipboard').select();
                document.execCommand('copy');
                showBadge()
            })
        });
    })
};

const onLoad = () => {
    documentHeight = document.documentElement.clientHeight;
    let input = document.querySelector('input');
    input.addEventListener('keyup', (event) => {
        document.querySelector('body').scrollIntoView({behavior: 'smooth'});
        if (event.key === "Enter") {
            return;
        }

        if (input.value.length > 0) {
            let preparedEmojis = "";
            expr = '/[\s\S]*tochange[\s\S]*/g';
            expr = expr.replace('tochange', input.value);
            if (input.value.length > 0) {
                emojisNames.forEach((emoji, index) => {
                    let variable = input.value;
                    let regex = new RegExp(variable, 'g');
                    if (regex.test(emoji)) {
                        preparedEmojis += `<div class="emoji scaleDown">${emojis[index]['char']}</div>`;
                    }
                });
                if (preparedEmojis.length !== 0) {
                    document.querySelector('.emojis.results').innerHTML = preparedEmojis;
                    document.querySelector('.emojis.results').classList.remove('hidden');
                    document.querySelector('body').classList.add('overflow-hidden');
                    showEmojis('.results');
                } else {
                    document.querySelector('.results').classList.add('hidden');
                    document.querySelector('body').classList.remove('overflow-hidden');
                }
            }
        } else {
            document.querySelector('.results').classList.add('hidden');
            document.querySelector('body').classList.remove('overflow-hidden');
        }
    });
};

const onScroll = () => {
    positionFromTop = this.scrollY;
    let scrollCurrent = (Math.floor(positionFromTop / 300));
    if (scrollCurrent > scrollHistory) {
        scrollHistory = scrollCurrent;
        let counterTmp;
        for (let counter = lastCounterUsed + 1; counter < lastCounterUsed + 8; counter++) {
            let array = [];
            for (let index = (counter * 5) - 5; index <= counter * 5 - 1; index++) {
                if (emojis[index])
                    array.push(emojis[index]['char']);
            }
            createEmojis(array);
            counterTmp = counter;
        }
        lastCounterUsed = counterTmp;
        showEmojis('.results');
    }
};

const fetchEmojis = () => {
    return fetch(new Request("emoji.json"), {mode: "same-origin"})
        .then(emojiList => {
            if (emojiList.ok) {
                return emojiList.json()
            }
            throw new Error("Failed to fetch emojis")
        })
        .then(emojiList => {
            emojis = emojiList;
            emojisRankLimit = emojiList.length;

            for (let counter = 1; counter < 25; counter++) {
                let array = [];
                for (let index = (counter * 5) - 5; index <= counter * 5 - 1; index++) {
                    array.push(emojis[index]['char']);
                }
                createEmojis(array);
                lastCounterUsed = counter;
            }
            emojiList.forEach(emoji => {
                emojisNames.push(emoji.name + emoji.keywords);
            });
        })
        .then(() => {
            document.querySelector('input').placeholder = emojis[Math.floor(Math.random() * emojis.length)]['name']
        })
        .catch(error => {
            console.error(error);
        });
};

document.addEventListener('DOMContentLoaded', onLoad);
document.addEventListener('scroll', onScroll);
fetchEmojis();
