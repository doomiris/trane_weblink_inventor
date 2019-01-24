// JavaScript Document
try{
	var oApp=GetObject("","Inventor.Application");
}
catch(e){
	throw new Error(0,"Can't connect to Inventor! Please make sure the Inventor application is running.");
}
function ReadPara(paraName,mdl,paraGroup){
	if (!mdl) mdl=oApp.ActiveDocument;
	if (!paraGroup) paraGroup="User Defined Properties";
	try{
		var p=mdl.PropertySets.Item(paraGroup).item(paraName);
	}catch(e){
		return "";
	}
	return p.value;
}
function writePara(paraName,paraVal,mdl,paraGroup){
	if (!mdl) mdl=oApp.ActiveDocument;
	if (!paraVal || paraVal.length==0) paraVal="";
	if (!paraGroup) paraGroup="User Defined Properties";
	try{
		var p=mdl.PropertySets.Item(paraGroup).Item(paraName);
		p.value=paraVal;
	}catch(e){
		var p=mdl.PropertySets.Item(paraGroup).Add(paraVal,paraName);
	}	
}
function CloseBrowser(){
	document.title="quit";
	setTimeout(function(){history.go(-1)},500);
}