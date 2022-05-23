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
    document.getElementById("header").remove();


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

    let firstVideo = getInitialVideoDiv();
    gameArea.appendChild(firstVideo);


    let rightDiv = getNewVideoDiv();
    gameArea.appendChild(rightDiv);

}

function answer(guess) {

    // starting number as it counts up
    let start = 0
    let end = parseInt(game.rightVideo.views);

    //disable buttons pre-countup
    document.getElementById("buttonContainer").remove();

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

function getInitialVideoDiv() {

    let video = game.leftVideo;

    let videoDiv = document.createElement("div");
    let thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail-frame")
    let thumbnail = document.createElement("img");
    thumbnailDiv.appendChild(thumbnail);
    let title = document.createElement("h2");
    title.classList.add("title")
    thumbnailDiv.appendChild(title);

    let viewCount = document.createElement("p");
    viewCount.classList.add("view-count");
    let views = document.createElement("p");

    thumbnail.src = `${video.picture.url}`;
    title.innerText = `${video.title}`;
    let viewsInt = parseInt(video.views);
    let viewCountCommas = viewsInt.toLocaleString();
    viewCount.innerText = `${viewCountCommas}`;
    views.innerText = "views";

    videoDiv.appendChild(thumbnailDiv);
    videoDiv.appendChild(viewCount);
    videoDiv.appendChild(views);

    videoDiv.className = "videoDiv"
    videoDiv.id = "video1";

    return videoDiv;
}

function getNewVideoDiv() {

    // get video from game object
    // rightVideo is the property of the newly generated video
    let video = game.rightVideo;

    let videoDiv = document.createElement("div");
    let thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail-frame")
    let thumbnail = document.createElement("img");
    thumbnailDiv.appendChild(thumbnail);

    let title = document.createElement("h2");
    title.classList.add("title");

    thumbnailDiv.appendChild(title);

    // create buttons

    // create a container for buttons so media queries can change flex direction
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.id = "buttonContainer";
    let higherButton = document.createElement("button");
    higherButton.id = "higherButton";
    higherButton.setAttribute("onclick", "answer('higher')");
    higherButton.classList.add("button-secondary");
    higherButton.classList.add("higher");

    let lowerButton = document.createElement("button");
    lowerButton.id = "lowerButton";
    lowerButton.setAttribute("onclick", "answer('lower')");
    lowerButton.classList.add("button-secondary");
    lowerButton.classList.add("lower");

    let answerDiv = document.createElement("div");
    answerDiv.id = "result";
    answerDiv.className = "view-count";

    let views = document.createElement("p");
    views.innerText = "views";

    //populate elements with data
    thumbnail.src = `${video.picture.url}`;
    title.innerText = `${video.title}`;
    higherButton.innerText = "↑ Higher";
    lowerButton.innerText = "↓ Lower";

    //append divs
    videoDiv.appendChild(thumbnailDiv);
    buttonContainer.appendChild(higherButton);
    buttonContainer.appendChild(lowerButton);
    videoDiv.appendChild(buttonContainer);
    videoDiv.appendChild(answerDiv);
    videoDiv.appendChild(views);
    videoDiv.classList.add("videoDiv");

    videoDiv.id = "video2";
    return videoDiv;

}


function endGame() {


    let gameArea = document.getElementById("game")
    gameArea.innerHTML = "";
    gameArea.classList.add("start");
    gameArea.classList.remove("in-game");
    console.log("You lose!");



    let div = document.createElement("div");
    div.innerText = "unlucky."
    div.classList.add("play-again");
    div.id = "playAgain";
    gameArea.appendChild(div);

    let scoreDiv = document.createElement("div");
    scoreDiv.innerText = `Final Score: ${game.score}`;
    scoreDiv.classList.add("score-result");
    scoreDiv.id = "scoreDiv";
    gameArea.appendChild(scoreDiv);


    let button = document.createElement("div");
    button.innerText = "Play Again"
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

                generateNewVideo(); // this changes gamestate, game.rightVideo is a new video now.

                let resultDiv = document.getElementById("result");
                resultDiv.id = "";
                let currentRight = document.getElementById("video2");
                let newDiv = getNewVideoDiv();
                currentRight.id = "";

                let gameArea = document.getElementById("game");
                gameArea.appendChild(newDiv);


                currentRight.id = "";

                // Wait for div to be rendered, takes a bit
                setTimeout(() => {
                    document.getElementById("video1").classList.add("offscreen");
                    currentRight.classList.add("offscreen");
                    newDiv.classList.add("offscreen");

                    // delete the first div after it's offscreen, takes 1s or 1000ms, per stylesheet
                    setTimeout(() => {
                        document.getElementById("video1").remove();
                        currentRight.classList.remove("offscreen");
                        newDiv.classList.remove("offscreen");

                        // change the ids
                        currentRight.id = "video1";
                    }, 1000)

                }, 500)

            }, 1500)

        }
        else {
            console.log("Incorrect!");

            setTimeout(() => {
                endGame();
            }, 1500)
        }
    }

}



document.getElementById("startGame").addEventListener("click", playGame);
