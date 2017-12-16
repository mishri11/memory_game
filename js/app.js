//Create a list of 16 cards
const cards = ['&spades;', '&spades;', '&clubs;', '&clubs;', '&hearts;', '&hearts;', '&diams;', '&diams;', '&#9728;', '&#9728;', '&#9729;', '&#9729;', ' &#9731;', ' &#9731;', '&#9730;', '&#9730;'];

/* Keep track of:
  Moves - number of clicks/card flips
  Matches - number of matched pairs so far
  Elapsed time - time since you first click on the board
  OpenArray - array containing cards that are currently open on the board
*/
let moves = 0;
let matches = 0;
let elapsedMins = 0;
let elapsedSecs = 0;
let timerVar;
let openArray = [];
let playTable = $('table');


// Shuffle and display the cards: loop through each card and create its HTML, and add the HTML to the page
drawBoard(shuffle(cards));


// set event listener on click for table (use event delegation so not adding a listener to every single card)
  /* When you click on a card:
      1. Add 1 to moves and update moves and stars displays
      2. Display its symbol
      3. Add it to a list of open cards
      4. If the list of open cards is not empty, check if the new card matches any of them.
        If cards match, lock the cards in open position. Matches++
        If cards do not match, remove them from the list of open cards and flip them over (no longer display their symbol).
      5. If matches===8 then display win modal
  */
playTable.on('click', 'td', function(e) {
  moves++;
  updateMoves(moves);
  updateStars(moves);
  $(this).toggleClass('closed');
  openArray.push($(e.target));
  openArray = newCardAdded(openArray);
  if (matches===8) {
    // Display congrats modal
    displayWinModal(moves, elapsedMins, elapsedSecs);
    clearInterval(timerVar);
  }
});



// Reset the game when you click on Start Over or Play Again buttons
$('.resetGame').click(function() {
  resetGame();
});

// To reset the game, reset moves,matches,openArray and update the display
function resetGame() {
  $('#winModal').css('display', 'none');
  $('p').remove();
  moves = 0;
  matches = 0;
  elapsedMins = 0;
  elapsedSecs = 0;
  updateTime(elapsedMins, elapsedSecs);
  clearInterval(timerVar);
  openArray = [];
  updateMoves(moves);
  updateStars(moves);
  drawBoard(shuffle(cards));
}

// Loop through the cards array and add each card to the HTML table element
function drawBoard(cards) {
  let tableHTML = '';
  let arrInd = 0;
  for (let row=1; row<=4; row++) {
    tableHTML += '<tr>';
    for (let col=1; col<=4; col++) {
      tableHTML += `<td class="closed">${cards[arrInd]}</td>`;
      arrInd++;
    }
    tableHTML += '</tr>';
  }
  playTable.html(tableHTML);

  // Event listener for just the first click event - to start the timer
  playTable.one('click', 'td', function(e) {
    timerVar = setInterval(function() {
      elapsedSecs++; // increment elapsedSecs by one second
      if (elapsedSecs===60) {
        elapsedMins++;
        elapsedSecs = 0;
      }
      // update display of time
      updateTime(elapsedMins, elapsedSecs);
    }, 1000);
  })
}

//Be able to shuffle that list
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayWinModal(moves, elapsedMins, elapsedSecs) {
  $winModal = $('#winModal')
  $('.modalContent').prepend(`<p>You won!<hr>It took you...<br> ${moves} moves<br>${elapsedMins} Minutes, ${elapsedSecs} Seconds<hr>Your ${$('#starRating').html()}</p>`);
  $winModal.css('display', 'block');
}

// Update moves display based on current number of moves
function updateMoves(moves) {
  $('#moveCount').html(`Moves: ${moves}`);
}


// Update star rating based on number of moves
function updateStars(moves) {
  let $starRating = $('#starRating');
  if (moves>=35 && moves<=45) { // if more than 35 moves, downgrade to 2 star rating
    $starRating.html('Star Rating: <span class="stars">&#9733; &#9733;</span>');
  } else if (moves>=45) { // if more than 45 moves, downgrade to 1 star rating
    $starRating.html('Star Rating: <span class="stars">&#9733;</span>');
  }
}

let $mins = $('.minutes');
let $secs = $('.seconds');
// Update timer display
function updateTime(elapsedMins, elapsedSecs) {
  if (elapsedMins<10) {
    $mins.text('0' + elapsedMins);
  } else {
    $mins.text(elapsedMins);
  }
  if (elapsedSecs<10) {
    $secs.text('0' + elapsedSecs);
  } else {
    $secs.text(elapsedSecs);
  }
}

function newCardAdded(openArray) {
  if (openArray.length==2) {
    if (openArray[0].text()===openArray[1].text()) {
      // if match, then just remove from openArray and do nothing (keep them open)
      matches++;
    } else {
      setTimeout(function (openArray) {
        openArray[0].toggleClass('closed');
        openArray[1].toggleClass('closed');
      }, 500, openArray);
    }
    openArray = [];
  }
  return openArray;
}
