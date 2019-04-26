
Save New Duplicate & Edit Just Text Twitter
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args, ops) => { //Collecting info about command

  let fetched = ops.active.get(message.guild.id);
  
  if(!fetched) return message.channel.send(`There is currently nothing playing.`)
  
  if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send(`We aren\'t in the same channel!`)
  
  let userCount = message.member.voiceChannel.members.size;
  let required = Math.ceil(userCount/2);
  if(!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];
  
  if(fetched.queue[0].voteSkips.includes(message.member.id)) return message.channel.send(`Sorr you already voted. ${fetched.queue[0].voteSkips.length}/${required}`)
  
  fetched.queue[0].voteSkips.push(message.member.id)
  ops.active.set(message.guild.id, fetched)
  
  if(fetched.queue[0].voteSkips.length >= required){
    message.channel.send(`Song skipped!`)
    return fetched.dispatcher.emit('play');
  }
  message.channel.send(`Vote added!`)
}
