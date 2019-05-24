const traits = {
  userLevel: {
    'tied_to_customer': false,
    'Nomad': 0.0,
    'Member': 1.0,
    'Pro': 2.0,
    'Customer': 2.0
  },
  customerLevel: {
    'tied_to_customer': true,
    'Personal': 0.0,
    'BizLow': 1.5,
    'BizHigh': 3.0
  },
  experienceLevel: {
    'tied_to_customer': false,
    'Novice': 0.0,
    'Apprentice': 1.5,
    'Veteran': 3.0,
  },
  questionsAnswered: {
    'tied_to_customer': false,
    'No questions answered': 0.0,
    'A few questions answered': 2.0,
    'A lot of questions answered': 3.5,
    'A flood of questions answered': 4.0
  },
  lifetimeValue: {
    'tied_to_customer': true,
    'Low value': 0.0,
    'Med value': 2.0,
    'High value': 4.0,
    'Extremely high value': 8.0
  },
  // accountStanding: {
  //   'tied_to_customer': true,
  //   'Account in poor standing': 0.0,
  //   'Account in good standing': 3.0
  // }
}

// Creates the UI select controls based on keys of traits Object.
// Selected options of the select controls will adjust the score.
function createControls() {

  // Loop through keys of traits Object.
  for (let trait in traits) {

    // Create an element based 
    // on keys of traits Object.
    let selectElement = document.createElement('select');

    // Apply class and IDs to elements created.
    selectElement.setAttribute('class', 'jester__controls__select');
    selectElement.setAttribute('id', trait);

    // Append new element to the form.
    document.getElementById('controls').appendChild(selectElement);

    for (let i = 0; i < Object.keys(traits[trait]).length; i++) {

      // Create a option value from a nested key except
      // the 'tied_to_customer' nested key of each parent key.
      if (Object.keys(traits[trait])[i] != 'tied_to_customer') {
        let optionElement = document.createElement('option');
        let specTrait = Object.keys(traits[trait])[i];

        optionElement.setAttribute('value', specTrait);
        optionElement.innerHTML = specTrait;
        selectElement.appendChild(optionElement);
      } 
    }
  }
}

// Disable specific controls based
// on criteria determined below.
function controlDisable(controlName) {

  if (controlName != 'userLevel' && document.getElementById('userLevel').value == 'Nomad') {
    document.getElementById(controlName).disabled = true;
  }
  else if (traits[controlName].tied_to_customer == true && document.getElementById('userLevel').value == 'Customer') {
    document.getElementById(controlName).disabled = false;
  }
  else if (traits[controlName].tied_to_customer == true && document.getElementById('userLevel').value != 'Customer') {
    document.getElementById(controlName).disabled = true;
  }
  else {
    document.getElementById(controlName).disabled = false;
  }
}

// Function for finding the maximum score
// for each nested key.
function findMaxTraitScore(maxScore) {
  for (let trait in traits) {
    let traitLength = Object.keys(traits[trait]).length;
    let traitScoreArr = [];

    for (var traitValue = 0; traitValue < traitLength; traitValue++) {
      if (Number.isInteger(Object.values(traits[trait])[traitValue])) {
        traitScoreArr.push(Number(Object.values(traits[trait])[traitValue]));
      }
    }

    traitScoreArr.sort();
    maxScore += Number(traitScoreArr[traitScoreArr.length - 1].toFixed(2));

  }

  return maxScore;

}

// Calculates the total sum
// of all scores.
function scoreUpdate(score) {
  const background = document.querySelector('.jester__score__color');
  const scoreElement = document.querySelector('.jester__score__number');

  // Create max score.
  let maxScore = 0;
  maxScore = findMaxTraitScore(maxScore);

  // Move the score progress bar
  // based on the summed scores.
  background.style.transform = 'translate3d(' + (-100 + (score / maxScore * 100)) + '%, 0, 0)';

  // Updates the score string
  // and display as a percentage.
  scoreElement.innerHTML = ((score / maxScore) * 100).toFixed(2) + '%';
}

// Generates a score based on which controls are enabled
// and the individual scores of selected options.
function scoring() {
  let sum = 0;

  // Loop through traits for individual keys.
  for (let trait in traits) {

    controlDisable(trait);

    // Loop through keys for nested keys.
    for (let i = 0; i < Object.keys(traits[trait]).length; i++) {

      // If: the nested key is equal to the current value of the dropdown.
      if (Object.keys(traits[trait])[i] === document.getElementById(trait).value) {

        // If: the dropdown meny is disabled.
        if (document.getElementById(trait).disabled == true) {
          // Add zero to the total sum
          // if the dropdown value is disabled.
          sum += 0;
        }
        else {
          // Add the score of the enabled
          // dropdown to the total sum.
          sum += Object.values(traits[trait])[i];
        }
      }
    }
  }

  // Run scoreUpdate function, 
  // pass through the total sum.
  scoreUpdate(sum);

}

// Listen for changes to form and 
// run the contained function(s).
document.getElementById('controls').addEventListener('change', function() {
  scoring();
});

// On load of the page, run 
// the contained function(s).
window.onload = function() {
  createControls();
  scoring();
}
