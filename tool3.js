var TBM;
if (!TBM) TBM=function(MdlObj){
	if (!MdlObj){
		if (oApp.ActiveDocument) this.CurrentModel=oApp.ActiveDocument;
		else return;
	}else{
		this.CurrentModel=MdlObj;
	}
	if (this.CurrentModel.DocumentType==12292){ //kDrawingDocumentObject
		this.drawing=this.CurrentModel;
		if (this.CurrentModel.ReferencedDocuments.Count>0) this.model=this.drawing.ReferencedDocuments.Item(1);
		else this.model=null;
	}
	else{
		this.model=this.CurrentModel;
		this.drawing=null;
	}
	this.Tol();
	this.Para();
	this.Desp();
}
//=========================
TBM.prototype.Tol=function(){

	this.Tol.GetWebTol=function(){
		var t={};
		t.x			=Spry.$('tx').value;
		t.xx		=Spry.$('txx').value;
		t.xxx		=Spry.$('txxx').value;
		t.Angles	=Spry.$('ta').value;
		t.Finish	=Spry.$('tf').value;
		t.HoleUp	=Spry.$('thup').value;
		t.HoleDown	=Spry.$('thdown').value;
		return t;
	}
	this.Tol.GetDrwTol=function(){
		var t={};
		t.x			=ReadPara("X,").trim();
		t.xx		=ReadPara("X,X").trim();
		t.xxx		=ReadPara("X,XX").trim();
		t.Angles	=ReadPara("ANGLES").trim();
		t.Finish	=ReadPara("FINISH").trim();
		t.HoleUp	=ReadPara("HOLE+").trim();
		t.HoleDown	=ReadPara("HOLE-").trim();
		return t;
	}
	this.Tol.LoadToWeb=function(t){
		if (!t) t=this.GetDrwTol();
		Spry.$('tx').value		=t.x;
		Spry.$('txx').value		=t.xx;
		Spry.$('txxx').value	=t.xxx;
		Spry.$('ta').value		=t.Angles;
		Spry.$('tf').value		=t.Finish;
		Spry.$('thup').value	=t.HoleUp;
		Spry.$('thdown').value	=t.HoleDown;
	}
	this.Tol.SetToDrw=function(t){
		if (!t) t=this.GetWebTol();
		writePara("X,",		t.x	);
		writePara("X,X",	t.xx);
		writePara("X,XX",	t.xxx);
		writePara("ANGLES",	t.Angles);
		writePara("FINISH",	t.Finish);
		writePara("HOLE+",	t.HoleUp);
		writePara("HOLE-",	t.HoleDown);
	}
}
//=========================
TBM.prototype.Para=function(){
	var mdl=this.CurrentModel;
	this.Para.GetWebPara=function(){
		var p={};
		p.DRAWN_BY	=Spry.$('DRAWN_BY').value;
		p.DRAWN_DATE=Spry.$('DRAWN_DATE').value;
		p.DRAWN_REV	=Spry.$('DRAWN_REV').value;
		return p;
	}
	this.Para.GetDrwPara=function(){
		var p={};
		p.DRAWN_BY	=ReadPara("Designer",null,"Design Tracking Properties");
		p.DRAWN_DATE=ReadPara("DATE");
		p.DRAWN_REV	=ReadPara("MX_REVISION");
		if (p.DRAWN_REV.length==0 && !mdl.FullFileName) p.DRAWN_REV="A";
		return p;
	}
	this.Para.LoadToWeb=function(){
		var p=this.GetDrwPara();	
		Spry.$('DRAWN_BY').value=p.DRAWN_BY;
		if (p.DRAWN_DATE.toLowerCase()!=="dd-mmm-yyyy") Spry.$('DRAWN_DATE').value=p.DRAWN_DATE;
		Spry.$('DRAWN_REV').value=p.DRAWN_REV;
	}
	this.Para.SetToDrw=function(){
		var p=this.GetWebPara();
		writePara("Designer",p.DRAWN_BY,null,"Design Tracking Properties");
		writePara("Author",p.DRAWN_BY,null,"Summary Information");
		writePara("DATE",p.DRAWN_DATE);
		writePara("MX_REVISION",p.DRAWN_REV);
	}
}
TBM.prototype.Desp=function(){
	this.Desp.GetFromWeb=function(){
		var d={};
		d.partnoun			=Spry.$('cname1').value;
		d.description		=Spry.$('cname2').value;
		d.ex_desp		=Spry.$('desp1').value;
		d.ex_desp2		=Spry.$('desp2').value;
		return d;
	}
	this.Desp.GetFromDrw=function(){
		var d={};
		d.partnoun			=ReadPara("PART_NOUN").trim();
		if (d.partnoun=="UNASSIGNED") d.partnoun="";
		d.description		=ReadPara("DESCRIPTION").trim();
		d.ex_desp		=ReadPara("EXT_DESCP_1").trim();
		d.ex_desp2		=ReadPara("EXT_DESCP_2").trim();
		return d;
	}
	this.Desp.LoadToWeb=function(d){
		if (!d) d=this.GetFromDrw();
		Spry.$('cname1').value		=d.partnoun;
		Spry.$('cname2').value		=d.description;
		Spry.$('desp1').value		=d.ex_desp;
		Spry.$('desp2').value		=d.ex_desp2;
	}
	this.Desp.SetToDrw=function(d){
		if (!d) d=this.GetFromWeb();
		writePara("PART_NOUN",		d.partnoun	);
		writePara("DESCRIPTION",	d.description);
		writePara("EXT_DESCP_1",	d.ex_desp);
		writePara("EXT_DESCP_2",	d.ex_desp2);
	}
}