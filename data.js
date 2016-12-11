	function buildDataTable(error,data,container)
	{
		  if (error) throw error;
		  
		  var sortAscending = true;
		  var table = d3.select('#'+container).append('table');
		  var titles = d3.keys(data[0]);
		  var headers = table.append('thead').append('tr')
		                   .selectAll('th')
		                   .data(titles).enter()
		                   .append('th')
		                   .text(function (d) {
			                    return d;
		                    })
		                   .on('click', function (d) {
		                	   headers.attr('class', 'header');
		                	   
		                	   if (sortAscending) {
		                	     rows.sort(function(a, b) { if (parseInt(b[d])>0) { return parseFloat(b[d]) < parseFloat(a[d]) } else { return b[d] < a[d]; } });
		                	     sortAscending = false;
		                	     this.className = 'aes';
		                	   } else {
		                	     rows.sort(function(a, b) { if (parseFloat(b[d])>0) { return parseFloat(b[d]) > parseFloat(a[d]) } else { return b[d] > a[d]; } });
//		                		 rows.sort(function(a, b) { return b[d] > a[d]; });
		                		 sortAscending = true;
		                		 this.className = 'des';
		                	   }
		                	   
		                   });
		  
		  var rows = table.append('tbody').selectAll('tr')
		               .data(data).enter()
		               .append('tr');
		  rows.selectAll('td')
		    .data(function (d) {
		    	return titles.map(function (k) {
		    		return { 'value': d[k], 'name': k};
		    	});
		    }).enter()
		    .append('td')
		    .attr('data-th', function (d) {
		    	return d.name;
		    })
		    .html(function (d) {
			vals=d.value.split("|");
			value = vals[0];
			change = vals[1];
			if (["K/D Ratio","Win ratio","Eliminations"].indexOf(d.name)>=0 )
			{
				result = Number(value).toLocaleString("de-DE",{maximumFractionDigits:2,minimumFractionDigits:2});
			} else
			if (["Games","Wins","Healing","Damage","Blocked","Time played","Rank","Level"].indexOf(d.name)>=0)
			{
				result = Number(Math.ceil(value)).toLocaleString("de-DE");
			} else {
		    		result = value;
			}
			if (change) {
				result = result + " <span class=" + (change>0?"green>(+":"red>(") + Number(change).toLocaleString("de-DE",{maximumFractionDigits:2}) + ")</span>";
			}
			return result;
		    });
	  }
