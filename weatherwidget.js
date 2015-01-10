/**
 *
 * Weather Widget 1.3 for MChE
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
var today = new Date();
//Config
var METEO_JSON_URL = "http://149.156.109.35/meteo/rest/json/";
var WeatherStation = 's001'; //Default station
var ChartParameter = 'temp';
var ChartFrom = new Date(today.getTime() - 604800000).getTime();
var ChartTo = today.getTime();

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
        $('#ww-chart-menu-menu').text('☰ Więcej');
        AreOptionsVisible = false;
    }
    else {
        $('#ww-chart-menu-options').css('display', 'block');
        $('#ww-chart-menu-menu').text('☰ Ukryj');
        AreOptionsVisible = true;
        $('html').click(function(event) {
            if(!$(event.target).parents().andSelf().is("#ww-chart-menu-options") && !$(event.target).parents().andSelf().is("#ww-chart-menu-menu") && !$(event.target).parents().andSelf().is(".ui-datepicker") && !$(event.target).parents().andSelf().is(".ui-corner-all")) {
                ShowMenuOptions(false);
                $(this).unbind(event);
            }
        })
    }
}

function ShowMenu(bool) {
    if(bool) {$('#ww-chart-menu').css('display', 'block');}
    else {$('#ww-chart-menu').css('display', 'none');}
}

function GetLocationHash() {
    return {station: location.hash.substring(1).split('&')[0], parameter: location.hash.substring(1).split('&')[1], from: parseInt(location.hash.substring(1).split('&')[2]), to: parseInt(location.hash.substring(1).split('&')[3])};
}
function SetLocationHash() {
    location.hash = WeatherStation + '&' + ChartParameter + '&' + ChartFrom + '&' + ChartTo;
}

function SetChartDates() {
    var fromdate = $('#fromdate').val();
    var todate = $('#todate').val();
    ChartFrom = (new Date(fromdate.split('-')[0], fromdate.split('-')[1] - 1, fromdate.split('-')[2], 0,0,0,1)).getTime();
    ChartTo = (new Date(todate.split('-')[0], todate.split('-')[1] - 1, todate.split('-')[2], 0,0,0,1)).getTime();
    LoadChart();
}

function DrawChart(chartdata) {
    var charttitle = '';
    var charttype = 'line';
    var YAxis = {
        labels: {
            format: '{value}' + parameters[ChartParameter].unit
        }};
    if(ChartParameter==='winds'){
        YAxis = {
            labels: {
                format: '{value}' + parameters[ChartParameter].unit
            },
            min: 0
        };
    }
    if (ChartParameter == 'rain1') {
        charttype = 'column';
    }
    if (chartdata.length > 0) {
        charttitle = parameters[ChartParameter].name;
        ShowMenu(true);
        var fdate = new Date(ChartFrom); var tdate = new Date(ChartTo);
        $('#fromdate').datepicker({dateFormat: "yy-mm-dd", firstDay: 1}).val(fdate.getFullYear() + '-' + ('0' + (fdate.getMonth()+1)).slice(-2) + '-' + ('0' + fdate.getDate()).slice(-2));
        $('#todate').datepicker({dateFormat: "yy-mm-dd", firstDay: 1}).val(tdate.getFullYear() + '-' + ('0' + (tdate.getMonth()+1)).slice(-2) + '-' + ('0' + tdate.getDate()).slice(-2));

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
            valueSuffix: parameters[ChartParameter].unit
        },
        series: [{
            type: charttype,
            name: parameters[ChartParameter].name,
            data: chartdata,
            tooltip: {
                valueDecimals: 1
            }
        }]
    });
    $('#ww-download').html('<a href="' + ExportAsCSV(chartdata, ChartParameter) + '" target="_blank" download="' + ChartParameter + '.csv" >Pobierz jako CSV</a>');
}


function LoadChartData(chartdata, from, to, part, of) {
    var fromd = new Date(from);
    var tod = new Date(Math.min(to, from + 2678400000));
    var fromstr = '' + fromd.getFullYear() + '-' + ('0' + (fromd.getMonth() + 1)).slice(-2) + '-' + ('0' + fromd.getDate()).slice(-2);
    var tostr = '' + tod.getFullYear() + '-' + ('0' + (tod.getMonth() + 1)).slice(-2) + '-' + ('0' + tod.getDate()).slice(-2);

    $.getJSON(METEO_JSON_URL + parameters[ChartParameter].long + '/' + WeatherStation + '/' + fromstr + '/' + tostr, function (json) {
        if(json.length>2) {
            if (ChartParameter === 'rain1') {
                var lasthour = ParseDate(json[1].time).getHours();
                $.each(json, function (index, value) {
                    var x = ParseDate(value.time);
                    if (lasthour != x.getHours()) {
                        lasthour = x.getHours();
                        var y = parseFloat(value.data[parameters[ChartParameter].short]);
                        if(!isNaN(y) && !isNaN(x.getTime())) {chartdata.push([x.getTime(), y]);}
                    }
                });
            }

            else if (ChartParameter == 'cloudh') {
                $.each(json, function (index, value) {

                    var x = ParseDate(value.time);
                    var y = Math.round(((parseFloat(value.data[parameters.temp.short]) - parseFloat(value.data[parameters.temp0.short])) * 125) + parseFloat(value.data.h0));
                    if(!isNaN(y) && !isNaN(x.getTime())) {chartdata.push([x.getTime(), y]);}
                });
            }

            else {
                $.each(json, function (index, value) {

                    var x = ParseDate(value.time);
                    var y = parseFloat(value.data[parameters[ChartParameter].short]);
                    if(!isNaN(y) && !isNaN(x.getTime())) {chartdata.push([x.getTime(), y]);}
                });
            }
        }
            if (part == of) {
                DrawChart(chartdata);
            }
            else {
                $('#ww-chart').html('<div class="ww-loading"><div>Wczytuję dane... ' + (Math.round(part / of * 100)) + '%</div>');
                LoadChartData(chartdata, from + 2764800000, to, (part + 1), of);
            }
        });
}

function GetChart(parameter) {
    if (parameter !== undefined) {ChartParameter = parameter;}
    LoadChart();
}

function LoadChart() {
    var chartdata = [];
    SetLocationHash(WeatherStation, ChartParameter, ChartFrom, ChartTo);
    $('#ww-chart').html('<div class="ww-loading"><div>Wczytuję dane...</div>');
    ShowMenu(false);
    ShowMenuOptions(false);
    $('#ww-download').html('');
    LoadChartData(chartdata, ChartFrom, ChartTo, 1, Math.floor((ChartTo - ChartFrom)/2678400000) + 1);
}

function ExportAsCSV (chartdata, parameter) {
    var csv = 'sep=;\r\nData pomiaru;' + parameters[parameter].name + ';Jednostka\r\n';
    $.each(chartdata, function(index, value) {
        var date = new Date(value[0]);
        csv += date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + ';' + ('' + value[1]).replace('.', ',') + ';' + parameters[parameter].unit + '\r\n';
    });
    //csvData = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var csvData = new Blob([csv], { type: 'text/csv' });
    return URL.createObjectURL(csvData);
}


function LoadWeatherWidget() {
    if (location.hash.length > 2) {
        var settings = GetLocationHash();
        WeatherStation = settings.station;
        ChartParameter = settings.parameter;
        ChartFrom = settings.from;
        ChartTo = settings.to;
    }
    GetStationList();
    GetCurrentWeather(true);
    GetChart();
    setInterval('GetCurrentWeather(false);', 60000);
}

$(document).ready(LoadWeatherWidget());

