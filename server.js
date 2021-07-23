const {animals} = require('./data/animals.json'); //added data from the location into a variable 
const express = require('express'); //Initiated express - have to thing  
const PORT = process.env.PORT || 3001;
const app = express(); 

//Filtering Data based off the query. 
function filterByQuery(query, animalsArray){

    //We noticed that Personality Traits is in an array itself. To combact this query search; 
    let personalityTraitsArray = []; //An empty array
    let filteredResults = animalsArray;
    if (query.personalityTraits){
        //when query by traits, if it is a single trait, then search for that string but do include other personalities in of that animal in the array.  
        if (typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
        }
        //if multiple, then it will already be in an array by default. 
        else{
            personalityTraitsArray = query.personalityTraits; 
        }
        //Loop through each personality trait in the personalityTraitsArray using the forEach parameter: 
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

//Function for searching for animals by ID. We could do a query search but query is used when multiple parameters are being checked.  
function findById(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id) [0]; //takes ID and array of animals and returns a single animal object
    return result; 
}

//Adding route using GET; required 2 arguments: 1) The route client will have to fetch data from, 2) The call back function on that route 
app.get('/api/animals', (req, res) => {
    //Here all the animals data is loaded. 
    let results = animals; 
    //If the client has requested results by query, then filtered results will be displated based on the requested query(ies).
    if (req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//Finding animals by their ID. 
app.get('/api/animals/:id', (req, res) => {
    const results = findById(req.params.id, animals); //Param route must come after the other GET route. Param is used when we want to return a single property back to the user.
    //If ID is valid, we wil return the results. Otherwise we send the 404 error. Notice how we used send to return error as its a single message. 
    if (results){
        res.json(results);
    }
    else{
        res.send(404);
    }
    
})
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


