let positionFromTop;
let documentHeight;

let emojisPerScroll = 6;

let emojisAlreadyLoaded = 0;
let scrollHistory = 0;
let emojisRankLimit = 0;
let emojis = "";
let emojisNames = [];

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
    }, 50)
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
            processEmojis(0, 119);
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

const processEmojis = (minRank, maxRank) => {
    let preparedEmojis = '';
    for (let index = minRank; index <= maxRank && maxRank <= emojisRankLimit; index++) {
        preparedEmojis += `<div class="emoji scaleDown">${emojis[index]['char']}</div>`;
    }
    emojisAlreadyLoaded = maxRank;
    document.querySelector('.emojis').innerHTML += preparedEmojis;
    showEmojis('.list');
};

document.addEventListener('DOMContentLoaded', () => {
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

});

document.addEventListener('scroll', () => {
    positionFromTop = this.scrollY;
    let scrollCurrent = (Math.floor(positionFromTop / 50));
    if (scrollCurrent > scrollHistory) {
        let scrollDifference = scrollCurrent - scrollHistory;
        scrollHistory = scrollCurrent;
        processEmojis(emojisAlreadyLoaded + 1, emojisAlreadyLoaded + scrollDifference * emojisPerScroll);
        showEmojis('.results');
    }
});

fetchEmojis();
