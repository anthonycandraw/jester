const traits = {
  userLevel: {
    "tied_to_customer": false,
    "Nomad": 0.0,
    "Member": 1.0,
    "Pro": 2.0,
    "Customer": 2.0
  },
  customerLevel: {
    "tied_to_customer": true,
    "Personal": 0.0,
    "BizLow": 1.5,
    "BizHigh": 3.0
  },
  experienceLevel: {
    "tied_to_customer": false,
    "Novice": 0.0,
    "Apprentice": 1.5,
    "Veteran": 3.0,
  },
  questionsAnswered: {
    "tied_to_customer": false,
    "No questions answered": 0.0,
    "A few questions answered": 2.0,
    "A lot of questions answered": 3.5,
    "A flood of questions answered": 4.0
  },
  lifetimeValue: {
    "tied_to_customer": true,
    "Low value": 0.0,
    "Med value": 2.0,
    "High value": 4.0,
    "Extremely high value": 8.0
  },
  // accountStanding: {
  //   "tied_to_customer": true,
  //   "Account in poor standing": 0.0,
  //   "Account in good standing": 3.0
  // }
}

const answerScores = {
  answers_counted: {
    "0–9 answers": 1.0,
    "10–49 answers": 2.0,
    "50–100 answers": 3.0
  },
  comments_counted: {
    "0-9 comments": 1.0,
    "10–49 comments": 2.0,
    "50–100 comments": 4.0
  },
  time_elapsed: {
    "Two months to infinity": 0.5,
    "One week to two months": 1.0,
    "2 days to one week": 2.0,
    "1 to 2 days": 3.0,
    "0–24 hours": 4.0
  },
  views_counted: {
    "0-9 views": 3.0,
    "10–49 views": 6.0,
    "50–100 views": 12.0,
    "100 to infinite views": 16.0
  },
  votes_counted: {
    "0-9 votes": 2.0,
    "10–49 votes": 4.0,
    "50–100 votes": 8.0
  },
}

const selectSystemArr = [['User traits', traits], ['Answer traits', answerScores]];

// Creates the UI select controls based on keys of traits Object.
// Selected options of the select controls will adjust the score.
function createSystemControls() {
  const selectSystem = document.createElement('select');

  selectSystem.setAttribute('class', 'jester__system__select');
  document.querySelector('.wrapper').appendChild(selectSystem);

  for (var selectSystemCount = 0; selectSystemCount < selectSystemArr.length; selectSystemCount++) {
    let selectSystemOption = document.createElement('option');
    selectSystemOption.innerHTML = selectSystemArr[selectSystemCount][0];
    selectSystem.appendChild(selectSystemOption);
  }

  changeSystem(selectSystemArr);
}

function changeSystem(arr) {
  const systemSelected = document.querySelector('.jester__system__select').value;

  for (let arrValue in arr) {
    if (systemSelected === arr[arrValue][0]) {
      createScoringControls(arr[arrValue][1]);
      scoring(arr[arrValue][1]);
    }
  }
}

function createScoringControls(system) {

  // Remove all select dropdown boxes in
  // the controls view.
  let controls = document.getElementById('controls');
  while (controls.firstChild) {
    controls.removeChild(controls.firstChild);
  }

  for (let key in system) {

    // Create an element based 
    // on keys of traits Object.
    let selectElement = document.createElement('select');

    // Apply class and IDs to elements created.
    selectElement.setAttribute('class', 'jester__controls__select');
    selectElement.setAttribute('id', key);

    // Append new element to the form.
    document.getElementById('controls').appendChild(selectElement);

    for (let i = 0; i < Object.keys(system[key]).length; i++) {

      // Create a option value from a nested key except
      // the 'tied_to_customer' nested key of each parent key.
      if (Object.keys(system[key])[i] != 'tied_to_customer') {
        let optionElement = document.createElement('option');
        let specTrait = Object.keys(system[key])[i];

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

  if (document.querySelector('.jester__system__select').value == 'User traits') {

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
}

// Generates a score based on which controls are enabled
// and the individual scores of selected options.
function scoring(system) {
  const background = document.querySelector('.jester__score__color');
  const scoreElement = document.querySelector('.jester__score__number');
  let sum = 0;
  let maxScore = 0;
  let systemArr = [];

  // Loop through traits for individual keys.
  for (let key in system) {

    // Disable any controls, if needed.
    controlDisable(key);

    let systemKey = Object.keys(system[key]);
    let systemValue = Object.values(system[key]);

    for (let systemKeyValue in systemKey) {

      // Add up scores of select boxes that are enabled and selected
      if (systemKey[systemKeyValue] === document.getElementById(key).value && !document.getElementById(key).disabled) {
        sum += systemValue[systemKeyValue];
      }
      else {
        sum += 0;
      }

      // Push values to an array BEFORE sorting an pulling max integer.
      if (Number.isInteger(systemValue[systemKeyValue])) {
        systemArr.push(Number(systemValue[systemKeyValue]));
      }
    }

    // Sort integers in the array by least to greatest
    systemArr.sort((a, b) => a - b);

    // Add the max integer from each select element
    // to the maximum score to determine the highest possible score.
    maxScore += Number(systemArr[systemArr.length - 1].toFixed(2));

    // Clear the array of values for the next loop,
    // so you don't run into double-adding max scores from previous keys.
    systemArr = [];
  }

  // Move the score progress bar
  // based on the summed scores.
  background.style.transform = 'translate3d(' + (-100 + (sum / maxScore * 100)) + '%, 0, 0)';

  // Updates the score string
  // and display as a percentage.
  scoreElement.innerHTML = ((sum / maxScore) * 100).toFixed(2) + '%';

}

// On load of the page, run 
// the contained function(s).
window.onload = function() {
  createSystemControls();

  document.querySelector('.jester__system__select').addEventListener('change', function() {
    changeSystem(selectSystemArr);
  });

  // Listen for changes to form and 
  // run the contained function(s).
  document.getElementById('controls').addEventListener('change', function() {
    if (document.querySelector('.jester__system__select').value === 'User traits') {
      scoring(traits);
    }
    else {
      scoring(answerScores);
    }
  });
}
