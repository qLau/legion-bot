const Discord = require('discord.js')

exports.run = (client, message, args, tools) => {
  let muyeembed = new Discord.RichEmbed()
  .setTitle('Sistem Muye :middle_finger:')
  .setDescription(`${args[0]} a primit muYe de la ${message.author}`)
  .setThumbnail('http://www.memegen.com/meme/bp7m3n')
  .setFooter('Sistem facut de cel mai developer qLau aka Seful Banilor aka aka.')
message.channel.send({embed:muyeembed})
}
exports.help = {
  name: "muye"
  }
