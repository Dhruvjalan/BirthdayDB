// import fs from 'fs';

// fs.appendFile('./Bday_List.txt',)

// fs.readFile('./Bday_List.txt','utf8',(err,data)=>{
//     if (err){
//         console.log("Error Reading the File: "+err);
//         return;
//     }
//     const matches = data.match(/\{.*?\}/g)
//     const objectsArray = matches.map((item) => JSON.parse(item));
//     console.log(objectsArray);
// })

// data = {'4':''}
// const firstProperty = Object.keys(data)[0];
// console.log(firstProperty);

var isDate = (date)=>{
    return (date[2] === date[5] && date[5] === '-'
    && date.length === 10 
    && !isNaN(Date.parse(date)))

} 

console.log(isDate("29-02-2006"))

