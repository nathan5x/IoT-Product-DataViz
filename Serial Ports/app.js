/**
 * Custom JS Code for Data Visualization
 */
$(document).ready(function() {
    Highcharts.theme = {
        colors: ["#A7C721", "#494D48", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
        ],
        chart: {
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 1
                },
                stops: [
                    [0, '#FFFFFF'],
                    [1, '#FFFFFF'],
                    [2, '#FFFFFF'],
                    [3, '#FFFFFF']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#E5E8DF'
        },
        xAxis: {
            gridLineColor: '#E5E8DF',
            labels: {
                style: {
                    color: '#494D48'
                }
            },
            lineColor: '#E5E8DF',
            minorGridLineColor: '#E5E8DF',
            tickColor: '#E5E8DF',
            title: {
                style: {
                    color: '#494D48'

                }
            }
        },
        yAxis: {
            gridLineColor: '#E5E8DF',
            labels: {
                style: {
                    color: '#494D48'
                }
            },
            lineColor: '#E5E8DF',
            minorGridLineColor: '#E5E8DF',
            tickColor: '#494D48',
            tickWidth: 1,
            title: {
                style: {
                    color: '#494D48'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#E5E8DF'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#494D48'
            },
            itemHoverStyle: {
                color: '#A7C721'
            },
            itemHiddenStyle: {
                color: '#C2CCAA'
            }
        },
        credits: {
            style: {
                color: '#E5E8DF'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        }
    };

    Highcharts.setOptions(Highcharts.theme);

    /** ---------- Soil Moisture Visualization ----------*/
    var $soilColChart = $('#soilColContainer').highcharts({
        chart: {
            type: 'column',
            height: 280,
            style: {
                fontSize: "12px"
            },
        },
        title: {
            text: 'Moisture History',
            fontSize: "12px"
        },
        xAxis: {
            categories: ['10/20/2015 10:11am', '10/20/2015 10:12am', '10/20/2015 10:13am', '10/20/2015 10:14am', '10/20/2015 10:15am']
        },
        yAxis: [{ //first axis
            title: {
                text: 'Level',
                style: {
                    color: '#EBA33E'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: Highcharts.getOptions().colors[0]
            }],
            labels: {
                format: '{value}'
            },
        }],
        credits: {
            enabled: false
        },
        series: [{
            name: 'Moisture Level',
            data: [3125, 3173, 24, 3127, 2092]
        }]
    });

    var previousLevel = 0;
    var currentLevel = 0;
    var soilMoisturePollTimer = window.setInterval(getSoilData, 500);
    var previousReadingTime = "";
    var isEmailSent = false;

    function getSoilData() {
        $.ajax({
            url: "https://data.sparkfun.com/output/0lLx07KKA4HY8y889g1q.json",
            dataType: "jsonp",
            data: {
                page: 1
            },
            success: function(response) {
                //console.log(response);
                if (response) {
                    renderSoilVisualization(response[0]);
                }
            }
        });
    }

    function renderSoilVisualization(moistureData) {

        var wLevel = Math.floor(moistureData.moisture * .08); //  Math.random() * (250 - 0) + 0;
        previousLevel = currentLevel;
        currentLevel = (wLevel / 2.5).toFixed(2);
        var wLevelColor = "green";
        var wLevelTop = wLevel - 125;
        var mlDate = new Date(moistureData.timestamp);
        var dateTimeString = mlDate.toLocaleTimeString();

        if (wLevel >= 170) {
            wLevelColor = "#02BADE"; // Wet
            $('#flower').css({
                "filter": "none"
            });

            isEmailSent = false;

        } else if (wLevel < 170 && wLevel >= 50) {
            wLevelColor = "#FFC711"; // Dry
            $('#flower').css({
                "filter": "hue-rotate(80deg)"
            });

            isEmailSent = false;
        } else {
            wLevelColor = "#F04B25"; // Moderate
            $('#flower').css({
                "filter": "saturate(0)"
            });

          if(!isEmailSent) {
            var emailOptions = { "to": "webground.tester@gmail.com",
                                 "subject": "Water now.",
                                 "text": "Looks like your plants are going to die. Consider pouring water..."
                               };

            console.log("Dry soil-->");
            console.log(emailOptions);

            $.get("http://localhost:8000/send",emailOptions,function(data){
              if(data=="sent") {
                console.log("Email has been sent");
              }
            });

            isEmailSent = true;
          }
        }

        $('.waterlevel .dynamic').css({
            "background-color": wLevelColor,
            "height": wLevel + "px",
            "top": (250 - wLevel) + "px",
        });

        $('.waterlevel .top').css({
            "transform": "rotateX(90deg) rotateZ(-150deg) rotateY(0deg) translateZ(" + wLevelTop + "px)"
        })

        $('#smCurrentLevel').html(currentLevel + '<span> % </span>');
        $('#smPreviousLevel').html(previousLevel + '<span> % </span>');

        if (previousReadingTime !== dateTimeString) {
            previousReadingTime = dateTimeString;
            $soilColChart = $('#soilColContainer').highcharts();
            $soilColChart.series[0].addPoint({
                y: parseFloat(currentLevel),
                name: dateTimeString
            }, true, true);
        }
    }

    function handleSparkCloud() {
        var deviceID = "xxxx";
        var accessToken = "xxxx";
        var eventSource = new EventSource("https://api.spark.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken);

        eventSource.addEventListener('open', function(e) {
            console.log("Opened!");
        }, false);

        eventSource.addEventListener('error', function(e) {
            console.log("Errored!");
        }, false);

        eventSource.addEventListener('dry-moisture-captured', function(e) {
            $('#smStatus').css('color', '#F04B25').text('Dry');
            console.log("Dry Moisture Caputed " + JSON.parse(e.data));
        }, false);

        eventSource.addEventListener('wet-moisture-captured', function(e) {
            $('#smStatus').css('color', '#02BADE').text('Wet');
            console.log("Wet Moisture Caputed " + JSON.parse(e.data));
        }, false);
    }

    handleSparkCloud();

    /** ----- Humidity & Temperature Data Visualization --- */
    var $lineChart;
    var lineChartOptions = {};
    var tempData = [77.5, 64.3, 68.1, 69];
    var humidData = [24.5, 34.3, 28.1, 29];
    var labelsData = ["10:14:10 AM", "10:15:20 AM", "10:16:30 AM", "10:18:40 AM"];
    var rht03ReadTimer = window.setInterval(readSerialData, 500);
    var socket = io();

    socket.on('to browser', function(data) {
        console.log("Socket Data --->" + data);
        if (data) {
            passAndRenderLineChart(data.split('@'));
        }
    });

    var lineChartOptions = {
        title: {
            text: '',
            y: 20 //center
        },
        style: {
            fontFamily: 'Merriweather,Helvetica Neue,Arial,sans-serif'
        },
        subtitle: {
            text: '',
            y: 40
        },
        xAxis: {
            categories: labelsData
        },
        yAxis: [{ //first axis
            title: {
                text: 'Temperature',
                style: {
                    color: '#EBA33E'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: Highcharts.getOptions().colors[0]
            }],
            labels: {
                format: '{value}°F'
            },
        }, { //second axis
            title: {
                text: 'Humidity',
                style: {
                    color: '#A7C721'
                }
            },
            labels: {
                format: '{value}%'
            },
            plotLines: [{
                value: 1,
                width: 1,
                color: Highcharts.getOptions().colors[1]
            }],
            opposite: true
        }],
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Temperature',
            data: tempData
        }, {
            name: 'Humidity',
            data: humidData
        }]
    };

    $lineChart = $('#rht03ChartContainer').highcharts(lineChartOptions);

    function readSerialData() {
        socket.emit('to serial', "HelloFromSocket");
    }

    var highTemp = 0;
    var highHumidity = 0;

    function passAndRenderLineChart(weatherData) {
        var tempF = weatherData[0];
        var humidity = weatherData[1];
        var mlDate = new Date(weatherData[2]);
        var timeStamp = mlDate.toLocaleTimeString();

        console.log(weatherData);
        console.log(mlDate);
        console.log(timeStamp);

        if (highTemp < tempF) {
            highTemp = tempF;
            $('#highTempText').html(highTemp + '&#176;C');
            updateClock(timeStamp, 'Temp');
            $('#tempTimeText').html(timeStamp);
        }

        if (highHumidity < humidity) {
            highHumidity = humidity;
            $('#highHumidText').html(highHumidity + '%');
            updateClock(timeStamp, 'Humid');
            $('#humidTimeText').html(timeStamp);
        }

        $lineChart = $('#rht03ChartContainer').highcharts();

        $lineChart.series[0].addPoint({
            y: parseFloat(tempF),
            name: timeStamp
        }, true, true);

        $lineChart.series[1].addPoint({
            y: parseFloat(humidity),
            name: timeStamp
        }, true, true);
    }

    function updateClock(time, dest) {
        var valueArray = time.split(':');
        var hrValue = parseFloat(valueArray[0]) / 12 * 1.0;
        var minValue = parseFloat(valueArray[1]) / 60 * 1.0;
        var secValue = parseFloat(valueArray[2].substring(0, 2)) / 60 * 1.0;

        $('#bLevel' + dest + 'Clock_H').circleProgress({
            value: hrValue,
            size: 45,
            startAngle: 80,
            thickness: 10,
            fill: {
                gradient: ["#A7C721", "#A7C721"]
            },
            emptyFill: "#535045"
        });

        $('#bLevel' + dest + 'Clock_M').circleProgress({
            value: minValue,
            size: 90,
            startAngle: 80,
            thickness: 10,
            fill: {
                gradient: ["#EBA33E", "#EBA33E"]
            },
            emptyFill: "#535045"
        });

        $('#bLevel' + dest + 'Clock_S').circleProgress({
            value: secValue,
            size: 150,
            startAngle: 80,
            thickness: 10,
            fill: {
                gradient: ["#E5E8DF", "#E5E8DF"]
            },
            emptyFill: "#535045"
        });
    }
    /** ----- Humidity & Temperature Data Visualization --- */

});
