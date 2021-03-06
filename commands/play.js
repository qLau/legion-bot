const Discord = require("discord.js");
const ytdl = require("ytdl-core");
var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args, ops) => { //Collecting info about command
  
  var song = args[0];
  config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
  var streamOptions = {
    seek: 0,
    volume: config[message.guild.id].volume / 100
  };

  if (!message.member.voiceChannel) {
    return message.channel.send({
      embed: {
        "title": "Întră într-un canal de voice!",
        "color": 0xff2222
      }
    }).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }
  if (!song) {
    return message.channel.send({
      embed: {
        "title": "Numele melodiei sau URL-ul este greșit!",
        "color": 0xff2222
      }
    }).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }

  let validate = await ytdl.validateURL(song);

  if (!validate) {
    let commandFile = require('./search.js');
    return commandFile.run(client, message, args, ops);
  }

  let info = await ytdl.getInfo(song);
  let data = ops.active.get(message.guild.id) || {};

  if (!data.connection) {
    data.connection = await message.member.voiceChannel.join();
  }

  if (!data.queue) {
    data.queue = [];
  }

  data.guildID = message.guild.id;

  data.queue.push({
    songTitle: info.title,
    requestAuthor: message.author,
    url: song,
    announceChannel: message.channel.id
  });

  if (!data.dispatcher) {
    play(client, ops, data, streamOptions);
  } else {
    let queueE = new Discord.RichEmbed()
       .setColor(0x76e8d8)
      .setAuthor("Autor " + message.author.username, message.author.avatarURL)
      .setDescription("Am adăugat în listă **" + info.title + "**")
    message.channel.send({embed:queueE})
  }

  ops.active.set(message.guild.id, data);

}

async function play(client, ops, data, streamOptions) {

  let playEmbed = new Discord.RichEmbed()
    .setColor(0x76e8d8)
    .setAuthor("Autor " + data.queue[0].requestAuthor.username, data.queue[0].requestAuthor.avatarURL)
    .setDescription("Melodie curentă **" + data.queue[0].songTitle + "**")
  
   client.channels.get(data.queue[0].announceChannel).send({embed:playEmbed})

  data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, {
    filter: "audioonly"
  }), streamOptions);

  data.dispatcher.guildID = data.guildID;

  data.dispatcher.once('finish', function() {
    finish(client, ops, this);
  });

}

async function finish(client, ops, dispatcher) {

  let fetched = ops.active.get(dispatcher.guildID);
  fetched.queue.shift();

  if (fetched.queue.length > 0) {
    ops.active.set(dispatcher.guildID, fetched);
    play(client, ops, fetched);
  } else {
    fetched.dispatcher.end();
    ops.active.delete(dispatcher.guildID);
    let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
    if (vc) {
      vc.leave();
    }
  }
  if(args[0] === 'skip'){
    fetched.queue.shift();
    ops.active.set(dispatcher.guildID, fetched);
    play(client, ops, fetched);
  }

}
