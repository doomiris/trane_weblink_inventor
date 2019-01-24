// JavaScript Document
var qdata="C:\\workspaces\\querydata.xml";
var ds1 = new Spry.Data.DataSet();
var dsPrint = new Spry.Data.DataSet();
var ds2 = new Spry.Data.XMLDataSet(null, "proe/Define");
GetSessionList();
//========================================================
function GetSessionList(){
	var SL=[];
	AN(GetList(".asm"));
	AN(GetList(".prt"));
	AN(GetList(".drw"));
	ds1.setDataFromArray(SL);
	if (ds2.dataWasLoaded) ds2.setURL(null);
	function AN(retObj){
		for (var i=0; i<retObj.NumMdls; i++){
			var pName=retObj.MdlNameExt.Item(i);
			SL.push({
				"PartNumber":pName.replace(/<.*>/,""),
				"CommonName":crapCode(GetCommonName(pName)),
				"Description":GetPara(pName,"Description"),
				"IsModified":GetStatus(pName),
				"Done":"ini"
			});
		}
	}
}
function viewFilter(fname){
	if (fname=="All") {
		ds1.filter(null); 
//		ds2.loadData();
	}else{
		ds1.filter(function(dataSet, row, rowNumber){
		  if (row["PartNumber"].split(".")[1].toLowerCase()==fname)
			return row;
			return null;
		});
//		ds2.loadData();
//		ds2.setCurrentRow(ds2.curRowID);
	}
}
function GetSearch(fname){
	Spry.$('tFilter').selectedIndex=0;
	if (!fname||fname.length==0) {
		ds1.filter(null); 
//		ds2.loadData();
	}else{
		var reg=new RegExp(fname);
		reg.ignoreCase=true;
		ds1.filter(function(dataSet, row, rowNumber){
		  if (row["PartNumber"].search(reg)>=0 || row["CommonName"].toLowerCase().search(reg)>=0 || row["Description"].toLowerCase().search(reg)>=0)
			return row;
			return null;
		});
//		ds2.loadData();
//		ds2.setCurrentRow(ds2.curRowID);
	}
}
function StartQuery(){
	ds2.setURL(qdata);
	ds2.loadData(); 
	ds1.loadData();
}
function StartWrite(){
	var st=Spry.$("st");
	for (i=1;i<st.rows.length;i++){
		var orow=st.rows[i];
		var pp=orow.cells[2].innerText;
		if (orow.cells[3].innerText.length>0){
			SetCommonName(pp,orow.cells[3].innerText);
			if (orow.cells[4].innerText||orow.cells[4].innerText.length>0){
				SetPara(pp,"Description",1,orow.cells[4].innerText);
			}else{
				SetPara(pp,"Description",1,";");
			}
	//		SetPara(pp,"Description",1,"");		// dirty the file
	//		DelPara(pp,"Dirty");
	//		SetPara(pp,"Extended_Description",1,orow.cells[5].innerText);
			SaveDoc(pp);
			orow.cells[orow.cells.length-1].innerHTML="<img src=img/right.gif>";
		}
	}
}
function BatchOpen(nstr,extv){
	closeLayer("getinput");
	openLayer("divload");
	setTimeout(function(){
		var errList=[];
		var nl=nstr.toString().replace(/\r/g,"\n").replace(/\n\n/g,"\n").split("\n");
//		var fgs=pfcCreate("pfcModelDescriptors");
		var side=Spry.$('FromLocal').checked;
		for(i=0;i<nl.length;i++){
			if (nl[i].length <= 0) break;
			var FileName = gn(nl[i].trim(),parseInt(extv));
//			var fg=pfcCreate("pfcModelDescriptor").CreateFromFileName(FileName);
//			fgs.Append(fg);
			var succ=bgopen(FileName,false,side);
			if (!succ) errList.push(FileName);
		}
//		if (Spry.$(checkout).checked){
//			Session.CheckoutToWS(fgs,Session.GetActiveServer().ActiveWorkspace,false,2);
//		}
		if (errList.length>0){
			Spry.$("errlist").value=errList.join("\r\n");
			closeLayer("divload");
			openLayer("geterr");
		}
		else window.history.go(0);
	},1000);
	function gn(str,nType){
		var Ext=["auto",".prt",".asm",".drw"];
		switch(nType){
			case 1:
			case "prt":
				return LongName(str)+Ext[1];
				break;
			case 2:
			case "asm":
				return LongName(str)+Ext[2];
				break;
			case 3:
			case "drw":
				return ShortName(str)+Ext[3];
				break;
		}
		function LongName(m){
			switch (m.length){
				case 8:
					return m+"0100";
					break;
				case 9:
					return (m.substring(1,1).toLowercase=="x")?m+"000":m;
					break;
				default:
					return m;
					break;
			}
		}
		function ShortName(m){
			switch (m.length){
				case 12:
					return m.substring(0,8);
					break;
				case 13:
					return (m.substring(1,1).toLowercase=="x")?m.substring(1,9):m;
					break;
				default:
					return m;
					break;
			}
		}
	}
}
function getrez(m,str){
	var ds=(ds2.dataWasLoaded)?ds2:ds1;
	var row = ds.findRowsWithColumnValues({"PartNumber": m}, true);
	if (row) return eval("row."+str);
	else return "";
}
function lookupCName(region,func){
	return getrez(func("{PartNumber}"),"CommonName");
}
function lookupDesp(region,func){
	return getrez(func("{PartNumber}"),"Description");
}
function lookupDone(region,func){
	return rez(func("{PartNumber}"),"Done");
	function rez(m,str){
		if (ds2.dataWasLoaded){
			var row = ds2.findRowsWithColumnValues({"PartNumber": m}, true);
			if (row) return "got";
			else return "no";
		}else{return "ini";}
	}
}
function ModifyPart(){	
	var cName=Spry.$('CommonName');
	var Desp=Spry.$('Description');
	if (cName.className=="ib" && Desp.className=="ib") return;
	var cName=cName.value;
	var Desp=Desp.value;
	var pName=Spry.$('PartNumber').value;
	SetCommonName(pName,cName);
	SetPara(pName,"Description",1,Desp);
	SaveDoc(pName);
//	var st=Spry.$("st");
//	for (i=1;i<st.rows.length;i++){
//		var orow=st.rows[i];
//		var pp=orow.cells[0].innerText;
//		if (pp==ds1.getCurrentRowID()){
//			orow.cells[3].innerText=cName;
//			orow.cells[4].innerText=Desp;
//			orow.cells[orow.cells.length-1].innerHTML="<img src=img/right.gif>";
//			break;
//		}
//	}
	window.history.go(0);
}
function StartExport(){
	if (!window.confirm("This action will export current session list into c:\\workspaces\n\nContinue?")) return;
	var fso=new ActiveXObject("Scripting.FileSystemObject"); 
	var ctf=fso.CreateTextFile("C:\\workspaces\\export_list.csv",true); 
	var st=Spry.$("st");
	ctf.WriteLine("Part Number,Common Name,Description");
	for (i=1;i<st.rows.length;i++){
		var orow=st.rows[i];
		var a=CSV(orow.cells[2].innerText);
		var b=CSV(orow.cells[3].innerText);
		var c=CSV(orow.cells[4].innerText);		
		ctf.WriteLine(a+","+b+","+c)
	}
	ctf.Close(); 
	alert('list has been saved to "C:\\workspaces\\export_list.csv"');
	function CSV(s){
		if (s.length==0) return " ";		
		s=s.replace(/"/g,'""');
		s=s.replace(/\\/g,"\\\\");
		if (s.indexOf(",")>0) s='"'+s+'"';
		return s;
	}
}
Spry.Data.Region.addObserver("TabbedPanels1", {onPostUpdate:function(notifier, data) {
	var TabbedPanels1 = new Spry.Widget.TabbedPanels("TabbedPanels1");
	Spry.Widget.TabbedPanels.prototype.onTabFocus=function(e,tab){
		tab.blur();
	}
	var tipC={useEffect:"fade",hideDelay:1,showDelay:2};
	var tip=[];
	var i=0;
	Spry.$$("div.tc").forEach(function(n){	
	n.innerHTML=['<img src="img/ini.png" width="16" height="16" align="absmiddle"/>',n.innerHTML].join(" ");
	tip[i] = new Spry.Widget.Tooltip(n, "#tip"+i, tipC);i++;
	})

}});
function ReleaseDrawing(){
	if (!window.confirm("This action will remove interation version from the drawings.\nYou should batch load all drawing into session first.\n\nContinue?")) return;
	var ds=GetList(".drw");
	for (var i=0; i<ds.NumMdls; i++){
		var mdl=ds.ModelObjects.Item(i);
		var titleBlock=new TBM(mdl);
		var tb=titleBlock.DefaultTables.File;
		var RevH=titleBlock.textHeights.Rev;
		writeTextInCell(tb,1,3,"&PTC_WM_REVISION:D",RevH,mdl,true);
		var pName=ds.MdlNameExt.Item(i);
		SetPara(pName,"dirty",1,"-");
		DelPara(pName,"dirty");
		SaveDoc(pName);
	}
	alert("Done");
}
function addrevPrep(){
	openLayer('divAddRev');
	Spry.$("pdfVeradd").innerHTML=Spry.$("pdfVeradd").innerHTML.replace("#workspaces#",workspace);
try{ 
	var fso=new ActiveXObject("Scripting.FileSystemObject"); 
}catch(e){alert("can't create FSO object")}
	if (!fso) return;
	var ds=GetList(".drw");
	var SL=[];
	for (var i=0; i<ds.NumMdls; i++){
		var mdl=ds.ModelObjects.Item(i);
		var titleBlock=new TBM(mdl);
		if (titleBlock.DefaultTables){
			var tb=titleBlock.DefaultTables.File;
			var rev=ReadTextInCell(tb,1,3).trim();
			var pName=workspace+ds.MdlNameExt.Item(i).split(".")[0]+".pdf";
			if (fso.FileExists(pName)){
				var Pdf=fso.GetFile(pName);
				if (rev.split(".")[0].length==2) var NewName=pName.replace(".pdf",rev+".pdf"); //GED required right justify
				else var NewName=pName.replace(".pdf","-"+rev+".pdf");
				SL.push({
					"filename":NewName.replace(workspace,""),
					"oname":pName,
					"status":false
				});
			}
		}
	}
	dsPrint.setDataFromArray(SL);
}
function AddRevToPdf(){
	var fso=new ActiveXObject("Scripting.FileSystemObject"); 
	var fd=dsPrint.getData();
	for (i=0; i<fd.length; i++){
		var NewName=fd[i]["filename"];
		var oName=fd[i]["oname"];
		if (fso.FileExists(NewName)) fso.GetFile(NewName).Delete(true);
		fso.GetFile(oName).Move(NewName);
	}
	Spry.$('btnAddrev').disabled=true;
	setTimeout(
		function(){
			closeLayer('divAddRev');
			Spry.$('btnAddrev').disabled=false;
	},2000);
}

var pdf_index=-1;  //place outside
function MassPrintPrep(){
	if(Session.ListWindows().Count>1) {
		alert("Must be in base window. \n\n Close all open windows and try again!");
		return;
	}
	openLayer('divPrint');
	var ds=GetList(".drw");
	if (!ds.NumMdls>0) return;
	Spry.$("pdfNote").innerHTML=Spry.$("pdfNote").innerHTML.replace("#workspaces#",workspace).replace("#t#",ds.NumMdls);
	var SL=[];
	for (i=0; i<ds.NumMdls; i++){
		SL.push({
			"filename":ds.MdlNameExt.Item(i),
			"status":false
		});
	}
	dsPrint.setDataFromArray(SL);
	pdf_index=-1;
	Spry.$("btnPrint").value="Start";
}
function MassPrint(){
	var btn=Spry.$("btnPrint");
	var ds=GetList(".drw");
	var mc=
		"~ Activate `main_dlg_cur` `ProCmdModelMkPdf.file`;\n"+
		"~ Select `intf_pdf` `pdf_color_depth`1  `pdf_mono`;\n"+
		"~ Activate `intf_pdf` `pdf_launch_viewer`0 ;\n"+
		"~ Activate `intf_pdf` `pdf_btn_ok`;\n"+
		"~ Activate `main_dlg_cur` `ProCmdWinCloseGroup.file`;\n"+
		"~ Activate `main_dlg_cur` `TAB_BROWSER_OPEN_NAME`1;"
	var SL=[];
	for (i=0; i<ds.NumMdls; i++){
		SL.push({
			"filename":ds.MdlNameExt.Item(i),
			"status":(pdf_index+1>=i)
		});
	}
	dsPrint.setDataFromArray(SL);
//	var ds=GetList(".drw");
	if (pdf_index<0) pdf_index=0; else pdf_index++;
	if (pdf_index < ds.NumMdls){
		if (ds.NumMdls==pdf_index+1) btn.value="DONE";
		else btn.value=	(pdf_index+1)+"/"+ds.NumMdls;
		var mdl=ds.ModelObjects.Item(pdf_index);
		var ww=Session.CurrentWindow.GetBrowserSize ();
		mdl.Display();
		var w=Session.GetModelWindow(mdl)
		w.Activate();
		Session.RunMacro(mc);
	}else{
		closeLayer('divPrint');
	}	
}
//function CloseAll(){
//	var ws=Session.ListWindows();
//	for (i=0;i<ww.Count;i++) ws.Item(i).Close();
//}
function CheckTubeOD(){
//	if (!window.confirm("This action will add version string to all PDFs in c:\\workspaces.\nYou should batch load all drawing into session first.\n\nContinue?")) return;
	var ds=GetList(".prt");
	for (var i=0; i<ds.NumMdls; i++){
		var mdl=ds.ModelObjects.Item(i);
		if (mdl.CommonName.split(";")[0].trim().toUpperCase()=="TUBE"){
			var desp=GetPara(mdl.FileName,"Description");
			alert (mdl.ListFeaturesByType());
		}
	}
	alert("Done");
	
}
function createDrw(mdl){
	if (typeof(mdl)=="string")	var mdl=Session.GetModel(mdl.replace(/<.*>/,""),GetModelType(mdl));
	if (mdl.Type==2) return;
	var options = pfcCreate ("pfcDrawingCreateOptions");
	options.Append (pfcCreate("pfcDrawingCreateOption").DRAWINGCREATE_DISPLAY_DRAWING);
	try{
		var drw=Session.CreateDrawingFromTemplate(GetDrwName(mdl.FileName),"template_ansi_c_mm",mdl.Descr,options); //pfc model found exist
	}catch(e){
		if(e.description=="pfcXToolkitFound") alert(GetDrwName(mdl.FileName)+".drw already exists in Session");
		return;
	};
	drw.CommonName="";
	Session.GetModelWindow(drw).Activate();
	function GetDrwName(fn){
		var s=fn.split(".");
		if (s[0].length>8) var t=8; else var t=s[0].length;
		if (s[0].substr(0,1).toLowerCase()=="x") return s[0].substr(0,t+1);
		else return s[0].substr(0,t);
	}
}