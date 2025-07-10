const iconsType1 = [
    './images/women/image1.webp', 
    './images/women/image2.webp', 
    './images/women/image3.webp', 
    './images/women/image4.webp', 
    './images/women/image5.webp', 
    './images/women/image6.webp', 
    './images/women/image7.webp', 
    './images/women/image8.webp', 

    
];
const iconsType2 = [
    './images/adults/image1.webp', 
    './images/adults/image2.webp', 
    './images/adults/image3.webp', 
    './images/adults/image4.webp', 
    './images/adults/image5.webp', 
    './images/adults/image6.webp',
    './images/adults/image7.webp',
    './images/adults/image8.webp'
];
const iconsType3 = [
    './images/kids/image1.webp', 
    './images/kids/image2.webp', 
    './images/kids/image3.webp', 
    './images/kids/image4.webp', 
    './images/kids/image5.webp', 
    './images/kids/image6.webp', 
    './images/kids/image7.webp', 
    './images/kids/image8.webp', 
    
];



window.addEventListener('load', async () => {
    await loadImages();
    startGame();
});



        const board = document.querySelector('.game-board');
        const reset = document.getElementById('reset');
        const replay = document.getElementById('replay');
        const form = document.getElementById('form');
        const difficulties = document.querySelectorAll("input[name='difficulty']");
        const difficultyLabels = document.querySelectorAll("#form label");
        const timer = document.getElementById('timer');
        const ratingPerfect = document.getElementById('rating-perfect');
        const ratingAverage = document.getElementById('rating-average');
        const cardContainers = document.querySelectorAll('.card-container');
        const modal = document.querySelector('.modal');
        let clickCount = 0;
        let selectedCards = [];
        let iconClasses, sec, moves, wrongMoves, correctMoves, difficulty, difficultyClass, setTimer, selectedIcons;

        //shuffle function from https://bost.ocks.org/mike/shuffle/
        function shuffle(array) {
            var m = array.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
        }

        // go over the radio buttons and check the difficulty selection
        function checkDifficulty(){
            difficultyLabels.forEach(label => {
                label.classList.remove('checked', 'active-difficulty');
            });
            [].forEach.call(difficulties, function(input){
                if (input.value === 'type1' && input.checked === true) {
                    difficulty = 16; // Adjust as needed
                    difficultyClass = 'normal'; // You can keep it 'normal' or change it
                    input.nextElementSibling.classList.add('checked', 'active-difficulty');
                    selectedIcons = iconsType1;
                } else if (input.value === 'type2' && input.checked === true) {
                    difficulty = 16; // Adjust as needed
                    difficultyClass = 'normal'; // You can keep it 'normal' or change it
                    input.nextElementSibling.classList.add('checked', 'active-difficulty');
                    selectedIcons = iconsType2;
                } else if (input.value === 'type3' && input.checked === true) {
                    difficulty = 16; // Adjust as needed
                    difficultyClass = 'normal'; // You can set a different class for the third difficulty
                    input.nextElementSibling.classList.add('checked', 'active-difficulty');
                    selectedIcons = iconsType3;
                }
            });
        }

        function populate(num) {
            iconClasses = [];
            clickCount = 0;
            board.innerHTML = '';

            // Ensure unique image pairs
            shuffle(selectedIcons);
            let uniqueImages = [...new Set(selectedIcons)]; // Remove duplicates from the array
            let boardIcons = uniqueImages.slice(0, num / 2); // Take only enough unique images

            // Duplicate to create pairs
            boardIcons = boardIcons.flatMap(image => [image, image]);

            // Shuffle the boardIcons array after duplication
            shuffle(boardIcons);

            // Populate the board
            const fragment = document.createDocumentFragment();
            for (let x = 0; x < num; x++) {
                const cardContainer = document.createElement('div');
                cardContainer.classList.add('card-container', difficultyClass);
                const front = document.createElement('div');
                const back = document.createElement('div');
                front.classList.add('card', 'front');
                back.classList.add('card', 'back');
                const icon = document.createElement('img');
                icon.src = boardIcons[x]; // Use the image path from the shuffled array
                icon.classList.add('icon'); // Add a class for styling if needed
                back.appendChild(icon);

                cardContainer.appendChild(front);
                cardContainer.appendChild(back);
                fragment.appendChild(cardContainer);
            }
            board.appendChild(fragment);
        }


function stopwatch(){
    sec+=1;
    if (sec<60) {
        timer.innerText = sec;
    } else if (sec<3600) {
        let minutes = Math.floor(sec/60);
        let seconds = sec % 60;
        timer.innerText = minutes+":"+(seconds < 10 ? '0' : '') + seconds;
    }
}

function rating(num) {
    //star rating differs with difficulty. Allow as many wrong moves as card pairs, and then another 50% to next level.
    switch (difficultyClass) {

        case 'normal' :
            if (num === 15) {
                ratingPerfect.classList.add('hide');
            } else if (num === 27) {
                ratingAverage.classList.add('hide');
            };
            break;

    }
}

function checkwin(num) {
    //easy won with 2 correct moves, normal with 8 and hard with 18
    let won;
    switch (difficultyClass) {

        case 'normal' :
            if (num === 8) {
                won = true;
            };
            break;

    };
    if (won === true) {
        //wait 1 sec for the cards to flip right side up
        setTimeout(function(){
            //fill in and display modal
            document.getElementById('final-time').innerText = timer.innerText;
            document.getElementById('final-moves').innerText = moves;
            document.getElementById('final-rating').innerHTML = document.getElementById('stars').innerHTML;
            modal.classList.remove('hide');
            //stop the stopwatch
            clearInterval(setTimer);

            // **Call updateShareLinks after values are set**
                        updateShareLinks();

        }, 1000);
    }
}

function matchChecker(e) {
    // LOGIC IS: make sure the click target is a card and prevent doubleclicking
    if (e.target.classList.contains('card') && !e.target.classList.contains('front-open')) {
        // Flip the card on click
        e.target.classList.add('front-open');
        e.target.nextElementSibling.classList.add('back-open');

        // Keep track of the src (image) of the clicked cards
        selectedCards.push(e.target);
        clickCount += 1;

        // Allow only two clicks and then verify the match
        if (clickCount === 2) {
            clickCount = 0;
            // 2 clicks make 1 move
            moves += 1;
            document.getElementById('moves').innerHTML = moves;

            // Remove the ability to click extra cards for 1 second while the 2 already clicked cards are checked
            board.removeEventListener('click', matchChecker);
            setTimeout(function() {
                board.addEventListener('click', matchChecker);
            }, 1000);

            // Compare the image src (not class)
            if (selectedCards[0].nextElementSibling.firstChild.src === selectedCards[1].nextElementSibling.firstChild.src) {
                console.log('match');
                correctMoves += 1;
                // Check if the game is won
                checkwin(correctMoves);

                // Reset selected cards and keep them open
                selectedCards.forEach(card => {
                    card.classList.add('front-correct');
                    card.nextElementSibling.classList.add('back-correct');
                });
                selectedCards = []; // Clear the selected cards array
            } else {
                console.log('not match');
                // Handle wrong moves
                wrongMoves += 1;
                rating(wrongMoves);

                // Wait 1 second before closing mismatching cards so the player can see what they were
                setTimeout(function() {
                    selectedCards.forEach(card => {
                        card.classList.remove('front-open');
                        card.nextElementSibling.classList.remove('back-open');
                    });
                    selectedCards = []; // Reset the selected cards array
                }, 1000);
            }
        }
    }
}


const copyResultsButton = document.getElementById('copyResultsButton');

if (copyResultsButton) {
    copyResultsButton.addEventListener('click', () => {
        const time = document.getElementById('final-time').innerText;
        const moves = document.getElementById('final-moves').innerText;
        const gameUrl = window.location.href;

        const results = `I solved the game in ${time} seconds and ${moves} moves! I challenge you to check out the game here: ${gameUrl}`;

        navigator.clipboard.writeText(results)
            .then(() => alert('Result is copied! Feel free to share it!'))
            .catch(err => alert('Copying failed.'));
    });
}

// Social media sharing options (unchanged)
function updateShareLinks() {
    const time = document.getElementById('final-time').innerText;
    const moves = document.getElementById('final-moves').innerText;
    const gameUrl = window.location.href;
    const message = `I solved the game in ${time} seconds and ${moves} moves! I challenge you to check out the game here: ${gameUrl}`;
    const encodedMessage = encodeURIComponent(message);

    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
    document.getElementById('shareWhatsApp').href = `https://wa.me/?text=${encodedMessage}`;
    document.getElementById('shareViber').href = `viber://forward?text=${encodedMessage}`;
    document.getElementById('shareTelegram').href = `https://t.me/share/url?url=${encodeURIComponent(gameUrl)}&text=${encodedMessage}`;
    
}

window.addEventListener('load', updateShareLinks);




function startGame() {
    //cleanup board and reset everything
    sec = 0;
    moves = 0;
    wrongMoves = 0;
    correctMoves = 0;
    timer.innerText = '0';
    document.getElementById('moves').innerHTML = '0';
    modal.classList.add('hide');
    ratingPerfect.classList.remove('hide');
    ratingAverage.classList.remove('hide');
    clearInterval(setTimer);
    //restart game logic
    checkDifficulty();
    populate(difficulty);
    //start the timer on first click
    board.addEventListener('click', function clickOnce(){
        clearInterval(setTimer);
        setTimer = setInterval(stopwatch, 1000);
        board.removeEventListener('click', clickOnce)
    });
}

reset.addEventListener('click', startGame);
replay.addEventListener('click', startGame);
form.addEventListener('change', function(event) {
    if (event.target.name === 'difficulty') {
        startGame();
    }
});

// Use this event listener for restarting the game when clicking the replay button
replay.addEventListener('click', startGame);

// Add the click listener for the modal's "Oš igrat opet?" button (replay)
document.getElementById('replay').addEventListener('click', startGame);

// Ensure the modal doesn't reset the game if the user clicks outside of it
modal.addEventListener('click', function(e) {
    // Stop the modal click from propagating, so it doesn't trigger the window listener
    e.stopPropagation();
});

board.addEventListener('click', matchChecker);
window.addEventListener('load', () => {
    startGame();
});
