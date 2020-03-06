// Create a global setup object
window.setup = window.setup || {};

setup.createChatArea = function(choices) {
  return '<img class="center" src="'+ setup.image.src + '">' +
  '<div id="chat-area">' +
  '<div id="typewriter"></div>' +
  '<a id="continue" href="javascript:void(0)" onclick="setup.typewriter.clearAndWrite();">Continue</a>' +
  choices +
  '</div>';
}

// Add a 'typewriter' object
setup.typewriter = {};

// Save an index of the string.
// Start at -1 because it will be increased once (to 0)
// before the first chracter is shown.
setup.typewriter.textIndex = -1;

// Which line we are currently at
setup.typewriter.lineIndex = 0;

// Allow users to set global array of lines to say before showing choices
setup.typewriter.lines = [];
setup.typewriter.currentText = null;

// Save a reference to the setTimeout call
setup.typewriter.timerReference = 0;

setup.typewriter.clearAndWrite = function() {
  $("#typewriter").html("");
	var continueButton = $("#continue");
	if (continueButton !== undefined) {
    continueButton.css('visibility', 'hidden');
	}
	setup.typewriter.writeChar();
}

setup.typewriter.write = function(lines) {
  setup.typewriter.lines = lines;
  setup.typewriter.writeChar();
}

// Write text character by character to an element with the ID "typewriter"
setup.typewriter.writeChar = function() {
  // Test if the index is less than the text length
	if (setup.typewriter.currentText == null) {
		setup.typewriter.currentText = setup.typewriter.lines[setup.typewriter.lineIndex];
	}
	var currentText = setup.typewriter.currentText;
	var currentIndex = setup.typewriter.textIndex;
  if (currentIndex < currentText.length) {
    // Update the current text character-by-character
	  var currentChar = currentText[currentIndex];
    $("#typewriter").html($("#typewriter").html() + currentChar);
		// Play the sound
		if (currentChar !== ' ' && currentIndex % 2 == 0) {
			var el = document.createElement('audio');
			el.src = setup.typewriter.src;
		  el.play();
		}
    // Increase the index
    setup.typewriter.textIndex++;
    // Save the timeout reference
    setup.typewriter.timerReference = setTimeout(setup.typewriter.writeChar, 30);
  } else {
    // Clear out the timeout once index is greater than string length
    clearTimeout(setup.typewriter.timerReference);
		// Increment line if possible, or show choices
		setup.typewriter.lineIndex++;
		setup.typewriter.currentText = null;
		if (setup.typewriter.lineIndex >= setup.typewriter.lines.length) {
			// No more lines, back to beginning
			setup.typewriter.lineIndex = 0;
			// Reset text index
			setup.typewriter.textIndex = -1;
			// Update buttons
			var choices = $("a[data-passage]");
	    if (choices !== undefined) {
			  choices.css('visibility', 'visible');
		  }
			var continueButton = $("#continue");
	    if (continueButton !== undefined) {
			  continueButton.hide();
	    }
		} else {
			// Reset the index
      setup.typewriter.textIndex = 0;
		  var continueButton = $("#continue");
			if (continueButton !== undefined) {
			  continueButton.css('visibility', 'visible');
			}
		}
  }
}

setup.image = {};
setup.image.src = "twinemedia/img/Black.png";

setup.music = {};
setup.music.element = document.createElement('audio');
setup.music.element.volume = 0.1;

setup.music.fadeIn = function() {
	var el = setup.music.element;
  el.loop = true;
  el.volume = 0.1;
  el.play();
  var volume = 1;

  var fadeAudio = setInterval(function () {
    // Only fade if past the fade out point or not at zero already
    console.log(volume);
    if (volume < 10) {
      el.volume = volume / 10.0;
    } else {
      // When volume at zero stop all the intervalling
      clearInterval(fadeAudio);
    }
    volume += 1;
  }, 20);
}

setup.music.play = function(src) {
	var el = setup.music.element;
	el.src = src;
  setup.music.stop(setup.music.fadeIn);
}

setup.music.stop = function(callback) {
  var el = setup.music.element;

  // Set the point in playback that fadeout begins. This is for a 2 second fade out.
  var fadePoint = el.duration - 2;
  var volume = parseInt(el.volume * 10.0);
  console.log(volume);

  var fadeAudio = setInterval(function () {
    if (volume > 0) {
      el.volume = volume / 10.0;
    } else {
      clearInterval(fadeAudio);
      el.pause();
      if (callback !== undefined) {
        callback();
      }
    }
    volume -= 1;
  }, 20);
}
