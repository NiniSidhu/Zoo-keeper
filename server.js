const { animals } = require('../Zoo-keeper/data/animals.json'); //added data from the location into a variable 
const express = require('express'); //Initiated express - have to thing  
const app = express(); 
const PORT = process.env.PORT || 3001;
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
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


