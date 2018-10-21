function japi(api,fn) {
	var ourRequest=new XMLHttpRequest();
	ourRequest.open('GET',api,true);
	ourRequest.onload=fn;

	ourRequest.send();
	}
	function fun(req)
	{
		var details=JSON.parse(req.explicitOriginalTarget.responseText);
		console.log(details);
		project_data(details);
	}
	var d= document.getElementById("data");
	function project_data(details)
	{
		var j='<div class="sub_main"><div class="space-1"></div><b>gitLink</b><div class="sub-1 b">'+details.gitLink+'</div><div class="space-2"></div><div class="sub-2 b"><b>projectDescription</b><br>'+details.projectDescription+'</div><div class="space-3"></div><div class="sub-3 b"><button onclick="getComments()">Get Comments</button><div id="comments"></div></div><div class="space-4"></div>verifiedBy<div class="sub-4 b"><b>'+details.verifiedBy+'</b></div><div class="space-5"></div></div>';
		d.innerHTML=d.innerHTML+j;
	}


	function getComments()
	{
		
		japi('http://us-central1-hackathon-692e4.cloudfunctions.net/api/getComments?rollNo=11610171'+'&'+param,getC);
	}

	function getC(req)
	{
		
		var details=JSON.parse(req.explicitOriginalTarget.responseText);
		console.log(details);
		details.forEach(get);
	}
	function get(item,index)
	{
		var ds= document.getElementById("comments");
		// window.alert(item.name+" : "+item.comment);
		 var j='<div style="padding: 10px;">'+item.name+' : '+item.comment+'</div>';
		
		ds.innerHTML=ds.innerHTML+j;
	}



	var url=window.location.href;
	var param=url.split(/[?]/)[1];
	var link='http://us-central1-hackathon-692e4.cloudfunctions.net/api/getProjects?rollNo=11610171';
	link=link+'&'+param;

	japi(link,fun);