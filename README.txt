
\    / _  _ _|_|_  _  _  \    /. _| _  _ _|_
 \/\/ (/_(_| | | |(/_|    \/\/ |(_|(_|(/_ |  for MChE
                                    _|
 *
 * Weather Widget 1.3 for MChE
 *
 *
 * Copyright (c) 2014 Adam Pardyl

 # This program is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # This program is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with this program.  If not, see <http://www.gnu.org/licenses/>.

-------------------------------------------------------------------------------------

 Descripcion: Weather Widget for MChE is a web interface for MChE weather database, designed to be embedded into third party websites.

-------------------------------------------------------------------------------------

 Installation:
  - Embedded: Copy all widget files except index.html into your website directory, insert widget elements from index.html into place, where you want the widget to be displayed. Make sure you do not duplicate jquery-min script, that might already be included in your website.
  - Standalone: Copy all widget files to your website directory.

 Uninstallation: Remove all files and other widget elements.

 For embedded configuration:
  width: 652px
  min height: 847px
  max height: 947px

-------------------------------------------------------------------------------------

 Tested on:
 - Google Chrome 39.0
 - Mozilla Firefox 34.0
 - IE11

 Known Issues:
 - Exporting to CSV do not work under IE
-------------------------------------------------------------------------------------

 Q/A:
 - Q: Does it require any server-side configuration?
   A: Nope, It's entirely client-side application.
 - Q: Will this program work with other weather databases?
   A: No, unless the database structure is identical or the scripts extensively modified.
 - Q: Program hangs on loading
   A: Check if the METEO_JSON_URL value is set properly.
 - Q: How to change the default station
   A: Change WeatherStation value in config part of weatherwidget.js
 - Q: WTF?
   A: IDK!

-------------------------------------------------------------------------------------

This program is based upon Highcharts (http://www.highcharts.com/), jQuery (http://jquery.com/) and JQuery UI (http://jqueryui.com/).

-------------------------------------------------------------------------------------