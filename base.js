
$(document).ready(function() {

	$("body").css("height",$(window).height());
	$("#ingredients").append("<br><br><b>26 Aug 2014</b>: - Fixed cannot craft<br><span style='opacity:0;'><b>26 Aug 2014</b>: - </span>bug in world #6<br><span style='opacity:0;'><b>26 Aug 2014</b>: </span> - Fixed world not<br><span style='opacity:0;'><b>26 Aug 2014</b>: - </span>generate correctly<br><span style='opacity:0;'><b>26 Aug 2014</b>: - </span>when refreshing page");
	
	world=[];
	cave=[];
	playerxcave=30;
	playerycave=30;
	worldnum=1; //1
	insidecave=false;
	pickaxe=0; // 0 = none, 1 = wood, 2 = stone
	
	items=[];
	items.push({"name":"wood", "owned":0}); //0
	items.push({"name":"stone", "owned":0}); //1
	items.push({"name":"iron", "owned":0}); //2
	items.push({"name":"gold", "owned":0}); //3
	items.push({"name":"bedrock!?", "owned":0}); //4
	items.push({"name":"diamond", "owned":0}); //5
	
	portalingredients="0,10";
	
	generateWorld(worldnum);
	playerx=Math.round((worldsize+40)/2);
	if(worldnum==7)playerx=21;
	playery=Math.round((worldsize+40)/2);
	update();
	
	if(typeof localStorage.worldwarpergamesave!=="undefined" && localStorage.worldwarpergamesave!="") {
		decoded=atob(localStorage.worldwarpergamesave).split("|");
		worldnum=decoded[0];
		generateWorld(worldnum);
		pickaxe=decoded[1];
		items[0].owned=decoded[2];
		items[1].owned=decoded[3];
		items[2].owned=decoded[4];
		items[3].owned=decoded[5];
		items[4].owned=decoded[6];
		items[5].owned=decoded[7];
		update();
	}
	
	setInterval(function() {
		localStorage.worldwarpergamesave=btoa(worldnum+"|"+pickaxe+"|"+items[0].owned+"|"+items[1].owned+"|"+items[2].owned+"|"+items[3].owned+"|"+items[4].owned+"|"+items[5].owned);
	},5000);
	
	$(document).keydown(function(e) {
		kc=e.keyCode;
		if(!insidecave) {
			if(kc==37) {
				if(collision(playerx-1,playery)=="grass") {
					playerx--;
					update();
				}
			}
			else if(kc==38) {
				if(collision(playerx,playery-1)=="grass") {
					playery--;
					update();
				}
			}
			else if(kc==39) {
				if(collision(playerx+1,playery)=="grass") {
					playerx++;
					update();
				}
			}
			else if(kc==40) {
				if(collision(playerx,playery+1)=="grass") {
					playery++;
					update();
				}
			}
		}
		else {
			if(kc==37) {
				if(collisioncave(playerxcave-1,playerycave)=="walkable") {
					playerxcave--;
					update();
				}
			}
			else if(kc==38) {
				if(collisioncave(playerxcave,playerycave-1)=="walkable") {
					playerycave--;
					update();
				}
			}
			else if(kc==39) {
				if(collisioncave(playerxcave+1,playerycave)=="walkable") {
					playerxcave++;
					update();
				}
			}
			else if(kc==40) {
				if(collisioncave(playerxcave,playerycave+1)=="walkable") {
					playerycave++;
					update();
				}
			}
		}
	});

});

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function makealert(id,title,html) {
	closemessage();
	setTimeout(function(){$("#alerts").append('<div class="alert alert-'+id+'"><b>'+title+'</b><br>'+html+'<br><br><input type="button" value="Close this window" onclick="closemessage()"></div>');
	$(".alert-"+id).fadeIn("fast");},200);
}

function makealert2(id,title,html) {
	closemessage2();
	setTimeout(function(){$("#alerts2").append('<div class="alert2 alert-'+id+'"><b>'+title+'</b><br>'+html+'<br><br><input type="button" value="Close this window" onclick="closemessage2()"></div>');
	$(".alert-"+id).fadeIn("fast");},200);
}

function closemessage() {
	$(".alert").fadeOut("fast");
	setTimeout(function(){$(".alert").remove();},200);
	insidecave=false;
}
function closemessage2() {
	$(".alert2").fadeOut("fast");
	setTimeout(function(){$(".alert2").remove();},200);
}

function update() { 
	if(items[4].owned>1)alert('Hey, cheater! >:C');
	drawWorld();
	if(insidecave)drawCave();
	if(worldnum==1)portalingredients="0,10";
	if(worldnum==2)portalingredients="0,20|1,10";
	if(worldnum==3)portalingredients="1,30|2,10";
	if(worldnum==4)portalingredients="3,1";
	if(worldnum==5)portalingredients="4,1";
	if(worldnum==6)portalingredients="0,0";
	if(worldnum==7)portalingredients="5,1";
	if(worldnum==8)portalingredients="0,0";
	$("#woodqty").html(items[0].owned);
	$("#stoneqty").html(items[1].owned);
	$("#ironqty").html(items[2].owned);
	$("#goldqty").html(items[3].owned);
	$("#diamondqty").html(items[5].owned);
	$("#xpos").html(playerx);
	$("#ypos").html(playery);
	$(".worldnumber").html(worldnum);
	$("#portalingredients").html("");
	a=portalingredients.split("|");
	for(i=0;i<a.length;i++) {
		b=a[i].split(",");
		$("#portalingredients").append("<b>"+b[1]+"</b> "+capitaliseFirstLetter(items[b[0]].name)+"<br>");
	}
}

function makeportal() {
	a=portalingredients.split("|");
	for(i=0;i<a.length;i++) {
		b=a[i].split(",");
		if(items[b[0]].owned>=b[1]) {
			if(i==a.length-1) {
				makealert('craft-portal','Crafting success','You successfully crafted the portal! Go there and teleport to the next world!');
				
				if(worldnum!=7) {
					world[Math.round((worldsize+40)/2-2)][Math.round((worldsize+40)/2-2)].type="portal";
					world[Math.round((worldsize+40)/2-2)][Math.round((worldsize+40)/2-2)].ascii="P";
				}
				else {
					world[21][21].type="portal";
					world[21][21].ascii="P";
				}
				if(worldnum==6)world[Math.round((worldsize+40)/2-2)][Math.round((worldsize+40)/2-2)].ascii="<span onclick='collision(18,18)'>P</span>";
				
				for(j=0;j<a.length;j++) {
					c=a[j].split(",");
					items[c[0]].owned-=c[1];
				}
				update();
			}
		}
		else {
			makealert('ingredients-not-enough','Not enough resources','Ouch, you don\'t have enough resources to make a portal! Collect some more!');
			break;
		}
	}
}

function generateWorld(num) {

	world=[];

	if(num==1) {
		worldsize=20;
	}
	else if(num==2) {
		worldsize=30;
	}
	else if(num==3) {
		worldsize=9;
	}
	else if(num==4) {
		worldsize=20;
	}
	else if(num==5) {
		worldsize=100;
		console.log("Of course you can't mine bedrock!\nThat's why you need to give yourself one using this developer console\nNow, type in 'items[4].owned=1' (without quotes)");
	}
	else if(num==6) {
		worldsize=0;
	}
	else if(num==7) {
		worldsize=3;
	}
	else if(num==8) {
		worldsize=0;
	}
	
	for(i=1;i<=20;i++) {
		they=[];
		they=generateNone(they,worldsize+40);
		world.push(they);
	}
	
	they=[];
	they=generateNone(they,19);
	for(j=9;j<worldsize+11;j++) {
		they.push({"ascii":"B", "type":"bedrock"});
	}
	they=generateNone(they,20);
	world.push(they);
	
	for(i=1;i<=worldsize;i++) {
		they=[];
		they=generateNone(they,19);
		for(j=1;j<=worldsize+2;j++) {
			if(j==1 || j==worldsize+2) {
				they.push({"ascii":"B", "type":"bedrock"});
			}
			else {
				treeprobability=0.09;
				if(num==4)treeprobability=0.7;
				if(num==5)treeprobability=0;
				if(Math.random()<treeprobability) {
					they.push({"ascii":"T", "type":"tree"});
				}
				else {
					they.push({"ascii":"&bull;", "type":"grass"});
				}
			}
		}
		they=generateNone(they,19);
		world.push(they);
	}
	
	they=[];
	they=generateNone(they,19);
	for(j=9;j<worldsize+11;j++) {
		they.push({"ascii":"B", "type":"bedrock"});
	}
	they=generateNone(they,20);
	world.push(they);
	
	for(i=1;i<=20;i++) {
		they=[];
		they=generateNone(they,worldsize+40);
		world.push(they);
	}
	
	world[Math.round((worldsize+40)/2+2)][Math.round((worldsize+40)/2+2)].type="crafting";
	world[Math.round((worldsize+40)/2+2)][Math.round((worldsize+40)/2+2)].ascii="C";
	if(num==6)world[Math.round((worldsize+40)/2+2)][Math.round((worldsize+40)/2+2)].ascii="<span onclick='collision(22,22)'>C</span>";
	
	if(num==2 || num==3) {
		world[21][20].type="cave";
		world[21][20].ascii="A";
	}
	
	if(num==4) {
		world[20+worldsize][18+worldsize].type="chest";
		world[20+worldsize][18+worldsize].ascii="H";
	}
	
	if(num==6) {
		string="KEYBOARDS ARE";
		string=string.split("");
		for(i=0;i<string.length;i++) {
			world[14][14+i].ascii=string[i];
		}
		string="USELESS    IN";
		string=string.split("");
		for(i=0;i<string.length;i++) {
			world[16][14+i].ascii=string[i];
		}
		string="THIS    WORLD";
		string=string.split("");
		for(i=0;i<string.length;i++) {
			world[26][14+i].ascii=string[i];
		}
	}
	
	if(num==6 || num==8) {
		world[21][19].ascii=" ";
		world[20][19].ascii=" ";
		world[21][20].ascii=" ";
		world[21][19].type="none";
		world[20][19].type="none";
		world[21][20].type="none";
	}
	
	if(num==7) {
		world[Math.round((worldsize+40)/2+2)][Math.round((worldsize+40)/2+2)].type="none";
		world[Math.round((worldsize+40)/2+2)][Math.round((worldsize+40)/2+2)].ascii=" ";
		world[22][20].type="crafting";
		world[22][20].ascii="C";
		world[22][22].type="cave";
		world[22][22].ascii="A";
	}
	
	if(num==8) {
		world[Math.round((worldsize+40)/2+2)][Math.round((worldsize+40)/2+2)].type="none";
		world[Math.round((worldsize+40)/2+2)][Math.round((worldsize+40)/2+2)].ascii=" ";
		world[21][20].type="chest";
		world[21][20].ascii="H";
	}
	
}

function generateCave(worldsize) {

	cave=[];

	for(i=1;i<=20;i++) {
		they=[];
		they=generateNone(they,worldsize+40);
		cave.push(they);
	}
	
	they=[];
	they=generateNone(they,20);
	for(j=9;j<worldsize+11;j++) {
		they.push({"ascii":"B", "type":"bedrock"});
	}
	they=generateNone(they,20);
	cave.push(they);
	
	ironnum=0;
	diamondnum=0;
	for(i=1;i<=worldsize;i++) {
		they=[];
		they=generateNone(they,20);
		for(j=1;j<=worldsize+2;j++) {
			if(j==1 || j==worldsize+2) {
				they.push({"ascii":"B", "type":"bedrock"});
			}
			else {
				if(Math.random()<0.03) {
					if(worldnum==2) {
						they.push({"ascii":"S", "type":"stone"});
					}
					else {
						they.push({"ascii":"I", "type":"iron"});
						ironnum++;
					}
				}
				else {
					they.push({"ascii":"S", "type":"stone"});
				}
			}
		}
		they=generateNone(they,20);
		cave.push(they);
	}
	
	while(ironnum<10) {
		for(i=21;i<=worldsize+20;i++) {
			for(j=21;j<=worldsize+20;j++) {
				if(j!=1 && j!=worldsize) {
					if(Math.random()<0.03) {
						cave[i][j].type="iron";
						cave[i][j].ascii="I";
						ironnum++;
					}
				}
			}
		}
	}
	
	if(worldnum==7) {
		while(diamondnum<1) {
			for(i=21;i<=25;i++) {for(j=21;j<=25;j++) {if(j!=1 && j!=worldsize) {if(Math.random()<0.001) {cave[i][j].type="diamond";cave[i][j].ascii="D";diamondnum++;}}}}
			for(i=21;i<=25;i++) {for(j=25;j<=21;j++) {if(j!=1 && j!=worldsize) {if(Math.random()<0.001) {cave[i][j].type="diamond";cave[i][j].ascii="D";diamondnum++;}}}}
			for(i=25;i<=21;i++) {for(j=25;j<=21;j++) {if(j!=1 && j!=worldsize) {if(Math.random()<0.001) {cave[i][j].type="diamond";cave[i][j].ascii="D";diamondnum++;}}}}
			for(i=25;i<=21;i++) {for(j=20;j<=25;j++) {if(j!=1 && j!=worldsize) {if(Math.random()<0.001) {cave[i][j].type="diamond";cave[i][j].ascii="D";diamondnum++;}}}}
		}
	}
	
	they=[];
	they=generateNone(they,20);
	for(j=9;j<worldsize+11;j++) {
		they.push({"ascii":"B", "type":"bedrock"});
	}
	they=generateNone(they,20);
	cave.push(they);
	
	for(i=1;i<=20;i++) {
		they=[];
		they=generateNone(they,worldsize+40);
		cave.push(they);
	}
	
	for(i=29;i<=31;i++) {
		for(j=25;j<=35;j++) {
			cave[i][j].type="walkable";
			cave[i][j].ascii=" ";
		}
	}
	
}

function drawWorld() {
	$(".map").html("");
	for(i=playery-7;i<=playery+7;i++) {
		for(j=playerx-7;j<=playerx+7;j++) {
			if(i==playery && j==playerx) {
				$(".map").append("Y"+" ");
			}
			else {
				$(".map").append(world[i][j].ascii+" ");
			}
		}
		$(".map").append("<br>");
	}
}

function drawCave() {
	$(".cavemap").html("");
	for(i=playerycave-7;i<=playerycave+7;i++) {
		for(j=playerxcave-7;j<=playerxcave+7;j++) {
			if(i==playerycave && j==playerxcave) {
				$(".cavemap").append("Y"+" ");
			}
			else {
				if(cave[i+1][j].type=="walkable" || cave[i+1][j+1].type=="walkable" || cave[i+1][j-1].type=="walkable" || cave[i-1][j].type=="walkable" || cave[i-1][j-1].type=="walkable" || cave[i-1][j+1].type=="walkable" || cave[i][j-1].type=="walkable" || cave[i][j+1].type=="walkable") {
					$(".cavemap").append(cave[i][j].ascii+"&nbsp;");
				}
				else {
					$(".cavemap").append("&nbsp;&nbsp;");
				}
			}
		}
		$(".cavemap").append("<br>");
	}
}

function generateNone(they,size) {
	for(j=1;j<=size;j++) {
		if(Math.random()<0.1) {
			they.push({"ascii":"~", "type":"none"});
		}
		else {
			they.push({"ascii":" ", "type":"none"});
		}
	}
	return they;
}

function collision(x,y) {
	type=world[y][x].type;
	if(type=="grass")return "grass";
	if(type=="tree") {
		makealert('tree','A tree','You see a tree here, you can collect wood from it using your axe<br><br><input type="button" onclick="mine(0,'+x+','+y+')" value="Chop wood using axe">');
	}
	else if(type=="crafting") {
		otherstuffs="";
		if(pickaxe==0 && worldnum==2) {
			otherstuffs='<br><input type="button" onclick="craft(\'woodpick\')" value="Craft a wooden pickaxe"> (10 wood)';
		}
		else if(pickaxe==1 && worldnum==3) {
			otherstuffs='<br><input type="button" onclick="craft(\'stonepick\')" value="Craft a stone pickaxe"> (10 stone)';
		}
		makealert('crafting','Crafting table','This is your crafting table, you can craft the portal here<br><br><input type="button" onclick="makeportal()" value="Craft a portal">'+otherstuffs);
	}
	else if(type=="bedrock") {
		if(worldnum==5) {
			makealert('bedrock','Bedrock','You see a bedrock, it separates this world with the emptiness outside<br><br><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup><sup>developer console</sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup>');
		}
		else {
			makealert('bedrock','Bedrock','You see a bedrock, it separates this world with the emptiness outside');
		}
	}
	else if(type=="portal") {
		makealert('portal','Portal','<br><input type="button" onclick="enterportal()" value="Enter the portal?">');
	}
	else if(type=="cave") {
		insidecave=true;
		playerxcave=30;
		playerycave=30;
		generateCave(20);
		makealert('cave','Cave','You entered the cave<br>Caves re-generate everytime you visit them<br><br><pre class="cavemap"></pre>');
		setTimeout(function() {
			insidecave=true;
			update();
		},250);
	}
	else if(type=="chest") {
		if(worldnum==4 || worldnum==8)makealert('chest','A Chest!','Wow! A chest! Let\'s see what you got<br><br><input type="button" onclick="openchest()" value="Open the chest">');
	}
}

function collisioncave(x,y) {
	type=cave[y][x].type;
	if(type=="walkable")return "walkable";
	if(type=="stone") {
		if(pickaxe>=1) {
			makealert2('stone','Stone','Stone! Mine it?<br><br><input type="button" onclick="mine(1,'+x+','+y+')" value="Mine the stone">');
		}
		else {
			makealert2('stone','Stone','Stone! But it seems that you can\'t mine it, better make a pickaxe first');
		}
	}
	else if(type=="iron") {
		if(pickaxe>=2) {
			makealert2('iron','Iron','Iron! Mine it?<br><br><input type="button" onclick="mine(2,'+x+','+y+')" value="Mine the iron">');
		}
		else {
			makealert2('iron','Iron','Iron! But it seems that you can\'t mine it, better make a stone pickaxe first');
		}
	}
}

function enterportal() {
	closemessage();
	worldnum++;
	generateWorld(worldnum);
	playerx=Math.round((worldsize+40)/2);
	if(worldnum==7)playerx=21;
	playery=Math.round((worldsize+40)/2);
	update();
}

function mine(type,x,y) {
	items[type].owned++;
	if(type==0) {
		world[y][x].type="grass";
		world[y][x].ascii="&bull;";
		closemessage();
	}
	else if(type==1 || type==2) {
		cave[y][x].type="walkable";
		cave[y][x].ascii="&nbsp;";
		closemessage2();
	}
	update();
}

function craft(what) {
	if(what=="woodpick") {
		if(items[0].owned>=10) {
			items[0].owned-=10;
			pickaxe=1;
			makealert('craft-woodpick','Wooden Pickaxe','You successfully crafted a wooden pickaxe! Now you can mine stone!');
		}
	}
	else if(what=="stonepick") {
		if(items[1].owned>=10) {
			items[1].owned-=10;
			pickaxe=2;
			makealert('craft-stonepick','Stone Pickaxe','You successfully crafted a stone pickaxe! Now you can mine iron!');
		}
	}
	update();
}

function openchest() {
	if(worldnum==4) {
		makealert('open-chest','Chest opened','You opened the chest and found <b>1</b> gold!');
		items[3].owned++;
		world[20+worldsize][18+worldsize].type="grass";
		world[20+worldsize][18+worldsize].ascii="&bull;";
	}
	else if(worldnum==8) {
		endmessage=' ___________________________________\n\
|                                   |\n\
|  Oh, it seems that I don\'t have   |\n\
|  enough time to continue this     |\n\
|  game anymore, also I think I     |\n\
|  have no idea what to put in the  |\n\
|  next level, so, this is the end  |\n\
|                                   |\n\
|             THE END               |\n\
|                                   |\n\
|  Thanks for playing! Hope you     |\n\
|  like it :D                       |\n\
|___________________________________|';
		makealert('open-chest','Chest opened','You opened the chest and found this message:<br><pre>'+endmessage+'</pre><br>If many people requested, maybe I will make a longer version of this game');
	}
	update();
}

function resetgame() {
	one=confirm("Are you sure to reset your progress?");
	if(one) {
		two=confirm("Really?");
		if(two) {
			three=confirm("This action can't be undone");
			if(three) {
				four=confirm("Last confirmation, are you really really sure?");
				if(four) {
					localStorage.clear();
					alert("Ok, your progress has been reset, the page will be refreshed");
					location.reload();
				}
			}
		}
	}
}
