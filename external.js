const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const yt = require('ytdl-core');
const request = require('request');

const botOwnerID="254274910816436234";

//getAllMethods is via eval-only:
const getAllMethods = (obj) => {
    let props = []
	//http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
	//Bruno Grieder
	//http://stackoverflow.com/users/1263942/bruno-grieder
    do {
		try{
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) =>
                typeof obj[p] === 'function' &&  //only the methods
                p !== 'constructor' &&           //not the constructor
                (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
                props.indexOf(p) === -1          //not overridden in a child
            )
        props = props.concat(l)
		}
		catch(err){console.log(err);}
    }
    while (
        (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
        Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
    )

    return props
}


//My webhooks for eval purposes

//var webhooks = JSON.parse(fs.readFileSync('../webhooks.json'));
//const notetaker = new Discord.WebhookClient(webhooks.Notetaker.id,webhooks.Notetaker.token);

var creds = JSON.parse(fs.readFileSync('../credentials.json'));
var obj=false;
var getURL=function(url,arg,msg){
	obj=false;
	
	request(url, function(error, response, body) {
		if(!JSON.parse(body)){
			obj="";
		}
		obj=JSON.parse(body);
		msg.channel.sendCode("xl",obj[arg]);
	});
}


var khancordrules={
			"nsfw":"II.b.1)No NSFW. ",
			"readablespam":"II.b.2)Only light and readable spam is allowed and must go in the spam channel. There especially should be no spamming in the general channel. Spamming bot commands can “break” a bot. Do not use bot commands outside of the bot channel-especially in general.",
			"mentionspam":"II.b.3)No using @ mentions without good reason-especially @everyone, @here or @roles, as they ping multiple users. You SHOULD @moderator, if an activity happening calls for moderator attention.",
			"cursing":"II.b.4)No cursing-Cursing includes censored and letter cursing any time “F bomb” is involved. Also, “S bomb” and H-E-double hockey sticks, if spelled out and used as a curse, rather than the opposite of heaven. As long as not frequent- crap, darn, heck are permitted.",
			"nonkhancord":"II.b.5)No server advertising or enticing. We cannot endorse the content of servers not on the Khancord network. Do not post invite links, speak about your server in a way meant to entice other users to it or use the chat to fish for other users. Discussing bot support servers is acceptable.",
			"impersonation":"II.b.6)Impersonation is prohibited. Do not use the name or avatar that another user has used on any Khancord network server in the previous month. There may be some leeway for meme-related names and avatars, but it’s best to ask the user who last used it and/or a moderator before proceeding. If a moderator tells you to change your name, nickname or avatar and it doesn’t seem obvious why, this may be why.",
			"unathorizedalt":"II.b.7)No user may use two accounts (alts) on the same server without approval from the server owner. Approval for this is generally limited to moderation staff who may need to test something. If any user happens to have permission to use an alt and uses it maliciously, they risk action to all screen names. (Common sense is required).",
			"personalinfo":"II.b.8)Don’t ask other users personal information like their age, real names or location beyond time zone. Do not share this information about other users, unless it is available publicly (for example on their KA profile). Users are strongly advised not to share their last names.",
			"drama":"II.b.9)No drama- Examples of drama include, but are not limited to:\n\u2B1BAsking why someone else was banned\n\t\u2B1BThere is a mod-log on UKADS, if it's not listed there, do not ask\n\t\u2B1BIf a Khancord Network Server doesn't have a log, you may ask in conference\n\u2B1BNot respecting moderators\n\t\u2B1BCriticizing  a moderator in open server\n\t\u2B1BModerators may ask you to follow rules that have been removed from the rules\n\t\u2B1BIf a mod tells you to stop, stop-if you think they are abusing power, talk to the server owner AFTER, but you don't get to disobey because you don't like what a moderator tells you.\n\u2B1BPicking arguments-\n\t\u2B1BTrying to discuss contentious political topics\n\t\u2B1BBringing disputes from Direct Messages to open server\n\t\u2B1BBringing disputes from Discord to KA itself\n\t\u2B1BBringing disputes from other servers\n\t\u2B1BSpreading mean gossip about users\n\t\u2B1BUsing open chat to attempt to talk to someone that blocked you on DMs\n\t\u2B1BDefending users who are breaking rules\n\t\u2B1BAttempting to spread hatred towards this servers' moderators in an outside location",
			"addLinkStr":"Complete set of rules hosted at: https://mesolatido.github.io/UKADSrules.html"
		};

var commandList={
	"emojispam":{
		func:function(msg,arg,addits){
			let ans="";
			ans.toLowerCase();
			let t=arg.toLowerCase();
			function isAlpha(str) {
			  return /^[a-zA-Z]+$/.test(str);
			}
			for(var i=0;i<t.length;i++){
				switch(t[i]){
					case "0" :ans+=":zero:";break;
					case "\n" :ans+="\n";break;
					case "1" :ans+=":one:";break;
					case "2" :ans+=":two:";break;
					case "3" :ans+=":three:";break;
					case "4" :ans+=":four:";break;
					case "5" :ans+=":five:";break;
					case "6" :ans+=":six:";break;
					case "7" :ans+=":seven:";break;
					case "8" :ans+=":eight:";break;
					case "9" :ans+=":nine:";break;
					//case 10 :ans+=":keycap_ten:";break;
					case " ":ans+=" ";break;
					case "'":ans+="'";break;
					case "\"":ans+="\"";break;
					case ":":ans+=":";break;
					case "?":ans+=":grey_question:";break;
					default:ans+=isAlpha(t[i])?":regional_indicator_"+t[i]+":":"-";break;
					//default:ans+=":"+t[i]+t[(i+1)%t.length]+":\xa0";break;
				}
				ans+="\u200B";
			}
			msg.reply(ans+addits.join("\u200B"));
		}
	},
	"rickroll":{
		func:function(msg){
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel) {
				return msg.reply("Please be in a voice channel first!");
			}
			voiceChannel.join()
            .then(connnection => {
                let stream = yt("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
                    audioonly: true
                });
                const dispatcher = connnection.playStream(stream,{ seek: 0, volume: 1 });
                dispatcher.on('end', () => {
                    voiceChannel.leave();
                });
            });
		}
	},
	"yt":{
    func: function(msg, arg) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) {
            return msg.reply("Please be in a voice channel first!");
        }
        voiceChannel.join()
            .then(connnection => {
                try {
                    let num = arg.indexOf("https://www.youtube.com/watch?v=") > 0 ? "https://www.youtube.com/watch?v=".length : 0;
                    let vid = arg.slice(num).trim();
                    if (vid === "") {
                        throw "Not a video";
                    }
					if (vid === "end") {
                        voiceChannel.leave();
                        msg.reply("Ended (Manual)");
						return;
                    }
                    let url = "https://www.youtube.com/watch?v=" + vid;
                    console.log(vid);
                    let information;
                    yt.getInfo(url, [], function(err, info) {
                        try {
                            if (err) {
                                throw "Invalidated Request";
                            }
                            if (info) {
                                msg.reply("Playing");
                                let stream = yt(url, {
                                    audioonly: true,
                                });
                                const dispatcher = connnection.playStream(stream, {
                                    seek: 0,
                                    volume: 1
                                });
                                dispatcher.on('end', () => {
                                    voiceChannel.leave();
                                    msg.reply("Ended");
                                });
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    });
                } catch (err) {
                    msg.reply("video not found error");
                    console.log(err);
                }
           });
		}
	},
	"math":{
		func:(message,arg,adds) => {
			let math = require('mathjs');
			let called="";
			let result="";
			try{
				if(adds.length>0&&typeof math[adds[0]] ==="function"){
					called=adds[0].trim();
					result=math[called].apply(this,arg.split(",")).toString();
					console.log(arg);
				}else{ 
				    called="eval";
					result=math.eval(arg);
				}
			}
			catch(err){result=err;}
			let embed= new Discord.RichEmbed()
			.setTitle("Mathjs Interpreter")
			.addField("INPUT ("+called+")",arg)
			.addField("OUTPUT",result)
			.setFooter(`called by ${message.author.username}`)
			message.channel.sendEmbed(embed);
		}
	},
	"fishlotto":{
		func:(msg,arg) => {
			require("./fishlotto.js").func(msg, (Math.abs(parseInt(args[0])))||7, (Math.abs(parseInt(args[0])))||7);
		}
	},
	"fishfake": {
		func:(message,arg) => {
			let options = ["nothing","something","a fish","some trash","some trash","some trash","some trash","some trash","some trash","some trash","some trash","a pikachu","a shoe","a toothbrush","your own wallet","a shoe","a toothbrush","your own wallet","a shoe","a toothbrush","your own wallet","nothing"];
			const getRndm = () => {
				let number=Math.round(Math.random() * (options.length-1));
				return options[number];
			}
				  message.channel.sendMessage(":fishing_pole_and_fish:  |  **"+message.author.username+", you caught:** __"+getRndm() + "__! Paid :yen: **0** for casting.");
		}
	},
	"owner": {
		func:(message,arg) => {
			 message.channel.sendMessage("This server is owned by "+message.guild.members.get(""+message.guild.ownerID).user.username);
		}
	},
	"userinfo":{
		func: (msg, arg) => {
			let user = msg.author;
			if (msg.guild.member(msg.mentions.users.first())) {
				user = msg.guild.member(msg.mentions.users.first()).user;
			}
			let URL = user.displayAvatarURL;
			let embed = new Discord.RichEmbed();
			embed.setColor("#0FF0FF");
			embed.setThumbnail(URL);
			embed.addField("Requested user", user.username, true);
			embed.addField("ID", user.id, true);
			let presence = (msg.author.id === user.id && user.presence.status === "offline") ? "invisible" : user.presence.status;
			embed.addField("Status", presence, true);
			embed.addField("Game", user.presence.game ? user.presence.game.name : "[No game playing]", true);
			msg.channel.sendEmbed(embed);
		}
	},
	"rules":{
		"help":function(id){return "\n`"+Object.keys(commandList.rules[""+id]).join("`  `")+"`";},
		"210923273553313792":khancordrules,
		"219096380457746433":khancordrules
	},
	"@Bythos":{
		
	},
	"guilds":{
		//eval-only
		"dunk": (msg,args) => {
	
			let obj={};
			let inc=0;
			bot.guilds.forEach(function (value, key, mapObj) {
				obj[value]=key;
			});
			let tableMiddle=function(objectName,bool){
				return "¦ "+
			"-----------------------------------------".slice(objectName.length)+objectName+" ¦ "+bool+"------------------".slice((bool.toString()).length)+"  ¦"+
			"\n";
			};
			let table='+-----------------------------------------------------------------+\n';
			for(let server in obj){
				table+=tableMiddle(server,obj[server]);
			}
			msg.channel.sendCode(table+"+-----------------------------------------------------------------+");
		}
	}
}


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

bot.on('message', msg => {
  let list=Object.keys(commandList);
  splashes=list.map(function(x){return x[0]==="@"?"\u200B"+x:"e$"+x});
  //if(msg.author.id !== bot.user.id) return;
  const prefix = "e$";
  if (msg.isMentioned(bot.user)&&!msg.author.bot){
	  if((msg.content.indexOf("help")>0||msg.content.indexOf("Help")>0)&&msg.content.indexOf("e$help")<0){
		  msg.reply("`Hello, I'm Bythos`\n```To see a list of commands please use e$help```");
	  }else if(msg.content.indexOf("e$help")>0){
		  return;
	  }else{
		  msg.reply("I was mentioned");
	  }
	  
  }
  if(msg.content.substring(0,prefix.length) !== prefix) return;
  
    
	
    
    //console.log(msg.content);
  
  var content = msg.content.slice(prefix.length)+" ~";
  const command = content.substring(0,content.indexOf(" ")).trim();
  var additions=content.slice(content.indexOf(" ")).split("~");
  const argument = additions.shift();
  var array=[command,additions,argument]
	array.map(function (value, key, mapObj) {
		console.log(value+":"+key);
	});
	additions.map(function (value, key, mapObj) {
		console.log(mapObj[key]=value.trim());
	});
	if (commandList[command]&&commandList[command].func) {
		console.log(prefix+command+" activated")
        commandList[command].func(msg,argument,additions);
		return;
    }if (commandList[command.toLowerCase()]&&commandList[command.toLowerCase()].func) {
		console.log(prefix+command.toLowerCase()+" activated")
        commandList[command.toLowerCase()].func(msg,argument,additions);
		return;
    }else if(command.toLowerCase()==="rules"&&commandList.rules[""+msg.guild.id]&&(commandList.rules[""+msg.guild.id][argument.trim()]||argument.trim()==="help")){
		let ruleReturn="";
		if(argument.trim()==="help"){
			ruleReturn=""+msg.guild.name+"```"+commandList.rules.help(''+msg.guild.id)+" ``` <end rules list>";
		}
		else{
			ruleReturn=commandList.rules[""+msg.guild.id][argument.trim()];
		}
		let addLinkStr="Complete set of rules hosted at: https://mesolatido.github.io/UKADSrules.html";
		msg.channel.sendMessage("```"+ruleReturn+"```\n"+addLinkStr);
	}
	else{
		console.log("Not listed:"+command);
	}
	
	if (msg.content.trim()==="e$help"){
		let str="\u200B\t\u25FC"+
		["e$fishLotto","e$help"].join("\n\t\u25FC")+"\n\t\u25FCe$"+list.filter(function(x){return typeof commandList[x].func === "function"}).join("\n\t\u25FCe$");
		
		let embed=new Discord.RichEmbed()
		.addField("The current commands:",str);
        msg.channel.sendEmbed(embed);
    }
	
  if(msg.author.id !== botOwnerID ) return;
  if(command.trim()==="request") {
	  let argd=JSON.parse(argument.trim());
	  if(!argd.url||!argd.get) return;
		request(argd.url, function(error, response, body) {
			if(!JSON.parse(body)){
				msg.channel.sendMessage("Data does not exist in a useable format\nPlease check if this url accepts get requests");
				return;
			}
			msg.channel.sendMessage(require("util").inspect(JSON.parse(body)[argd.get]));
		});
  }
  if(command.trim()==="log"){
	  msg.channel.sendMessage("\u200B",{embed: {
				color: 3447003,
				author: {
					name: "Bythos Log System",
					icon_url: bot.user.avatarURL
				},
				description: argument.trim(),
				timestamp: new Date()
			}
	  });
  }
  if(command.trim()==="eval") {
    try {
      var code = argument;
	  var evaled= eval(code);
	  if (typeof evaled ==="Promise" && additions.indexOf("inspect")>=0){
		  evaled.then(
			function(){
				msg.channel.sendCode("xl", evaled);
				evaled=undefined;
			}
		  ).err(console.error)
		  //evaled= eval("function(msg){return "+code+";}").apply(this,[msg]);
		  
	  } else if (typeof evaled !== "string"&&(evaled!==undefined)){
			if(additions.indexOf("inspect")>=0){
				evaled = require("util").inspect(evaled);
				msg.channel.sendCode("xl", clean(evaled));   
			}	
	  }else if(additions.indexOf("inspect")>=0){
			msg.channel.sendCode("xl", evaled);
	  }
	  if(additions.indexOf("fancy")>=0){
		  let URL="https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwOi8vd3d3Lm1hY2Vyb2JvdGljcy5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTYvMDIvZ2Vhci10b29scy5wbmcifQ.lc8Zq4vmjQ57Evm_VfbYnVpqdIw";
		  let embed = new Discord.RichEmbed(); embed.setColor("#0FF0FF");
		  embed.setThumbnail(URL);
		  embed.addField("Input",code);
		  embed.addField("Output",require("util").inspect(evaled));
		  msg.channel.sendEmbed(embed).then(function(){msg.delete();}); 
	  }
	  if(additions.indexOf("r")>=0 && msg){
		  msg.delete();
	  }
    } catch(err) {
      msg.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	  msg.delete();
    }
  }
  if(command.trim()==="saveCode") {
	var key = additions[0];
	fs.writeFile("./"+key+".js", "module.exports={\n\tname:\""+key+"\",\n\targs:\"\",\n\tdesc:\""+key+"\",\n\tfunc: (msg,args)=>{\n\t\t"+argument.replace(/(?:\r\n|\r|\n)/g, '\r\n\t\t')+"\n\t}\n}", function(err) {
		if(err) {
			return console.log(err);
		}
		let URL="https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwOi8vd3d3Lm1hY2Vyb2JvdGljcy5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTYvMDIvZ2Vhci10b29scy5wbmcifQ.lc8Zq4vmjQ57Evm_VfbYnVpqdIw";
		let embed = new Discord.RichEmbed(); embed.setColor("#0FF0FF");
		embed.setThumbnail(URL);
		embed.addField("The file was saved!",key+".js");
		embed.addField("Code",argument.length>900?"[Code saved]":argument);
		msg.channel.sendEmbed(embed).then(function(){msg.delete();});
		
	}); 
  }
})


bot.login(creds.externalBot).then(success).catch(err);

var splashes= ["e$help","e$fishLotto","e$rickroll","@"+"\u200B"+"Bythos"];
var splashsNum=0;
	
function success(token) {
	console.log("Ready")
	bot.user.setPresence(
	{"game":
		{
		   "name":"e$help",
		   "url":"https://www.twitch.tv/whatify"
		}
	})
	//bot.setInterval(function(){bot.user.setGame(splashes[splashsNum++%splashes.length]);},7000);
	
}
function err(error) {
    // handle error
    console.log(error);
    console.log("Failed login: C'mon Bot, y u fail?");
}