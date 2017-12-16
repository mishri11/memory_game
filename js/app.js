//Create a list of 16 cards
  let cards = ['&spades;', '&spades;', '&clubs;', '&clubs;', '&hearts;', '&hearts;', '&diams;', '&diams;', '&#9728;', '&#9728;', '&#9729;', '&#9729;', ' &#9731;', ' &#9731;', '&#9730;', '&#9730;'];

  //Be able to shuffle that list
  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }

      return array;
  }

  // Display the list: loop through each card and create its HTML, and add the HTML to the page
    cards = shuffle(cards);
    let openArray = [];
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
    let playTable = $('table');
    playTable.html(tableHTML);

    /* Keep track of:
      Moves - number of clicks/card flips
      Matches - number of matched pairs so far
    */
    let moves = 0;
    let matches = 0;

    // set event listener on click for table
      /* When you click on a card:
          1. Add 1 to moves and update moves display
          2. Display its symbol
          3. Add it to a list of open cards
          4. If the list of open cards is not empty, check if the new card matches any of them.
            If cards match, lock the cards in open position. Matches++
            If cards do not match, remove them from the list of open cards and flip them over (no longer display their symbol).
          5. If matches===8 then display win message.
      */
    playTable.on('click', 'td', function(e) {
      e.preventDefault();
      moves++;
      $('#moveCount').html(`Moves: ${moves}`);
      updateStars(moves);
      $(this).toggleClass('closed');
      openArray.push($(e.target));
      openArray = newCardAdded(openArray);
      if (matches===8) {
        // Display congrats modal
        displayWinModal(moves);
      }
    });

    function displayWinModal(moves) {
      $winModal = $('#winModal')
      $('.modalContent').prepend(`<p>Congratulations! You won in ${moves} moves!</p>`);
      $winModal.css('display', 'block');
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


  // add restart button that starts a new game
