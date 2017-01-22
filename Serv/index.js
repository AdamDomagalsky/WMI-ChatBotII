"use-strict";
const RiveScript = require("rivescript");
var fs = require('fs');
// includes express library
var express = require('express');
// create express app
var app = express();

app.use(express.static('public'));

// send hello on / route
app.get("/", function (req, res) {
  res.sendFile(__dirname+"/index.html");
});

// listen on 3000 port
app.listen(3000, function () {
  console.log("'I'm listening on 3000!");
});


// send user question on /api/anwser/
app.get("/api/answer/:question", function(req, res){
    var question = req.params.question.toLowerCase();
 	//res.send("Powiedziałeś: "+question);
/*moje*/
	console.log(question)
	//console.log(sendMessage(question));
	console.log(bot.reply('bot', question, this));
	try {
    	bot.replyAsync("bot", question, this).then(function(reply) {
		res.send(reply);
    	});
	} catch(e) {
		console.log('WielBłąd /api/answer/:question')
		throw new Error(e);
	}
});



/*Rive Script Implementation*/


const bot = new RiveScript({utf8: true});
bot.unicodePunctuation = new RegExp(/[.,!?;:]/g);


// Load a directory full of RiveScript documents (.rive files). This is for
// Node.JS only: it doesn't work on the web!
bot.loadDirectory("brain", loading_done, loading_error);

// All file loading operations are asynchronous, so you need handlers
// to catch when they've finished. If you use loadDirectory (or loadFile
// with multiple file names), the success function is called only when ALL
// the files have finished loading.
function loading_done (batch_num) {
    console.log("Batch #" + batch_num + " has finished loading!");

    // Now the replies must be sorted!
    bot.sortReplies();

    // And now we're free to get a reply from the brain!
    var reply = bot.reply("local-user", "test");
    console.log("The bot says: " + reply);
}

// It's good to catch errors too!
function loading_error (error) {
    console.log("Error when loading files: " + error);
}

/*
function sendMessage (input) {
	const text = input || getText();
	console.log('sendMsg:' + text);
	try {
    	bot.replyAsync("bot", text, this).then(function(reply) {
             console.log('Odp Bota: '+reply);
             return reply
    	});

	} catch(e) {
		console.log('WielBłąd sendMessage')
		throw new Error(e);
	}
	return 'WielBłąd sendMessage KURWAAAAAAAAAAA tutaj było udefined'
}*/



/* źle
bot.setSubroutine("search",function(value,key,filters){
	if (typeof(value)==='undefined') value = 'graliński';
	if (typeof(key)==='undefined') key = 'name';
	if (typeof(filters)==='undefined') filters = ['faculty','position','lvl','name','room','phone','mail','website','when'];

	console.log('Search args: \n\tValue:' +value +'\n\tKey: '+key+'\n\tFilters: '+filters)
*/

bot.setSubroutine("search",function(rs,args){

	var value = args[0];
	var key = args[1];
	var filters = args[2].split(",")

	//console.log("Args: \n\t "+typeof(key)+'\t'+key+"\n\t "+typeof(value)+'\t'+value+"\n\t "+typeof(filters)+'\t'+filters)

	var speak = '';
	var obj;
	fs.readFile('./wmiStaff.json', 'utf8', function (err, data) {
		if (err) throw err;
		dataBase = JSON.parse(data);

		dataBase.forEach(function(row){
	//	console.log('Halooooooooooo'+row[key])
			if (row[key]!='undefined' && row[key].toLowerCase().replace('-','').includes(value.replace('-',''))){
				for( var i in filters){
					var reply = filters[i]
					console.log('\t'+reply+': '+row[reply])
					speak+=' '+row[reply]
				}
				console.log(speak)
				res.send(speak)
					

			}
			
	    });
	});
});




/*
function testowa(value,key,filters){
	if (typeof(value)==='undefined') value = 'graliński';
	if (typeof(key)==='undefined') key = 'name';
	if (typeof(filters)==='undefined') filters = ['faculty','position','lvl','name','room','phone','mail','website','when'];

	var speak = '';
	var obj;
	
	fs.readFile('./wmiStaff.json', 'utf8', function (err, data) {
		if (err) throw err;
		dataBase = JSON.parse(data);

		dataBase.forEach(function(row){
			if (row[key].toLowerCase().replace('-','').includes(value.replace('-',''))){
				for( var i in filters){
					var reply = filters[i]
					console.log('\t'+reply+': '+row[reply])
					speak+=' '+row[reply]
				}
			}
			
	    });
	});
};

testowa('b2-34','room',['name','room'])
//testowa('tomasz','name',['name','lvl'])
*/