// remember to turn ur number strings to numbers

const myStorage = window.localStorage;

const game = {
    leftVideo: null,
    rightVideo: null,
    score: 0
};

if (myStorage.getItem("highscore")) {
    console.log(myStorage.getItem("highscore"));
    document.getElementById("highscore").innerText = `High Score: ${myStorage.getItem("highscore")}`;
}
else {
    myStorage.setItem("highscore", 0);
}

function playGame() {

    // reset the score
    game.score = 0;
    document.getElementById("score").innerText = `Score: ${game.score}`;

    // change the apperance of the game area
    document.getElementById("startGame").remove();

    // if clicked through Play Again, clears that from the DOM
    if (document.getElementById("playAgain")) {
        document.getElementById("playAgain").remove();
    }

    if (document.getElementById("scoreDiv")) {
        document.getElementById("scoreDiv").remove();
    }

    let gameArea = document.getElementById("game")
    gameArea.classList.remove("start");
    gameArea.classList.add("in-game")

    // get a random video
    game.leftVideo = getVideo();

    // get unique second video
    let newVideo = getVideo();
    while (game.leftVideo == newVideo) {
        newVideo = getVideo();
    }
    game.rightVideo = newVideo;

    drawLeftVideo(game.leftVideo);

    drawRightVideo(game.rightVideo);

}


function answer(guess) {

    // starting number as it counts up
    let start = 0
    let end = parseInt(game.rightVideo.views);

    //disable buttons pre-countup
    document.getElementById("higherButton").remove();
    document.getElementById("lowerButton").remove();

    // randomize the increment to build suspense on count up

    let increment = Math.floor((end - start) / 30);

    console.log(`start: ${start},end: ${end}, increment: ${increment} `);
    // count up the views
    countupTimer(start, end, increment, guess);

}

function getResult(guess) {
    // argument passed in is either higher or lower

    let left = parseInt(game.leftVideo.views);
    let right = parseInt(game.rightVideo.views);
    if (guess == "higher") {
        if (left > right) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (guess == "lower") {
        if (left >= right) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

// creates a new video to comapre with the video that previously was on the right
function generateNewVideo() {
    game.leftVideo = game.rightVideo;

    let newVideo = getVideo();


    while (game.leftVideo == newVideo) {
        newVideo = getVideo();
    }

    game.rightVideo = newVideo;
}

// gets a random video
function getVideo() {
    let num = Math.floor(Math.random() * meleeSets2.length);
    return meleeSets2[num];
}

// draws the "left" video, the video that the "right" video, the one being voted on, is compared to.
function drawLeftVideo(video) {
    // create DOM Element
    let left = document.createElement("div");
    let thumbnail = document.createElement("img");
    let title = document.createElement("h2");
    title.classList.add("title")
    let viewCount = document.createElement("p");
    viewCount.classList.add("view-count");
    let views = document.createElement("p");

    thumbnail.src = `${video.picture.url}`;
    title.innerText = `${video.title}`;
    let viewsInt = parseInt(video.views);
    let viewCountCommas = viewsInt.toLocaleString();
    viewCount.innerText = `${viewCountCommas}`;
    views.innerText = "views";

    left.appendChild(thumbnail);
    left.appendChild(title);
    left.appendChild(viewCount);
    left.appendChild(views);

    left.className = "left"
    left.id = "left";

    let gameArea = document.getElementById("game");
    gameArea.appendChild(left);
}


function drawRightVideo(video) {
    // create the rightVideos' DOM Element
    let right = document.createElement("div");
    let thumbnail2 = document.createElement("img");
    let title2 = document.createElement("h2");
    title2.classList.add("title");


    let higherButton = document.createElement("div");
    higherButton.id = "higherButton";
    higherButton.setAttribute("onclick", "answer('higher')");
    higherButton.classList.add("button-secondary");
    higherButton.classList.add("higher");

    let lowerButton = document.createElement("div");
    lowerButton.id = "lowerButton";
    lowerButton.setAttribute("onclick", "answer('lower')");
    lowerButton.classList.add("button-secondary");
    lowerButton.classList.add("lower");

    let answerDiv = document.createElement("div");
    answerDiv.id = "result";
    answerDiv.className = "view-count";

    thumbnail2.src = `${video.picture.url}`;
    title2.innerHTML = `${video.title}`;
    higherButton.innerHTML = "Higher";
    lowerButton.innerHTML = "Lower";

    right.appendChild(thumbnail2);
    right.appendChild(title2);
    right.appendChild(higherButton);
    right.appendChild(lowerButton);
    right.appendChild(answerDiv);

    right.className = "right";
    right.id = "right";


    let gameArea = document.getElementById("game");

    gameArea.appendChild(right);

}


function endGame() {


    let gameArea = document.getElementById("game")
    gameArea.innerHTML = "";
    gameArea.classList.add("start");
    gameArea.classList.remove("in-game");
    console.log("You lose!");

    let div = document.createElement("div");
    div.innerText = "Thanks for Playing!"
    div.classList.add("play-again");
    div.id = "playAgain";
    gameArea.appendChild(div);

    let scoreDiv = document.createElement("div");
    scoreDiv.innerText = `Final Score: ${game.score}`;
    scoreDiv.classList.add("score-result");
    scoreDiv.id = "scoreDiv";
    gameArea.appendChild(scoreDiv);


    let button = document.createElement("div");
    button.innerText = "Play Again?"
    button.classList.add("button");
    button.id = "startGame";
    button.addEventListener("click", playGame);
    gameArea.appendChild(button)
}


function countupTimer(start, end, increment, guess) {
    let i = start;
    console.log(i);
    document.getElementById("result").innerText = i.toLocaleString();
    i += increment;
    if (i <= end) {
        setTimeout(() => {
            countupTimer(start + increment, end, increment, guess)
        }, 50)
    }
    else {
        console.log("end");
        if (getResult(guess)) {
            console.log("Correct!");
            // do stuff here like showing the views counting upwards to build anticipation

            setTimeout(() => {
                game.score++;
                let highscore = parseInt(myStorage.highscore);
                if (game.score > highscore) {
                    myStorage.highscore = game.score;
                    document.getElementById("highscore").innerText = `High Score: ${myStorage.getItem("highscore")}`;
                }
                document.getElementById("score").innerText = `Score: ${game.score}`;

                generateNewVideo();
                document.getElementById("left").remove();
                drawLeftVideo(game.leftVideo);
                document.getElementById("right").remove();
                drawRightVideo(game.rightVideo);
            }, 1500)

        }
        else {
            console.log("Incorrect!");
            // do stuff here before straight up ending the game, like "counting" the views

            setTimeout(() => {
                endGame();
            }, 1500)
        }
    }

}



document.getElementById("startGame").addEventListener("click", playGame);
