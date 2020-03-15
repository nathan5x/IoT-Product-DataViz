### Experiments with Internet of Things
##Live Data Visualization from Sparkfun Sensors
Visualizing IoT data of SparkFun sensors using different Web APIs, JavaScript libraries & CSS 3 (3D Transforms).

####[Demo - Data Visualization](http://nathan5x.github.io/IoT-DataViz/)

### Description
---
This data visualization mainly displays data that are received from two sensors - SparkFun Soil Moisture sensor and RHT03 Temperature and Humidity sensor. There are three different data sources mainly used in this data visualization.

* data.sparkfun.com - Using the value from A0 pin, soilsensor.ino file publishes the soil moisture data through Phant server APIs from Photon. Based on these data it displays the water level in a water tank with different colors of the plant and bar chart of different data recorded. If it goes to dry state user will get an email, like an alert instead of SMS. Custom CSS 3D transforms and transitions are used to display the water level dynamic animation.

* Particle Cloud Events - using Spark.publish() and Spark.subscribe() soil moisture sensor data are published to Particle Cloud Events that can be monitored through particle dashboard. Using EventSource JavaScript API these events are subscribed (through event listeners) and soil moisture status (wet or dry) is displayed. jQuery API updates the status of soil moisture.

* Serial Port - By reading digital pin D6, RHT03 sensor data are written to serial port from soilsensor.ino file.  Using Socket.IO in NodeJS serial port values have been red and sent to line chart that displays temperature and humidity data as a stream. In previous [visualization] (http://nathan5x.github.io/PublicDataViz/) this chart does buffering the data that comes from data.sparkfun.com, in this experiment data is live and instant update from Photon.

### Components Used
---
##### Kit
Sparkfun Photon Kit

##### Sensors
* [Soil Moisture Sensor](https://www.sparkfun.com/products/13322)
* [RHTO3 - Humidity and Temperature Sensor](https://www.sparkfun.com/products/10167)

##### LEDs
Standard Green, Red and Yellow LEDs

##### Resistors
4x 1K Ohm resistors

[Circuit layouts can be viewed here](https://github.com/nathan5x/IoT-DataViz/tree/master/CircuitLayouts)

### Data Source
---
* Spark Cloud Events - To display the status of soil moisture (wet or dry).

* data.sparkfun.com - To animate the Water Tank with plant.

* Serial Port - To stream Temperature and Humidity sensor data.

### Motivation
---
Inspired by number of dashboards at various places like Airport, Stock Markets, and Weather Monitoring Station.

### API Reference
---
This project is grateful to various Web APIs and JavaScript frameworks. Here are the list of references,

* [HighCharts](http://www.highcharts.com/demo/line-basic/dark-green)
 - HighCharts for rendering line charts.

* [jQuery](https://jquery.com/)
 - jQuery for all the DOM Manipulations.

* [Twitter Bootstrap](http://getbootstrap.com/)
 - Elegant CSS and JS framework for building responsive, and mobile first projects.

* [Custom Creative Bootstrap Theme](http://startbootstrap.com/template-overviews/creative/)
 - Custom Bootstrap theme.

### Contributors
---
Want to be one? Drop your GitHub username in comments. I will add you in the list. :)

### License
---
MIT License.
