var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        main();
    }
};

app.initialize();

const zlayers = [0, 1];
const UUID = uuid();
const canvas = createCanvas(getCanvasConfig());
const canvasContext = canvas.getContext('2d');
const CLICK_DOWN_EVENT = 'touchstart';
const CLICK_UP_EVENT = 'touchend';
const DRAG_EVENT = 'touchmove';


function main() {
    document.body.appendChild(canvas);
    document.addEventListener("touchmove", preventBehavior, false);
    var callback = playIntro();
}

function createCanvas(config) {
    return Object.assign(document.createElement('canvas'), config);
}

function getCanvasConfig() {
    return {
        height: window.innerHeight,
        width: window.innerWidth,
        id: 'canvas',
    }
}

function preventBehavior(e) {
    e.preventDefault();
};

function playIntro() {

    canvas.addEventListener(CLICK_DOWN_EVENT, startGame);

    var introAnimationCallbackId = window.requestAnimationFrame(drawIntro);
    var lastBoardSwapMillis = 0;
    const swapIntervalMillis = 1000;
    const numRows = 4;
    const numCols = 4;

    var matrix = CubeMatrix({numColumns: numCols, numRows: numRows});

    function startGame() {
        canvas.removeEventListener(CLICK_DOWN_EVENT, startGame);
        game(0);
    }

    function stop() {
        window.cancelAnimationFrame(introAnimationCallbackId);
    }

    function drawIntro() {
        const config = getIntroConfig();
        drawBackground(config);
        drawBoard(config);
        drawText(config);
        introAnimationCallbackId = window.requestAnimationFrame(drawIntro);
    }

    function drawText(config) {
        canvasContext.save();
        console.log(JSON.stringify(config));
        canvasContext.translate(config['introTextX'], config['introTextY']);
        canvasContext.font = config['introFontStyle'];
        canvasContext.fillStyle = config['introFontColor'];
        canvasContext.fillText(config['introText'], 0, 0);
        canvasContext.restore();
    }

    function drawBackground(config) {
        canvasContext.save();
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0,0,config['width'], config['height']);
        canvasContext.restore();
    }

    function drawBoard(config) {
        if ((new Date().getTime() - lastBoardSwapMillis) > swapIntervalMillis) {
            lastBoardSwapMillis = new Date().getTime();
            matrix = CubeMatrix({numColumns: numCols, numRows: numRows});
        }
        matrix.forEach((row) => row.forEach((cube) => drawCube(cube, config)));
    }

    function drawCube(cube, config) {
        canvasContext.save();
        canvasContext.translate(config['gameX'], config['gameY']);
        canvasContext.translate(config['cubeFrameWidth'] * cube['column'], config['cubeFrameHeight'] * cube['row']);
        canvasContext.translate(config['cubeFrameThickness'], config['cubeFrameThickness']);
        canvasContext.beginPath();
        canvasContext.fillStyle = cube.color;
       // var x = config['gameX'] + config['cubeFrameWidth'] * cube['column'] + config['cubeFrameThickness'];
       // var y = config['gameY'] + config['cubeFrameHeight'] * cube['row'] + config['cubeFrameThickness'];
        //console.log(x + "," + y + ": " + cube.color + " " + config['cubeWidth'] + " " + config['cubeHeight'] );
        canvasContext.fillRect(0, 0, config['cubeWidth'], config['cubeHeight']);
        canvasContext.restore();
    }

    function getIntroConfig() {

        const width = window.innerWidth;
        const height = window.innerHeight;
        const gameFrameThickness = width / 100;
        const gameFrameHeight = (height / 3) * 2;
        const gameFrameWidth = gameFrameHeight * (numCols / numRows);
        const gameFrameX = (width / 2) - (gameFrameWidth / 2);
        const gameFrameY = (height / 2) - (gameFrameHeight / 2);
        const gameX = gameFrameX + gameFrameThickness;
        const gameY = gameFrameY + gameFrameThickness;
        const gameWidth = gameFrameWidth - (2 * gameFrameThickness);
        const gameHeight = gameFrameHeight - (2 * gameFrameThickness);
        const cubeFrameWidth = gameWidth / numCols;
        const cubeFrameHeight = gameHeight / numRows;
        const cubeFrameThickness = 3;
        const cubeWidth = cubeFrameWidth - (2 * cubeFrameThickness);
        const cubeHeight = cubeFrameHeight - (2 * cubeFrameThickness);
        const introFontSize = 40;
        const introText = "PRESS ANY BUTTON";
        const introTextX = (gameX + gameWidth / 2) - (introText.length * introFontSize / 2)
        const introTextY = gameY + gameHeight + introFontSize * 2;
        const introFontStyle = introFontSize.toString() + 'px "Press Start 2P"';
        const introFontColor = 'white';


        return {
            width: width,
            height: height,
            gameFrameX: gameFrameX,
            gameFrameY: gameFrameY,
            gameFrameWidth: gameFrameWidth,
            gameFrameHeight: gameFrameHeight,
            gameFrameThickness: gameFrameThickness,
            gameX: gameX,
            gameY: gameY,
            gameWidth: gameWidth,
            gameHeight: gameHeight,
            cubeFrameWidth: cubeFrameWidth,
            cubeFrameHeight: cubeFrameHeight,
            cubeFrameThickness: cubeFrameThickness,
            cubeWidth: cubeWidth,
            cubeHeight: cubeHeight,
            introText: introText,
            introTextX: introTextX,
            introTextY: introTextY,
            introFontStyle: introFontStyle,
            introFontColor: introFontColor
        }
    }
}

function gameOver() {

    canvas.addEventListener(CLICK_DOWN_EVENT, backToIntro);
    var gameOverAnimationCallbackId = window.requestAnimationFrame(drawGameOver);

    function backToIntro() {
        canvas.removeEventListener(CLICK_DOWN_EVENT, backToIntro);
        playIntro();
    }

    function drawGameOver() {
        const config = getConfig();
        drawBackground(config);
        drawText(config);
        gameOverAnimationCallbackId = window.requestAnimationFrame(drawGameOver);
    }

    function drawText(config) {
        canvasContext.save();
        canvasContext.translate(config['textX'], config['textY']);
        canvasContext.font = config['font'];
        canvasContext.fillStyle = config['fontColor'];
        canvasContext.fillText(config['text'], 0, 0);
        canvasContext.restore();
    }

    function drawBackground(config) {
        canvasContext.save();
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0,0, config['width'], config['height']);
        canvasContext.restore();
    }

    function getConfig() {

        const width = window.innerWidth;
        const height = window.innerHeight;
        const fontSize = 80;
        const text = "GAME OVER";
        const textX = (width / 2) - (text.length * fontSize / 2)
        const textY = (height / 2) - (fontSize / 2)
        const font = fontSize.toString() + 'px "Press Start 2P"';
        const fontColor = 'white';

        return {
            width: width,
            height: height,
            text: text,
            textX: textX,
            textY: textY,
            font: font,
            fontColor: fontColor
        }
    }

}

function game(level) {

    var score = 0;
    var levelRequirement = 20;
    var remainingMoves = 10;
    var level = level;
    const gameCols = 10;
    const gameRows = 10;
    var cubeMatrix = CubeMatrix({'numRows': gameRows, 'numColumns': gameCols});
    var explosions = [];
    canvas.addEventListener(CLICK_DOWN_EVENT, onMouseDown);
    canvas.addEventListener(CLICK_UP_EVENT, onMouseUp);
    canvas.addEventListener(DRAG_EVENT, onMouseMove);

    var hasCube = false;
    var activeCube = null;
    var globalLockout = false;

    var animationCallbackId = window.requestAnimationFrame(draw);

    function onMouseDown(event) {
        if (! globalLockout) {
            grabCube(event);
        }
    }

    function onMouseUp(event) {
        if (! globalLockout) {
            if (hasCube) {
                releaseCube(event);
            }
        }
    }

    function onMouseMove(event) {
        if (! globalLockout) {
            if (hasCube) {
                moveCube(event);
            }
        }
    }

    function grabCube(event) {
        const cubePos = computeCubePosFromMousePos(event);
        const cubeRow = cubePos['row'];
        const cubeCol = cubePos['column'];
        if ((cubeRow >= 0) && (cubeRow < gameRows) && (cubeCol >= 0) && (cubeCol < gameCols)) {
            activeCube = cubeMatrix[cubeRow][cubeCol];
            activeCube.restX = event.clientX;
            activeCube.restY = event.clientY;
            activeCube.zlayer = zlayers[1];
            hasCube = true;
        }
    }

    function moveCube(event) {
        activeCube.displacementX = event.clientX - activeCube.restX;
        activeCube.displacementY = event.clientY - activeCube.restY;
        updateBoardDisplacement(event);
    }

    function updateBoardDisplacement(event) {
        const tempPos = computeCubePosFromMousePos(event);
        activeCube['tempRow'] = tempPos['row'];
        activeCube['tempColumn'] = tempPos['column'];
        displace(tempPos['row'], tempPos['column']);
    }

    function computeCubePosFromMousePos(event) {
        var config = getConfig();
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const gameX = mouseX - config['gameX'];
        const gameY = mouseY - config['gameY'];
        const cubeRow = Math.floor(gameY / config['cubeFrameHeight']);
        const cubeCol = Math.floor(gameX / config['cubeFrameWidth']);
        return {row: cubeRow, column: cubeCol};

    }

    function displace(tempCubeRow, tempCubeCol) {
        const config = getConfig();
        cubeMatrix.forEach((row) => (row.forEach((cube) => (tryDisplaceCube(cube, tempCubeRow, tempCubeCol, config)))));
    }

    function tryDisplaceCube(cube, tempCubeRow, tempCubeCol, config) {
        if ((cube.row === activeCube.row) && (cube.column === activeCube.column)) {
            return;
        } else if (cube.row === activeCube.row) {
            if ((tempCubeCol < 0) || (tempCubeCol >= gameCols)) {
                cube.displacementX = 0;
                cube.displacementY = 0;
            } else if ((cube.row === tempCubeRow) && (tempCubeCol <= cube.column) && (cube.column < activeCube.column)) {
                cube.displacementX = config['cubeFrameWidth'];
            } else if ((cube.row === tempCubeRow) && (tempCubeCol >= cube.column) && (cube.column > activeCube.column)) {
                cube.displacementX = config['cubeFrameWidth'] * -1;
            } else {
                cube.displacementX = 0;
                cube.displacementY = 0;
            }
        } else if (cube.column === activeCube.column) {
            if ((tempCubeRow < 0) || (tempCubeRow >= gameRows)) {
                cube.displacementX = 0;
                cube.displacementY = 0;
            } else if ((cube.column === tempCubeCol) && (tempCubeRow <= cube.row) && (cube.row < activeCube.row)) {
                cube.displacementY = config['cubeFrameHeight'];
            } else if ((cube.column === tempCubeCol) && (tempCubeRow >= cube.row) && (cube.row > activeCube.row)) {
                cube.displacementY = config['cubeFrameHeight'] * -1;
            } else {
                cube.displacementX = 0;
                cube.displacementY = 0;
            }
        }
    }

    function releaseCube(event) {
        var cubesBumped = bumpCubes(event);
        if (cubesBumped) {
            remainingMoves--;
        }
        activeCube = null;
        cubeMatrix.forEach((row) => (row.forEach(function (cube) {
            cube.displacementX = 0;
            cube.displacementY = 0;
            cube.zlayer = zlayers[0]
        })));
        hasCube = false;

        destroyCubesWithGlobalActionLockout(getConfig());
    }

    /**
     * We need to clean up some crap that's been hooked to the canvas before we can start a level cleanly
     */
    function cleanupLevelStateBeforeTransition() {
        window.cancelAnimationFrame(animationCallbackId);
        canvas.removeEventListener(CLICK_DOWN_EVENT, onMouseDown);
        canvas.removeEventListener(CLICK_UP_EVENT, onMouseUp);
        canvas.removeEventListener(DRAG_EVENT, onMouseMove);
    }

    function destroyCubesWithGlobalActionLockout(config)
    {
        if (! cubesAreFalling()) {
            var cubesDestroyed = destroyCubes(config);
            score += cubesDestroyed;
            var lockoutMillis = config['lockoutMillis'];
            if (cubesDestroyed > 0) {
                globalLock = true;
                setTimeout(function () {
                    destroyCubesWithGlobalActionLockout(config)
                }, config['fallingBackoffMillis']);
            } else if (score >= levelRequirement) {
                cleanupLevelStateBeforeTransition();
                game(level + 1);
            } else if (remainingMoves <= 0) {
                cleanupLevelStateBeforeTransition();
                gameOver();
            } else {
                globalLock = false;
            }
        } else {
            setTimeout(function () { destroyCubesWithGlobalActionLockout(config)}, config['fallingBackoffMillis']);
        }
    }

    function cubesAreFalling() {
        return cubeMatrix.map((row) => row.map((cube) => (cube['fallHeight'] > 0)).reduce((disjunction, bool) => (disjunction || bool)))
            .reduce((disjunction, bool) => (disjunction || bool));
    }


    function destroyCubes() {
        var curColor;
        var curColorStartIndex;
        for (var x = 0; x < gameRows; x++) {
            curColor = cubeMatrix[x][0]['color'];
            curColorStartIndex = 0;
            for (var y = 1; y < gameCols; y++) {
                if (cubeMatrix[x][y]['color'] !== curColor) {
                    if ((y - curColorStartIndex) >= 4) {
                        markForDestruction(x, x, curColorStartIndex, y - 1);
                    }
                    curColor = cubeMatrix[x][y]['color'];
                    curColorStartIndex = y;
                }
            }

            if ((y - curColorStartIndex) >= 4) {
                markForDestruction(x, x, curColorStartIndex, y - 1);
            }

        }

        for (var y = 0; y < gameCols; y++) {
            curColor = cubeMatrix[0][y]['color'];
            curColorStartIndex = 0;
            for (var x = 1; x < gameRows; x++) {
                if (cubeMatrix[x][y]['color'] !== curColor) {
                    if ((x - curColorStartIndex) >= 4) {
                        markForDestruction(curColorStartIndex, x - 1, y, y);
                    }
                    curColor = cubeMatrix[x][y]['color'];
                    curColorStartIndex = x;
                }
            }

            if ((x - curColorStartIndex) >= 4) {
                markForDestruction(curColorStartIndex, x - 1, y, y);
            }
        }

        var numDestroyed = doDestroy();
        return numDestroyed;

    }

    function doDestroy() {
        var numDestroyed = 0;
        for (var col = 0; col < gameCols; col++) {
            numDestroyed += destroyAndDrop(col);
        }

        return numDestroyed;
    }

    function destroyAndDrop(column) {
        const oldCol = cubeMatrix.map((r) => (r[column])).reduce((arr, val) => (arr.concat([val])), []);

        const cubesToKeep = oldCol.filter((cube) => (cube['toDestroy'] !== true));
        const cubesToDiscard = oldCol.filter((cube) => (cube['toDestroy'] === true));
        const newCubeCount = gameRows - cubesToKeep.length;
        const newCubes = (Array.from({length: newCubeCount}, (v, i) => i)).map((i) => Cube(i, column));
        const now = (new Date().getTime());
        newCubes.forEach(function (c) { c['fallStartMillis'] = now; c['fallHeight'] = newCubeCount});
        cubesToKeep.forEach(function (keep) {
            const displacement = cubesToDiscard.filter((discard) => (discard['row'] > keep['row'])).length;
            if (displacement > 0) {
                keep['fallStartMillis'] = now;
                keep['fallHeight'] = displacement;
            }
        });
        const newCol = newCubes.concat(cubesToKeep);
        for (var x = 0; x < gameRows; x++) {
            cubeMatrix[x][column] = newCol[x];
            cubeMatrix[x][column]['row'] = x;
        }
        return newCubeCount;
    }

    function markForDestruction(rowBegin, rowEnd, colBegin, colEnd) {
        for (var x = rowBegin; x <= rowEnd; x++) {
            for (var y = colBegin; y <= colEnd; y++) {
                cubeMatrix[x][y]['toDestroy'] = true;
                explosions.push(Explosion(x, y, cubeMatrix[x][y]['color']));
            }
        }
    }

    function bumpCubes(event) {
        const cubePos = computeCubePosFromMousePos(event);
        const newRow = cubePos['row'];
        const newCol = cubePos['column'];
        if ((newRow === activeCube['row']) && (newCol !== activeCube['column']) && (newCol >= 0) && (newCol < gameCols)) {
            bumpRow(cubePos);
            return true;
        } else if ((newCol === activeCube['column']) && (newRow !== activeCube['row'])) {
            bumpColumn(cubePos);
            return true;
        }
        return false;
    }

    function bumpRow(pos) {
        const rowIndex = pos['row'];
        const colIndex = pos['column'];
        const oldRow = cubeMatrix[rowIndex];
        var newRow;
        if (activeCube['column'] > colIndex) {
            newRow = oldRow.slice(0, colIndex).concat([activeCube]).concat(oldRow.slice(colIndex, activeCube['column'])).concat(oldRow.slice(activeCube['column'] + 1, gameCols));
        } else if (activeCube['column'] < colIndex) {
            newRow = oldRow.slice(0, activeCube['column']).concat(oldRow.slice(activeCube['column'] + 1, colIndex + 1)).concat([activeCube]).concat(oldRow.slice(colIndex + 1, gameCols));
        }
        (Array.from({length: gameCols}, (v, i) => i)).forEach((x) => newRow[x]['column'] = x);
        cubeMatrix[rowIndex] = newRow;
    }

    function bumpColumn(pos) {
        const rowIndex = pos['row'];
        const colIndex = pos['column'];
        const oldCol = cubeMatrix.map((row) => (row[colIndex])).reduce((arr, val) => (arr.concat([val])), []);
        var newCol;
        if (activeCube['row'] > rowIndex) {
            newCol = oldCol.slice(0, rowIndex).concat([activeCube]).concat(oldCol.slice(rowIndex, activeCube['row'])).concat(oldCol.slice(activeCube['row'] + 1, gameRows));
        } else if (activeCube['row'] < rowIndex) {
            newCol = oldCol.slice(0, activeCube['row']).concat(oldCol.slice(activeCube['row'] + 1, rowIndex + 1)).concat([activeCube]).concat(oldCol.slice(rowIndex + 1, gameRows));
        }
        (Array.from({length: gameRows}, ((v, i) => i))).forEach((x) => (cubeMatrix[x][colIndex] = newCol[x]));
        (Array.from({length: gameRows}, ((v, i) => i))).forEach((x) => (cubeMatrix[x][colIndex]['row'] = x));
    }

    function draw() {
        const config = getConfig();
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        drawBackground(config);
        drawInfoFrame(config);
        drawParticles(config);
        drawGame(config);
        window.requestAnimationFrame(draw);
    }

    function drawBackground(config) {
        canvasContext.save();
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, config['width'], config['height']);
        canvasContext.restore();
    }

    function drawInfoFrame(config) {
        canvasContext.save();
        canvasContext.font = config['font'];
        canvasContext.fillStyle = config['fontColor'];
        canvasContext.translate(config["infoX"], config["infoY"]);
        const text = "[Lvl] " + level + " [Scr] " + score.toString() + " / " + levelRequirement.toString() + " [Mvs] " + remainingMoves;
        canvasContext.fillText(text, 0, 50);
        canvasContext.restore();
    }

    function drawGame(config) {
        drawMatrix(config)
    }

    function drawParticles(config) {
        explosions.forEach((e) => (drawExplosion(e, config)));
        explosions = explosions.filter((e) => (stillExploding(e, config)));
    }

    function drawExplosion(explosion, config) {

        canvasContext.save();
        canvasContext.translate(config['gameX'], config['gameY']);
        canvasContext.translate((config['cubeFrameWidth'] * explosion['column']),
            config['cubeFrameHeight'] * explosion['row'])
        const explosionProgress = (new Date().getTime() - explosion['timeCreatedMillis']) / config['explosionDurationMillis'];
        const shrinkDisplacement = (config['cubeHeight'] / 2) * explosionProgress;
        const shrinkSize = ((config['cubeHeight'] / 2) - shrinkDisplacement) * 2;
        canvasContext.translate(shrinkDisplacement, shrinkDisplacement);
        const color = lighten(explosion['color'], -1 * (explosionProgress * .5));
        canvasContext.fillStyle = color;
        canvasContext.fillRect(0, 0, shrinkSize, shrinkSize);
        canvasContext.restore();
    }


    function stillExploding(explosion, config) {
        return ((new Date().getTime() - explosion['timeCreatedMillis']) < config['explosionDurationMillis']);
    }

    function drawMatrix(config) {
        cubeMatrix.forEach((row) => (row.forEach((cube) => (cleanupCube(cube, config)))));
        zlayers.forEach((z) => (cubeMatrix.forEach((row) => (row.forEach((cube) => (z === cube.zlayer ? drawCube(cube, config) : null))))));
    }

    function cleanupCube(cube, config) {
        if (cube['fallHeight'] > 0) {
            const elapsedMillis = (new Date().getTime() - cube['fallStartMillis']);
            if ((cube['fallHeight'] * config['cubeFrameHeight']) < (config['gravity'] * Math.pow(elapsedMillis, 2))) {
                cube['fallHeight'] = 0;
            }
        }
    }

    function drawCube(cube, config) {
        canvasContext.save();
        canvasContext.translate(config['gameX'], config['gameY']);
        canvasContext.beginPath();
        if ((activeCube === null) || (cube['id'] !== activeCube['id'] )) {
            canvasContext.rect(0, 0, config['gameWidth'], config['gameHeight']);
            canvasContext.clip();
        }

        canvasContext.translate(config['cubeFrameWidth'] * cube['column'], config['cubeFrameHeight'] * cube['row']);
        canvasContext.translate(config['cubeFrameThickness'], config['cubeFrameThickness']);
        canvasContext.translate(cube.displacementX, cube.displacementY);


        // displace cubes that are still "falling" upwards
        if (cube['fallHeight'] > 0) {
            const elapsedMillis = (new Date()).getTime() - cube['fallStartMillis'];
            const elapsedRatio = elapsedMillis / config['lockoutMillis'];
            const initialPos = cube['fallHeight'] * config['cubeFrameHeight'];
            const initialPosSqrt = Math.sqrt(initialPos);
            const fallDisplacement = Math.max(0, (initialPos - config['gravity'] * Math.pow(elapsedMillis, 2)));
            console.log(JSON.stringify({elapsed:elapsedMillis, elapsedRatio: elapsedRatio, fallDisplacement: fallDisplacement, initialPos: initialPos, initialPosSqrt: initialPosSqrt}))
            canvasContext.translate(0, -1 * fallDisplacement);
        }

        // floating cubes cast a shadow
        if (cube.zlayer === zlayers[1]) {
            canvasContext.save();
            canvasContext.translate(config['shadowX'], config['shadowY']);
            canvasContext.globalCompositeOperation = 'multiply';
            canvasContext.fillStyle = '#747474';
            canvasContext.fillRect(0, 0, config['cubeWidth'], config['cubeHeight']);
            canvasContext.restore();
        }

        // lighten any floating cubes
        canvasContext.fillStyle = ((cube.zlayer === zlayers[0]) ? cube.color : lighten(cube.color, .10));
        canvasContext.fillStyle = ((activeCube !== null) && ((cube['row'] === activeCube['tempRow'] ) || (cube['column'] === activeCube['tempColumn'])) ? lighten(canvasContext.fillStyle, .10): canvasContext.fillStyle);
        //canvasContext.fillStyle = ((depressCube) ? lighten(canvasContext.fillStyle, -.1) : canvasContext.fillStyle);

        canvasContext.beginPath();
        canvasContext.fillRect(0, 0, config['cubeWidth'], config['cubeHeight']);
        canvasContext.stroke();
        canvasContext.restore();
    }

    function lighten(color, percent) {
        const R = parseInt(color.substring(1, 3), 16);
        const G = parseInt(color.substring(3, 5), 16);
        const B = parseInt(color.substring(5, 7), 16);
        const RR = (R === 0 ? 0 : Math.floor(Math.min(R * (1 + percent), 255))).toString(16).substring(0, 2);
        const GG = (G === 0 ? 0 : Math.floor(Math.min(G * (1 + percent), 255))).toString(16).substring(0, 2);
        const BB = (B === 0 ? 0 : Math.floor(Math.min(B * (1 + percent), 255))).toString(16).substring(0, 2);
        return '#' + (RR.length === 1 ? '0' : '') + RR.toString(16)
            + (GG.length === 1 ? '0' : '') + GG.toString(16)
            + (BB.length === 1 ? '0' : '') + BB.toString(16);
    }

    function getConfig() {

        const width = window.innerWidth;
        const height = window.innerHeight;
        const gameFrameThickness = width / 100;
        const gameFrameHeight = (height / 3) * 2;
        const gameFrameWidth = gameFrameHeight * (gameCols / gameRows);
        const gameFrameX = (width / 2) - (gameFrameWidth / 2);
        const gameFrameY = (height / 2) - (gameFrameHeight / 2);
        const gameX = gameFrameX + gameFrameThickness;
        const gameY = gameFrameY + gameFrameThickness;
        const gameWidth = gameFrameWidth - (2 * gameFrameThickness);
        const gameHeight = gameFrameHeight - (2 * gameFrameThickness);
        const cubeFrameWidth = gameWidth / gameCols;
        const cubeFrameHeight = gameHeight / gameRows;
        const cubeFrameThickness = 3;
        const cubeWidth = cubeFrameWidth - (2 * cubeFrameThickness);
        const cubeHeight = cubeFrameHeight - (2 * cubeFrameThickness);
        const lockoutMillis = 1000;
        const explosionRadius = cubeHeight;
        const explosionSize = cubeWidth / 5;
        const explosionDurationMillis = lockoutMillis;
        const explosionParticles = 5;
        const shadowX = 5 * cubeFrameThickness;
        const shadowY = -5 * cubeFrameThickness;
        const fontSize = 20;
        const font = fontSize.toString() + 'px "Press Start 2P"';
        const infoX = gameFrameX;
        const infoY = gameFrameY + gameHeight + fontSize;

        return {
            width: width,
            height: height,
            gameFrameX: gameFrameX,
            gameFrameY: gameFrameY,
            gameFrameWidth: gameFrameWidth,
            gameFrameHeight: gameFrameHeight,
            gameFrameThickness: gameFrameThickness,
            gameX: gameX,
            gameY: gameY,
            gameWidth: gameWidth,
            gameHeight: gameHeight,
            infoX: infoX,
            infoY: infoY,
            cubeFrameWidth: cubeFrameWidth,
            cubeFrameHeight: cubeFrameHeight,
            cubeFrameThickness: cubeFrameThickness,
            cubeWidth: cubeWidth,
            cubeHeight: cubeHeight,
            shadowX: shadowX,
            shadowY: shadowY,
            explosionParticles: explosionParticles,
            explosionRadius: explosionRadius,
            explosionDurationMillis: explosionDurationMillis,
            explosionSize: explosionSize,
            lockoutMillis: lockoutMillis,
            fallingBackoffMillis: 1,
            font: font,
            fontColor: 'white',
            gravity: .00035
        }
    }



    function Explosion(row, column, color) {
        return {
            row: row,
            column: column,
            color: color,
            timeCreatedMillis: (new Date().getTime())
        }
    }
}

function CubeMatrix(config) {
    const width = config['numColumns'];
    const height = config['numRows'];
    const matrix = Array.from({length: height}, (v, i) => i)
        .map((row) => (Array.from({length: width}, (v, i) => i)).map((column) => Cube(row, column)));
    var [prunedMatrix, numPruned] = pruneMatrix(matrix);
    while (numPruned > 0) {
        [prunedMatrix, numPruned] = pruneMatrix(prunedMatrix);
    }

    const now = new Date().getTime();
    const colOffset =
    prunedMatrix.forEach(function (row) {
        rowOffset = Math.floor(Math.random() * 4);
        row.forEach((cube) => (cube.fallHeight = Math.floor(height + rowOffset)))
    });
    //prunedMatrix.forEach((row) => (row.forEach((cube) => (cube.fallHeight = height))));
    prunedMatrix.forEach((row) => (row.forEach((cube) => (cube.fallStartMillis = now))));

    return prunedMatrix;

    function pruneMatrix(m) {
        var curColor;
        var curColorStartIndex;
        for (var x = 0; x < height; x++) {
            curColor = m[x][0]['color'];
            curColorStartIndex = 0;
            for (var y = 1; y < width; y++) {
                if (m[x][y]['color'] !== curColor) {
                    if ((y - curColorStartIndex) >= 4) {
                        markForDestruction(m, x, x, curColorStartIndex, y - 1);
                    }
                    curColor = m[x][y]['color'];
                    curColorStartIndex = y;
                }
            }

            if ((y - curColorStartIndex) >= 4) {
                markForDestruction(m, x, x, curColorStartIndex, y - 1);
            }

        }

        for (var y = 0; y < width; y++) {
            curColor = m[0][y]['color'];
            curColorStartIndex = 0;
            for (var x = 1; x < height; x++) {
                if (m[x][y]['color'] !== curColor) {
                    if ((x - curColorStartIndex) >= 4) {
                        markForDestruction(m, curColorStartIndex, x - 1, y, y);
                    }
                    curColor = m[x][y]['color'];
                    curColorStartIndex = x;
                }
            }

            if ((x - curColorStartIndex) >= 4) {
                markForDestruction(m, curColorStartIndex, x - 1, y, y);
            }
        }

        var numDestroyed = doDestroy(m);
        return [m, numDestroyed];

    }

    function doDestroy(m) {
        var numDestroyed = 0;
        for (var col = 0; col < width; col++) {
            numDestroyed += destroyAndDrop(m, col);
        }

        return numDestroyed;
    }

    function destroyAndDrop(m, column) {
        const oldCol = m.map((r) => (r[column])).reduce((arr, val) => (arr.concat([val])), []);
        const cubesToKeep = oldCol.filter((cube) => (cube['toDestroy'] !== true));
        const newCubeCount = height - cubesToKeep.length;
        const newCubes = (Array.from({length: newCubeCount}, (v, i) => i)).map((i) => Cube(i, column));
        const newCol = newCubes.concat(cubesToKeep);
        for (var x = 0; x < height; x++) {
            m[x][column] = newCol[x];
            m[x][column]['row'] = x;
        }
        return newCubeCount;
    }

    function markForDestruction(m, rowBegin, rowEnd, colBegin, colEnd) {
        for (var x = rowBegin; x <= rowEnd; x++) {
            for (var y = colBegin; y <= colEnd; y++) {
                m[x][y]['toDestroy'] = true;
            }
        }
    }
}

function Cube(row, column) {
    return {
        row: row,
        column: column,
        color: ['#E00000', '#00E000', '#0000E0', '#E000E0'][Math.floor(Math.random() * 4)],
        //color: ['#827aad', '#ad7395', '#59ad97' ][Math.floor(Math.random() * 3)], //magic mirmaid
        //color: ['#d28a79', '#bba054', '#70503b', '#d2d0cd'][Math.floor(Math.random() * 4)], //cnoffnar

        displacementX: 0,
        displacementY: 0,
        restX: 0,
        restY: 0,
        zlayer: zlayers[0],
        id: UUID.next()
    }
}

function uuid() {
    var i = 0;

    function next() {
        return i++;
    }

    return {
        next: next
    }
}
