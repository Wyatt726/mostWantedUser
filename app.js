"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByTraits(people)
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }
  
  let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

  switch(displayOption){
    case "info":
      // this will pass a single person in and the function will display all the info about the individual to the user with an alert or prompt
    displayPerson(person,people);
    break;
    case "family":
    findParents(person,people)
    break;
    case "descendants":
    findDecendants(person, people)
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", autoValid);
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  let lastName = promptFor("What is the person's last name?", autoValid);
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName === firstName && potentialMatch.lastName === lastName){
      return true;
    }
      else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.


  if(foundPerson.length == 0){
    return false
  }
    else{
    return mainMenu(foundPerson[0],people);
  }


}
function findDecendants(person,people){
  let listOfKids = [];
  let foundDecendant = people.filter(function(potentialMatch){
    if(potentialMatch.parents.includes(person.id)){
      return true;
    }
      else{
      return false;
    }
  })
  for(let i = 0; i < foundDecendant.length; i++){
    listOfKids.push(' ' + foundDecendant[i].firstName + ' ' + foundDecendant[i].lastName)
  }
  if(listOfKids.length === 0){
    alert('There was no descendants found for this individual')
    mainMenu(person,people);
  }
    else{
    alert(`${listOfKids} found as their descendant`)
    return findGrandkids(people,foundDecendant,person)
  }
}
function findGrandkids(people,person,originalPerson){
  let listOfGrandkids = []
  for(let i = 0; i < person.length; i++){
    let foundGrandKids = people.filter(function(potentialMatch){
      if(potentialMatch.parents.includes(person[i].id)){
        return true;
      }
        else{
        return false;
      }
    })
    for(let j = 0; j < foundGrandKids.length; j++){
      listOfGrandkids.push(' ' + foundGrandKids[j].firstName + ' ' + foundGrandKids[j].lastName)
    }
  }
  if(listOfGrandkids.length === 0){
    alert('No grandkids were found')
    mainMenu(originalPerson,people)
  }
    else{
    alert(`${listOfGrandkids} found as their grandkids`)
    return mainMenu(originalPerson,people)
  }
}
function findParents (person,people) {
  let listOfParents = [];
  let foundParents = people.filter(function(potentialMatch){
    if (potentialMatch.id === person.parents[0] || potentialMatch.id === person.parents[1]) {
      return true;
    } 
      else {
      return false;
    }
  })
  for (let i = 0; i < foundParents.length; i++) {
    listOfParents.push(' ' + foundParents[i].firstName + ' ' + foundParents[i].lastName)
  }
  if (listOfParents.length === 0) {
    alert('There was no parents found for your person')
    return findSiblings(people, foundParents, person)
  } 
    else {
    alert (`${listOfParents} found as their parents`)
    return findSiblings(people, foundParents, person)
  }
}

function findSiblings (people, foundParents, orignalPerson) {
  let listOfSiblings = [];
  if (foundParents.length === 0) {
    let foundSiblings = people.filter(function(potentialMatch) {
      if (potentialMatch.lastName === orignalPerson.lastName && potentialMatch.parents[0] === undefined && potentialMatch.currentSpouse !== orignalPerson.id) {
        return true;
      } 
        else {
        return false;
      }
    })
    for (let i = 0; i < foundSiblings.length; i++) {
      if (foundSiblings[i].id !== orignalPerson.id) {
      listOfSiblings.push(' ' + foundSiblings[i].firstName + ' ' + foundSiblings[i].lastName)
      }
    }
  }
  if (foundParents.length === 1) {
    let foundSiblings = people.filter(function(potentialMatch){
      if (potentialMatch.parents[0] === foundParents[0].id || potentialMatch.parents[1] === foundParents[0].id) {
        return true;
      } 
        else {
        return false;
      }
    })
    for (let i = 0; i < foundSiblings.length; i++) {
      if (foundSiblings[i].id !== orignalPerson.id) {
      listOfSiblings.push(' ' + foundSiblings[i].firstName + ' ' + foundSiblings[i].lastName)
      }
    }
  } 
  if (foundParents.length === 2) {
  let foundSiblings = people.filter(function(potentialMatch) {
    if (potentialMatch.parents[0] === foundParents[0].id || potentialMatch.parents[0] === foundParents[1].id || potentialMatch.parents[1] === foundParents[0].id || potentialMatch.parents[1] === foundParents[1].id) {
      return true;
    } 
      else {
      return false;
    }
  })
  for (let i = 0; i < foundSiblings.length; i++) {
    if (foundSiblings[i].id !== orignalPerson.id) {
    listOfSiblings.push(' ' + foundSiblings[i].firstName + ' ' + foundSiblings[i].lastName)
    }
  }
}
  
  if (listOfSiblings.length === 0) {
    alert('There were no siblings found for this individual')
    return findSpouse(orignalPerson, people)
  } 
    else {
    alert(`${listOfSiblings} are their siblings`)
    return findSpouse(orignalPerson, people, )
  }
}

function findSpouse (person, people) {
  let foundSpouse = people.filter(function(potentialMatch){
    if (potentialMatch.currentSpouse === person.id) {
      return true;
    } else {
      return false;
    }
  })
  if (foundSpouse[0] == null || foundSpouse === undefined) {
    alert('They have no spouse')
    return mainMenu(person, people)
  } 
    else {
    alert (foundSpouse[0].firstName + ' ' + foundSpouse[0].lastName + ' is their spouse')
    return mainMenu(person, people)
  }
}


//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByEyeColor(people){
  let eyeColor = promptFor("What is the individuals eye color?", autoValid);
  let foundPerson;

  let foundEyeColor = people.filter(function(potentialMatch) {
    if(potentialMatch.eyeColor === eyeColor){
      return true;
    }
    else{
      return false;
    }
  })
  foundPerson = customValidation(foundEyeColor);
  return foundPerson;
}
function searchByGender(people){
  let gender = promptFor("Please enter the individuals gender below", autoValid);
  let foundPerson;

  let foundGender = people.filter(function(potentialMatch) {
    if(potentialMatch.gender === gender){
      return true;
    }
    else{
      return false;
    }
  })
  foundPerson = customValidation(foundGender);
  return foundPerson;
}

function searchByOccupation(people){
  let occupation = promptFor("Please enter the individuals occupation below", autoValid);
  let foundPerson;

  let foundOccupation = people.filter(function(potentialMatch) {
    if(potentialMatch.occupation === occupation){
      return true;
    }
    else{
      return false;
    }
  })
  foundPerson = customValidation(foundOccupation);
  return foundPerson;
}
function searchByHeight(people){
  let height = promptFor("If you know this person's height, please enter it below.", autoValid);
  let foundPerson;

  let foundHeight = people.filter(function(potentialMatch){
    if(potentialMatch.height == parseInt(height)){
        return true;
    }
    else{
      return false;
    }
  })
  foundPerson = customValidation(foundHeight);
  return foundPerson;
}

function searchByWeight(people){
  let weight = promptFor("If you know the person's weight, please enter it below.", autoValid);
  let foundPerson;

  let foundWeight = people.filter(function(potentialMatch){
    if(potentialMatch.weight === parseInt(weight)){
      return true;
    }
    else{
      return false;
    }
  })
  foundPerson = customValidation(foundWeight);
  return foundPerson;
}

function searchByDOB(people){
  let dob = promptFor("If you know the person's date of birth (DOB), please enter it below in DD/MM/YYYY format.", autoValid);
  let foundPerson;

  let foundDOB = people.filter(function(potentialMatch){
    if(potentialMatch.dob === dob){
      return true;
    }
    else{
      return false;
    }
  })
  foundPerson = customValidation(foundDOB);
  return foundPerson;
}

function searchByID(people){
  let id = promptFor("If you know the person's ID, please enter it below.", autoValid);
  let personFound;

  let foundID = people.filter(function(potentialMatch) {
    if(potentialMatch.id === parseInt(id)){
      return true;
    }
    else{
      return false;
    }
  })
  personFound = customValidation(foundID);
  return personFound;
}

//TODO: add other trait filter functions here.
//adding in multi critea search
function searchByTraits(people){
  let searchType = promptFor("What trait would you like to search by? Enter: 'eye color', 'DOB', 'gender', 'weight', 'height', 'ID' or 'occupation'", autoValid);
  let searchResults;
  switch(searchType){
    case 'eye color':
      searchResults = searchByEyeColor(people);
      break;
    case 'DOB':
      searchResults = searchByDOB(people);
      break;
    case 'gender':
      searchResults = searchByGender(people);
      break;
    case 'weight':
      searchResults = searchByWeight(people);
      break;
    case 'height':
      searchResults = searchByHeight(people);
      break;
    case 'occupation':
      searchResults = searchByOccupation(people);
      break;
    case 'ID':
      searchResults = searchByID(people);
      break;
    default:
      app(people);
      break;
  }

  mainMenu(searchResults, people);
}



//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 


// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person, people){
  let personInfo = "FirstName:" + person.firstName + "\n";
  personInfo += "LastName: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "Date Of Birth: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n"
  alert(personInfo);
  return mainMenu(person,people)
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  let response;
  let isValid;
  do{ 
    response = prompt(question).trim();
    isValid = valid(response);
  } 
  while(response === ""  ||  isValid === false)
  return response
}

function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

function autoValid(input){
  return true; 
}

function customValidation(input){
  let foundPerson;
  let answer;
  for(let i = 0; i < input.length; i++){
    answer = promptFor("Is " + input[i].firstName + " " + input[i].lastName + " the person you are looking for? Type 'yes' or 'no' below.", yesNo);
    if(answer == "yes"){
      foundPerson = input[i];
      break;
    }else{
      foundPerson;
    }
  }
  return foundPerson;
}


//#endregion
