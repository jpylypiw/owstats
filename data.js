
	function numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

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
		    .text(function (d) {
			if (["K/D Ratio","Win ratio","Eliminations"].indexOf(d.name)>=0 )
			{
				return parseFloat(d.value).toFixed(2);
			} 
			if (["Blocked","Time played"].indexOf(d.name)>=0)
			{
				return numberWithCommas(Math.ceil(d.value));
			}
			if (["Wins","Healing","Damage"].indexOf(d.name)>=0)
			{
				return numberWithCommas(Math.ceil(d.value));
			}
		    	return d.value;
		    });
	  }
