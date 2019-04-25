const Discord = require('discord.js'); //Discord library
//Creating bot
const client = new Discord.Client({
  forceFetchUsers: true
});
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzMDQyNDQ4MTQ0NjEwMTAyMiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTQ2NzE5NTcyfQ.LhqkfRCksuyJzDwCpKjVw_Rei011JhGjC0V8C7Yv-Mg', client);
const fs = require('fs'); //FileSystem
try {
    var config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    console.log("[ERROR] Config overwrited");
    var config = {}
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
const active = new Map();

const serverStats = {
  guildID: '471591472311828480',
  totalUsersID: '471602694436683786',
  memberCountID: '471602835495190528',
  botCountID: '471602889974874113'
}
var ownerId = '257491128671141888';

client.on("error", e => {
  console.log("[ERROR] " + e);
});

client.on('ready', () => { //Startup
  
  
  });

client.on('guildCreate', guild => { // If the Bot was added on a server, proceed
  
  const chan = client.channels.get("471603875749691393");
  
  config[guild.id] = {
    prefix: '!d ',
    delete: 'true',
    deleteTime: 10000,
    volume: 100,
    maxVolume: 200,
    djonly: false,
    djroles: [],
    levelup: true
  }
  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  });
  /* Welcome message */
client.on('guildDelete', guild => { // If the Bot was added on a server, proceed
  client.user.setPresence({ game: { name: `!d join :)`, url: 'https://twitch.tv/qlau234', type: 1 } });

});

/* ON MESSAGE */
client.on('message', async message => { //If recieves message
   if (message.author.bot) return;
  let infoemote = client.emojis.get('567470814275043368')
//DB's
//DB's
  
  try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    config[message.guild.id] = {
      prefix: '!d ',
      delete: 'true',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      djonly: false,
      djroles: [],
      levelup: true
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
  
  
  if (config[message.guild.id] == undefined) {
    config[message.guild.id] = {
      prefix: '!d ',
      delete: 'true',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      djonly: false,
      djroles: [],
      levelup: true
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }

  //END OF POINT SYSTEM
  
  
  //

  var prefix = config[message.guild.id].prefix;
  
  let args = message.content.slice(prefix.length).trim().split(' '); //Setting-up arguments of command
  let cmd = args.shift().toLowerCase(); //LowerCase command
  //SLOWMODE
  // if (message.content === "master reset-prefix") {
  //   config[message.guild.id].prefix = '$';
  //   fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  //   message.channel.send({ embed: {"title": "Prefix - master", "color": 0x22ff22} });
  //   return;
  // }

  if (!message.content.startsWith(prefix)) return; //If no prefix
  //Command handler
  try {
    
    if (config[message.guild.id].delete == 'true') {
      message.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
    }
    
    let ops = { 
      ownerId: ownerId,
      active: active
    }

    let commandFile = require(`./commands/${cmd}.js`); //Require command from folder
    commandFile.run(client, message, args, ops); //Pass four args into 'command'.js and run it

  } catch (e) { //Catch errors 
    if (!message.content === "#!reset-prefix") {
      message.channel.send({
        embed: {
          "color": 0xff2222,
          "fields": [{
            "name": "**Error**",
            "value": "Something went wrong \n" + e
          }]
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
        }
      });
    }
  }
  
  
  //IN-COMMANDS
});

client.on('guildMemberAdd', member => {
  
});

client.on('guildMemberRemove', member => {
  
});

//Connecting bot
client.login('NTcxMDM0MjQwOTgxMDA4Mzk0.XMH3Gg.Ufb07sX7RAtKaXprW2E9FM0Tyls
');
