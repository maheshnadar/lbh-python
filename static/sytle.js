//Load the graph with experimental data
$(document).ready(function(){
    
    $('.account-link').on('click', function(e){
       
       if($(this).parents('li').hasClass('active')) {
            e.stopPropagation();
       }
       
       
    });
    
    var canvas = $("#chart").get(0);
    var ctx = canvas.getContext('2d');

    // Global Options:
     //Chart.defaults.global.defaultFontColor = '#a0aeb6';
     //Chart.defaults.global.defaultFontSize = 12;

    // Data with datasets options
    var data = {
        labels: ["Eyecare", "Medical", "Dentist", "Rx"],
        datasets: [
          {
            backgroundColor:
            	['#313f4d','#54585a','#39af87','#379baf'],
            borderWidth: 0,
            data: [84.60, 84.60, 160, 110]
          }
        ]
    };

    var options = {
      layout: {
      	padding: {
          left: 0,
          right: 0,
          top: 30,
          bottom: 0
        }
      },
    	isFixedWidth:true,
			barWidth:1,
      legend: {
        display: false
      },
      tooltips: {
      	mode: 'index',
        callbacks: {
          label: function(tooltipItem) {
            return "$" + Number(tooltipItem.yLabel).toFixed(2);
          },
          labelTextColor:function(tooltipItem, chart){
            return '#000000';
          }/*,
          titleTextColor:function(tooltipItem, chart){
            return '#000000';
          }*/
        },
        backgroundColor: '#ffffff',
        borderColor: '#a0aeb6',
        borderWidth: 1,
        bodySpacing: 0,
        cornerRadius: 2,
        displayColors: false,
        titleMarginTop: 20,
        titleMarginBottom: 0,
				titleFontSize: 0,
        titleFontColor: '#000000',
        caretSize: 4,
        xAlign: 'center',
        yAlign: 'bottom',
        xPadding: 12,
        yPadding: 12,
      },
      title: {
        display: false,
        text: 'Graph title',
        position: 'bottom'
      },
      scales: {
        xAxes: [
          {
          	barThickness : 35,
            gridLines: {
              display: false
            },
            ticks: {
            	fontSize: "12",
            	fontColor: "#000000",
            }
          }
        ],
        yAxes: [
          {
          	gridLines: {
            	drawBorder: false,
              color: "#dce1e5",
              borderDash: [4, 3],
              borderDashOffset: 3
            },
            ticks: {
            	beginAtZero:true,
              fontColor: "#a0aeb6",
              fontSize: "12",
              callback: function (value) {
                return "$"+Number(value)
              },
              stepSize: 25
            }
          }]
      },
      responsive: true
    };

    // Chart declaration:
    var barChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

});


