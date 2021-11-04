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
  return foundPerson[0]
}
  // TODO: find the person single person object using the name they entered.

function findDecendants(person, people){
  let listChildren = [];
  let foundDecendant = people.filter(function(potentialMatch){
    if(potentialMatch.parents.includes(person.id)){
      return true;
  }else{
      return false;
    }
})

for( let i = 0; i <foundDecendant.length; i++){
  listChildren.push('' + foundDecendant[i].firstName + '' + foundDecendant[i].lastName)
}
if(listChildren.length === 0){
  alert('no decendants found on search')
  mainMenu(person, people);
}
else
{
  alert('${listChildren}) is their decendant')
  return findGrandchildren(people, foundDecendant, person)
}

function findGrandchildren(people, person, originalPerson){
  let listGrandChildren = []
  for (let i = 0; i < person.length; i++){
    let foundGrandChildren = people.filter(function(potentialMatch){
      if(potentialMatch.parents.includes(person[i].id)){
        return true;
      }
      else {
        return false;
      }
    })
    for(let b = 0; n< foundGrandChildren.length; b++){
      listGrandChildren.push('' + foundGrandChildren[b]. firstName + '' + foundGrandChildren[b].lastName)
    }
  }
if(listGrandChildren.length === 0){
  alert('we couldnt find your grandchildren')
  mainMenu(originalPerson, people)
}
  else {
  alert('${listOfGrandChildren} are the grandchildren')
  return mainMenu(originalPerson, people)
}
function findParents(person, people){
  let listOfParents = [];
  let foundParents = people.filter(function(potentialMatch){
    if (potentialMatch.id === person.parents[0] || potentialMatch.id === personalbar.parents[1]) {
      return true;
    }
    else {
      return false;
    }
  })
}
for (let i = 0; i < foundParents.length; i++){
  listOfParents.push('' + foundParents[i].firstName + '' + foundParents[i].lastName)
}
if (listOfParents.length === 0){
  alert('There was no parents found in your search')
  return findSiblings(people, foundParents, person)
}
else{
  alert('${listOfParents} found as their parents')
  return findSiblings(people, foundParents, person)
    }
  }



//removing curly brace line 145, and bracket from 144, then placing curly brace in 159 activates
//listOfParents and foundParents but sets an error on for loop line 146. Why? Let's fix tomorrow.
//as these are showing undefined. Tried to troubleshoot -Michael GT



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
