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
		details.forEach(project_names);
	}
	var pn= document.getElementById("project_names");
	function project_names(item,index)
	{
		
		var j='<a href="project_des.html?projectName='+item.projectName+'"><ul type="submit">'+item.projectName+'</ul></a>';
		pn.innerHTML=pn.innerHTML+j;
	}


	japi('http://us-central1-hackathon-692e4.cloudfunctions.net/api/getProjectNames?rollNo=11610171',fun);