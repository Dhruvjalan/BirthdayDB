import bodyParser from "body-parser";
import fs from "fs";

var isSearch = 0
const SearchAddress = './Bday_Search.txt';
const AddAddress = './Bday_List.txt';
var address = AddAddress
var urlencodedParser = bodyParser.urlencoded({extended: false});


var isDate = (date)=>{
    return (date[2] === date[5] && date[5] === '-'
    && date.length === 10 
    && !isNaN(Date.parse(date)))

} 

var closestDate = (bdayArray, date)=>{
    var name
    let closest = null;
    let minDiff = Infinity;

    bdayArray.forEach((item) => {
        const itemDate = new Date(item.dob);
        const targetDate = new Date(date);
        const itemDateWithoutYear = new Date(targetDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        const diff = Math.abs(itemDateWithoutYear - targetDate);

        if (diff < minDiff) {
            minDiff = diff;
            closest = item;
        }
    });
    if(closest !== null)
        return closest;
    
    return bdayArray[0]

}
// reads all the data in file and returns it as an array of objects

var read_File = (address, callback) => {
    fs.readFile(address, 'utf8', (err, data) => {
        if (err) {
            console.log("Error Reading the File: " + err);
            callback(err, null);
            return;
        }

        let objectsArray = [];
        if (data) {
            const matches = data.match(/\{.*?\}/g);
            objectsArray = matches ? matches.map((item) => JSON.parse(item)) : [];
        }
        callback(null, objectsArray);
    });
}

var append_File= (address, obj)=>{
    fs.appendFile(address,JSON.stringify(obj),(err) => {
        if (err) {
          console.error('Error appending to file:', err);
        }
      });
}


var write_File = (address, objectsArray)=>{
    fs.writeFileSync(address, '');
        objectsArray.forEach((item)=>{
            fs.appendFile(address,JSON.stringify(item),(err)=>{
                if(err){
                    console.log("Error: "+err)
                }
            })
        })
}


export default function(app){
    app.get('/bday',function(req,res){
        
        
        var objectsArray = read_File(address,(err, objectsArray)=>{
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            res.render('bday',{bdays:objectsArray})
        })

        

        
    })

    app.post('/bday', urlencodedParser, function(req, res) {
        console.log(`name ${req.body.name} dob ${req.body.dob} button ${req.body.button}`)
        
            var there = 0
            read_File('./Bday_List.txt', (err, objectsArray) => {
                if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            if(req.body.button === 'Add Item'){
                address = AddAddress
            objectsArray.forEach((item)=>{
                console.log(`name in db = ${item.name} given name ${req.body.name}, same? ${objectsArray.name === req.body.name}`)

                if(item.name === req.body.name)
                    there=1;
            })
            if(!there && isDate(req.body.dob)){
            console.log("objectArray")
            console.log(objectsArray);
            console.log("there? = ",there)
            append_File(address, req.body);
            objectsArray.push(req.body);
            // console.log(req.body);
            res.json(objectsArray);
            }else{
                // res.status(400).send('Name Already Exists! Try Another Name!');
                // res.status(400).send(`<!DOCTYPE html>
                // <html lang="en">
                // <head>
                //     <meta charset="UTF-8">
                //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
                //     <title>Error</title>
                // </head>
                // <body>
                //     <script>
                //         alert("Name ${req.body.name} Already Exists! Try Another Name!");
                //         window.location.href = "/bday";
                //     </script>
                // </body>
                // </html>`);
                console.error("Name " + req.body.name + " Already Exists! Try Another Name!");
            }



        }
        else if(req.body.button === 'Reload'){
            address = AddAddress
            res.redirect('/bday');
        }
        else{
            address = SearchAddress
            if(req.body.name){
                objectsArray = objectsArray.filter((item) => {
                    return item.name === req.body.name;
                });
                console.log("filetered objectsArray= ", objectsArray)
                write_File(SearchAddress,objectsArray)
                res.json(objectsArray)

            }else{
                var person = closestDate(objectsArray,req.body.dob)
                console.log("Closest date with ",person)
                res.json(person);
            }
        }
        });
    
    

    });

    

    app.delete('/bday/:id', function(req, res) {
        var objectsArray;
        address = AddAddress
        read_File(address, (err, objectsArray_) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            if(objectsArray_){            
                objectsArray = objectsArray_.filter((item) => {
                    return `${item.name.split(" ")[0]}` !== req.params.id;
                    // return `${item.name.replace(/ /g, '-')}` !== req.params.id;
                });
            }


            write_File(address, objectsArray);
            res.json(objectsArray);
        });
    });
    app.put('/bday/:id', urlencodedParser, function(req, res) {
        var objectsArray;
        var name;
        address = AddAddress
        read_File(address, (err, objectsArray_) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            if (objectsArray_) {            
                objectsArray_.forEach((item) => {
                    if(`${item.name.split(" ")[0]}` == req.params.id){
                        item.dob = Object.keys(req.body)[0]
                    }
                    
                });
                objectsArray = objectsArray_
            }

            write_File(address, objectsArray);
            res.json(objectsArray);
        });
    });


    
}