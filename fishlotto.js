module.exports={
	name:"fishyLotto",
	args:"",
	desc:"random circle code",
	func: (msg,a,b)=>{
		const Discord = require('discord.js');
		 
		let options = ["🐟","🐟","🐟","🐟", "🐠","🐠", "🐙", "📎", "🔧", "👞", "🛒","📎", "🔧", "👞", "🛒","📎", "🔧", "👞", "🛒","📎", "🔧", "👞", "🛒"];
		let config={};
		const getRndm = () => {
		    let number=Math.round(Math.random() * (options.length-1));
		    if(typeof config[options[number]] !== "number"){
				config[options[number]]=0;
			}
			config[options[number]]++;
		    return options[number];
		}
		
		const getMsg = (a,b) => {
			var l1= new Array(b).fill('');
		   	l1 = l1.map(
				function(){
					return (new Array(a)).fill().map(
						function(){
							return getRndm();
						}
					).join("");
				}
			).join("\n");
			let i=0;
			
			return l1 +"\n\n"+Object.keys(config).map(function(elem){
					return elem+":"+config[elem];
				}).join(", ");
		
		}
		let embed = new Discord.RichEmbed(); embed.setColor("#0FF0FF");
		  embed.setTitle("Fishy Lotto");
		  embed.addField("Results",getMsg(a,b));
		  
		msg.channel.sendEmbed(embed);
		
	}
}