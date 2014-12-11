/**
 *
 * Weather Widget 1.1 for MChE
 *
 # Copyright (c) 2014 Adam Pardyl

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
 */

//Config
var METEO_JSON_URL = "http://149.156.109.35/meteo/rest/json/";
var METEO_CSV_URL = "http://149.156.109.35/meteo/rest/csv/";
var WeatherStation = 's001'; //Default station
//Config

var parameters = {
    temp: {name: 'Temperatura', short: 'ta', long: 'temp', unit: '°C'},
    pres0: {name: 'Ciśnienie na poziomie morza', short: 'p0', long: 'pres0', unit: ' hPa'},
    humi: {name: 'Wilgotność', short: 'ha', long: 'humi', unit: '%'},
    temp0: {name: 'Temperatura punktu rosy', short: 't0', long: 'temp0', unit: '°C'},
    winds: {name: 'Prędkość wiatru', short: 'ws', long: 'winds', unit: ' m/s'},
    rain1: {name: 'Opad godzinowy', short: 'r1', long: 'rain1', unit: ' mm'},
    cloudh: {name: 'Wysokość podstawy chmur', short: 'all', long: 'all', unit: ' m n.p.m.'}
};
var IsHTMLLoaded = false;
var today = new Date();

function GetStationList() {
    $.getJSON(METEO_JSON_URL + "info", function (WeatherStatonsList) {
        $.each(WeatherStatonsList, function (index, value) {
                $('#ww-stationlistdropdown').append($('<option></option>').text(value.name).attr('value', value.station));
            }
        );
        $('#ww-stationlistdropdown').val(WeatherStation);
    })
}

function GetWeatherStation(station) {
    WeatherStation = station;
    GetCurrentWeather(true);
    if(location.hash.substring(1).split('&')[1] !== undefined) {
        GetChart(location.hash.substring(1).split('&')[1])
    }
    else {
    GetChart('temp');
    }
}

function GetCurrentWeather(refresh) {
    if (refresh) {
        $('#ww-current').html('');
        IsHTMLLoaded = false;
    }
    $.getJSON(METEO_JSON_URL + "last/" + WeatherStation, function (weather) {
        if (weather.length == 0) {
            $('#ww-current').html('<div class="ww-loading">Stacja niedostępna</div>');
            IsHTMLLoaded = false;
            return;
        }
        if (!IsHTMLLoaded) {
            $('#ww-current').html('<div id="ww-ta"></div><div class="ww-current-details"><div id="ww-p0"></div><div id="ww-ha"></div><div id="ww-ws"></div><div id="ww-wd"></div><div id="ww-wg"></div><div id="ww-t0"></div><div id="ww-ra"></div><div id="ww-r1"></div><div id="ww-wpch"></div></div><div id="ww-date"></div>');
            IsHTMLLoaded = true;
        }
        $('#ww-ta').text(weather[0].data.ta + '°C');
        $('#ww-p0').text('Ciśnienie na poziomie morza: ' + weather[0].data.p0 + ' hPa');
        $('#ww-ha').text('Wilgotność: ' + weather[0].data.ha + '%');
        $('#ww-ws').text('Prędkość wiatru: ' + weather[0].data.ws + ' m/s');
        var windspeed = parseFloat(weather[0].data.ws);
        if (windspeed == 0) {
            $('#ww-wd').text('Kierunek wiatru: -');
        }
        else {
            $('#ww-wd').text('Kierunek wiatru: ' + weather[0].data.wd + '°');
        }
        $('#ww-wg').text('Chwilowa prędkość wiatru: ' + weather[0].data.wg + ' m/s');
        $('#ww-t0').text('Temperatura punktu rosy: ' + weather[0].data.t0 + '°C');
        $('#ww-ra').text('Opad dobowy: ' + weather[0].data.ra + ' mm');
        $('#ww-r1').text('Opad w ostatniej godzinie: ' + weather[0].data.r1 + ' mm');
        if(weather[0].data.h0 == 'unknown' || weather[0].data.t0 == 'unknown' || weather[0].data.ta == 'unknown') {$('#ww-wpch').text('Wysokość podstawy chmur: brak danych');}
        else {$('#ww-wpch').text('Wysokość podstawy chmur: ' + (Math.round(((parseFloat(weather[0].data.ta) - parseFloat(weather[0].data.t0)) * 125) + parseFloat(weather[0].data.h0))) + ' m n.p.m.');}
        var wwdate = ParseDate(weather[0].time);
        if(wwdate.getDate() != today.getDate()) {$('#ww-date').css('color', 'red').html('Ostatni pomiar: ' + ('0' + wwdate.getHours()).slice(-2) + ':' + ('0' + wwdate.getMinutes()).slice(-2) + '&nbsp;  ' + ('0' + wwdate.getDate()).slice(-2) + '.' + ('0' + (wwdate.getMonth() + 1)).slice(-2) + '.' + wwdate.getFullYear());}
        else {$('#ww-date').html('Ostatni pomiar: ' + ('0' + wwdate.getHours()).slice(-2) + ':' + ('0' + wwdate.getMinutes()).slice(-2) + '&nbsp;  ' + ('0' + wwdate.getDate()).slice(-2) + '.' + ('0' + (wwdate.getMonth() + 1)).slice(-2) + '.' + wwdate.getFullYear());}
    });
}

function ParseDate(datestring) {
    var xstr = datestring.split(/[-: ]/);
    return new Date(xstr[0], xstr[1] - 1, xstr[2], xstr[3], xstr[4], xstr[5]);
}


var AreOptionsVisible = false;
function ShowMenuOptions(bool)
{
    if(bool !== undefined)
    {
        if(bool == AreOptionsVisible) { return; }
        else AreOptionsVisible = !(bool && !AreOptionsVisible);
    }
    if (AreOptionsVisible) {
        $('#ww-chart-menu-options').css('display', 'none');
        $('#ww-chart-menu').css('height', '-=40px');
        $('.ww-main').css('height', '-=40px');
        $('#weather-widget').css('height', '-=40px');
        AreOptionsVisible = false;
    }
    else {
        $('#ww-chart-menu-options').css('display', 'block');
        $('#ww-chart-menu').css('height', '+=40px');
        $('.ww-main').css('height', '+=40px');
        $('#weather-widget').css('height', '+=40px');
        AreOptionsVisible = true;
    }
}

function ShowMenu(bool) {
    if(bool) {$('#ww-chart-menu').css('display', 'block');}
    else {$('#ww-chart-menu').css('display', 'none');}
}

function GetChart(parameter) {
    location.hash = WeatherStation + '&' + parameter;
    $('#ww-chart').html('<div class="ww-loading"><div>Wczytuję dane...</div>');
    ShowMenu(false);
    ShowMenuOptions(false);
    $('#ww-download').html('');

    var chartdata = [];
    var lastweek = new Date(today.getTime() - 604800000);
    var lastweekstr = '' + lastweek.getFullYear() + '-' + ('0' + (lastweek.getMonth() + 1)).slice(-2) + '-' + ('0' + lastweek.getDate()).slice(-2);

    $.getJSON(METEO_JSON_URL + parameters[parameter].long + '/' + WeatherStation + '/' + lastweekstr, function (json) {
        if (parameter != 'cloudh') {$('#ww-download').html('<a href="' + METEO_CSV_URL + parameter  + '/' + WeatherStation + '/' + lastweekstr + '">Pobierz jako CSV</a>');}
        if (parameter === 'rain1') {
            var lasthour = ParseDate(json[1].time).getHours();
            $.each(json, function (index, value) {
                var x = ParseDate(value.time);
                if (lasthour != x.getHours()) {
                    lasthour = x.getHours();
                    var y = parseFloat(value.data[parameters[parameter].short]);
                    chartdata.push([x.getTime(), y]);
                }
            });
        }

        else if (parameter == 'cloudh') {
            $.each(json, function (index, value) {

                var x = ParseDate(value.time);
                var y = Math.round(((parseFloat(value.data[parameters.temp.short]) - parseFloat(value.data[parameters.temp0.short])) * 125) + parseFloat(value.data.h0));
                chartdata.push([x.getTime(), y]);
            });
        }

        else {
            $.each(json, function (index, value) {

                var x = ParseDate(value.time);
                var y = parseFloat(value.data[parameters[parameter].short]);
                chartdata.push([x.getTime(), y]);
            });
        }
        var charttitle = '';
        var charttype = 'line';
        var YAxis = {
            labels: {
                format: '{value}' + parameters[parameter].unit
            }};
        if(parameter==='winds'){
            YAxis = {
                labels: {
                    format: '{value}' + parameters[parameter].unit
                },
                min: 0
            };
        }
        if (parameter == 'rain1') {
            charttype = 'column';
        }
        if (json.length != 0) {
            charttitle = parameters[parameter].name;
            ShowMenu(true);
        }
        else {
            ShowMenu(false);
        }
        $('#ww-chart').highcharts('StockChart', {
            title: {
                text: charttitle
            },
            credits: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            yAxis: YAxis,
            xAxis: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%d.%m.%y',
                    week: '%d.%m',
                    month: '%m \'%y',
                    year: '%Y'
                }
            },
            tooltip: {
                valueSuffix: parameters[parameter].unit
            },
            series: [{
                type: charttype,
                name: parameters[parameter].name,
                data: chartdata,
                tooltip: {
                    valueDecimals: 1
                }
            }]
        });
    });

}

function LoadWeatherWidget() {
    var chartdef = 'temp';
    if (location.hash.length > 2) {
        WeatherStation = location.hash.substring(1).split('&')[0];
        if (location.hash.substring(1).split('&')[1] !== undefined) {
            chartdef = location.hash.substring(1).split('&')[1];
        }
    }

    GetStationList();
    GetCurrentWeather(true);
    GetChart(chartdef);
    setInterval('GetCurrentWeather(false);', 30000);
}

$(document).ready(LoadWeatherWidget());

