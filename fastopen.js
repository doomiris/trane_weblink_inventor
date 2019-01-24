// JavaScript Document
function fastOpen(iFileName){
	var foType=Spry.$('foType');
	iFileName=getTail(iFileName.trim());
	switch (window.event.keyCode){
		case 13: //OK
			var wp=getRemoteWorkspace();
//			if (wp=="\\") alert("Not working in a shared ipj project, please verify your project setting!");
			var oFileName=wp + iFileName;
			if (iFileName.search(/\./)<0)
				var ot = getTail(iFileName);
				oFileName += foType.options[foType.selectedIndex].text;
				
			try{
				oApp.Documents.Open(oFileName, true);
				CloseBrowser();
			}catch(e){
				alert(oFileName+"\n"+e.description);
			}
			break;
//		case 27: //ESC
//			Cancel_OnClick();
//			break;
//		default:
	}
	function getTail(t){
		t=t.split(".").pop(0);
		switch(foType.options[foType.selectedIndex].text){
			case ".idw":
				if (t.substr(t.length-4,4)=="0100") return t.substring(0,t.length-4);
				else return t;
			case ".ipt",".iam":
				if (t.substr(t.length-4,4)=="0100") return t;
				else return t + "0100";
			default:
				return t;
		}		
	}
}
function getExt(iFileName){
	var f=iFileName.split(".");
	var foType=Spry.$('foType');
	if (f.length>1){
		foType.disabled=true;
//		var fe=f[f.lengh];
//		if (fe)	changeExt(testExt(fe));
	}else{
		foType.disabled=false;
		var fn=f[0];
		switch (fn.length){
			case 8:
				changeExt("d");
				break;
			case 12:
				changeExt("s");
				break;
			default:
				changeExt("o");
				break;
		}
	}
	function changeExt(ext){		
		var foCMD=Spry.$('foCMD');
		foType.selectedIndex="odsa".indexOf(ext.toLowerCase());
	}
	function testExt(ext){
		ext=ext.toLowerCase();
		if (ext.length=1){
			if ("odsa".indexOf(ext)>=0) return ext;
			else return "o";
		}else{
			switch(ext){
				case "idw",".idw":
					return "d";
				case "ipt",".ipt":
					return "s";
				case "iam",".iam":
					return "a";
				default:
					return "o";
			}
		}
	}
}
function getRemoteWorkspace(){
	var folderlist=Spry.$('folderlist');
	if (folderlist.selectedIndex) var rt=folderlist.options[folderlist.selectedIndex].value;
	else var rt="";
	if (rt.substring(rt.length-1)!=="\\") rt=rt+"\\";
	return rt;
//	return "\\\\Shacnas1020\\inv2\\";
}
function togMore(){
	var e=Spry.$('foMore');
	if (e.style.display=="none") e.style.display="";
	else e.style.display="none";
}
function folderChg(){
	var folderlist=Spry.$('folderlist');
	addCookie("savedIndex",folderlist.selectedIndex);
}