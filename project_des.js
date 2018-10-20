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
		var j='<div class="sub_main"><div class="space-1"></div><div class="sub-1 b">'+details.gitLink+'</div><div class="space-2"></div><div class="sub-2 b">'+details.projectDescription+'<div class="space-4"></div><div class="sub-4 b">'+details.verifiedBy+'</div><div class="space-5"></div></div>';
		d.innerHTML=d.innerHTML+j;
	}
	var url=window.location.href;
	var param=url.split(/[?]/)[1];
	var link='http://us-central1-hackathon-692e4.cloudfunctions.net/api/getProjects?rollNo=11610171';
	link=link+'&'+param;

	japi(link,fun);