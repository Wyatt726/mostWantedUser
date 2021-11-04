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
      searchResults = searchbyMultipleTraits(people)
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
  }else{
    return mainMenu(foundPerson[0],people);
  }


}
function findDecendants(person,people){
  let listOfKids = [];
  let foundDecendant = people.filter(function(potentialMatch){
    if(potentialMatch.parents.includes(person.id)){
      return true;
    }else{
      return false;
    }
  })
  for(let i = 0; i < foundDecendant.length; i++){
    listOfKids.push(' ' + foundDecendant[i].firstName + ' ' + foundDecendant[i].lastName)
  }
  if(listOfKids.length === 0){
    alert('There was no descendants found for your person')
    mainMenu(person,people);
  }else{
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
      }else{
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
  }else{
    alert(`${listOfGrandkids} found as their grandkids`)
    return mainMenu(originalPerson,people)
  }
}
function findParents (person,people) {
  let listOfParents = [];
  let foundParents = people.filter(function(potentialMatch){
    if (potentialMatch.id === person.parents[0] || potentialMatch.id === person.parents[1]) {
      return true;
    } else {
      return false;
    }
  })
  for (let i = 0; i < foundParents.length; i++) {
    listOfParents.push(' ' + foundParents[i].firstName + ' ' + foundParents[i].lastName)
  }
  if (listOfParents.length === 0) {
    alert('There was no parents found for your person')
    return findSiblings(people, foundParents, person)
  } else {
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
      } else {
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
      } else {
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
    } else {
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
    alert('There was no siblings found for your person')
    return findSpouse(orignalPerson, people)
  } else {
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
  } else {
    alert (foundSpouse[0].firstName + ' ' + foundSpouse[0].lastName + ' is their spouse')
    return mainMenu(person, people)
  }
}
// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}






//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByEyeColor(people){

}

//TODO: add other trait filter functions here.



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

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display.
  alert(personInfo);
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
  let isValid;
  do{
    var response = prompt(question).trim();
    isValid = valid(response);
  } while(response === ""  ||  isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input){
  
}

//#endregion
