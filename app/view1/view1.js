'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.calendar', 'angular-growl'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', 'growl', '$interval', function ($scope, growl, $interval) {

        $scope.eventName = '';
        $scope.eventDate = '';
        $scope.eventSTime = '';
        $scope.eventETime = '';
        $scope.selectedDate = '';
        $scope.events = [];
        $scope.FilteredEvents = $scope.events;
        $scope.nxtEvent = '';

        $scope.editItem = function (item) {
            item.editing = true;
        }

        $scope.doneEditing = function (item) {
            item.editing = false;
            const date = item.eventDate.split('/'),
                d = date[0],
                m = date[1],
                y = date[2];
            const Stime = new Date(y, m - 1, d, item.start.getHours(), item.start.getMinutes());
            const Etime = new Date(y, m - 1, d, item.end.getHours(), item.end.getMinutes());
            item.start = Stime;
            item.end = Etime;
            growl.info('Event Edited.', {title: 'Success!'});

        };

        $scope.addEvent = function () {

            if ($scope.eventName.length === 0 || $scope.eventDate.length === 0 || $scope.eventSTime.length === 0 || $scope.eventETime.length === 0) {
                window.alert("Please fill al the fields");
            } else {
                const date = $scope.eventDate,
                    d = date.getDate(),
                    m = date.getMonth(),
                    y = date.getFullYear();
                const Stime = new Date(y, m, d, $scope.eventSTime.getHours(), $scope.eventSTime.getMinutes());
                const Etime = new Date(y, m, d, $scope.eventETime.getHours(), $scope.eventETime.getMinutes());

                $scope.events.push({
                    'title': $scope.eventName,
                    'eventDate': date.toLocaleDateString(),
                    'eventStart': Stime.toLocaleTimeString(),
                    'eventEnd': Etime.toLocaleTimeString(),
                    'start': Stime,
                    'end': Etime,
                    className: ['text-white'],
                    editing: false
                });
                growl.success('Event added.', {title: 'Success!'});
            }
            $scope.eventName = '';
            $scope.eventDate = '';
            $scope.eventSTime = '';
            $scope.eventETime = '';
            $scope.selectedDate = '';

            showNotice();
        };

        function showNotice() {
            $scope.notice = $scope.events.length > 0;
            $scope.nxtEvent = 'Next event: ' + (($scope.events.sort((a, b) => a.start - b.start))[0]).title;
        }

        // watch for old events
        // setInterval(function(){
        //     const Etime = new Date();
        //     for (var i = 0; i < $scope.events.length; i++) {
        //         if ($scope.events[i].start - Etime < 0) {
        //             $scope.events.splice(i, 1);
        //         }
        //     }
        // }, 5000);
        // $scope.timerCount=0;
        // $scope.startTimer=function(){
        //     $interval(function(){
        //         console.log($scope.timerCount);
        //         $scope.timerCount++;
        //     },1000)
        // }
        $interval(function () {
                const Etime = new Date();
                for (var i = 0; i < $scope.events.length; i++) {
                    if ($scope.events[i].end - Etime < 0) {
                        $scope.events.splice(i, 1);
                    }
                }
            }
            , 1000)


        $scope.removeEvent = function (item) {
            for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.events[i]._id === item._id) {
                    $scope.events.splice(i, 1);
                }
            }
            growl.error('Event deleted.', {title: 'Success!'});

            showNotice();
        }
        $scope.$calendar = $('[ui-calendar]');

        var date = new Date(),
            d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();

        $scope.changeView = function (view) {
            $calendar.fullCalendar('changeView', view);
        };

        /* config object */
        $scope.uiConfig = {
            calendar: {
                lang: 'da',
                height: '100%',
                editable: true,
                timeFormat: 'HH:mm',
                header: {
                    //left: 'month basicWeek basicDay',
                    //center: 'title',
                    right: 'today prev,next'
                },
                eventClick: function (date, jsEvent, view) {
                    $scope.alertMessage = (date.title + ' was clicked ');
                },
                dayClick: function (date, jsEvent, view) {
                    var clickedDate = new Date(date);
                    $scope.selectedDate = clickedDate;
                    $scope.FilteredEvents = $scope.events.filter(event => (event.start.toLocaleDateString() === clickedDate.toLocaleDateString()));
                    if ($scope.FilteredEvents.length === 0) {
                        $scope.selectedDate = '';
                        $scope.FilteredEvents = $scope.events;
                    }
                },
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        // $scope.events = [{
        //     title: 'All Day Event',
        //     start: new Date(y, m, 1)
        // }, {
        //     title: 'Long Event',
        //     start: new Date(y, m, d - 5),
        //     end: new Date(y, m, d - 2)
        // }, {
        //     id: 999,
        //     title: 'Repeating Event',
        //     start: new Date(y, m, d - 3, 16, 0),
        //     allDay: false
        // }, {
        //     id: 999,
        //     title: 'Repeating Event',
        //     start: new Date(y, m, d + 4, 16, 0),
        //     allDay: false
        // }, {
        //     title: 'Birthday Party',
        //     start: new Date(y, m, d + 1, 19, 0),
        //     end: new Date(y, m, d + 1, 22, 30),
        //     allDay: false
        // }, {
        //     title: 'Click for Google',
        //     start: new Date(y, m, 28),
        //     end: new Date(y, m, 29),
        //     url: 'https://google.com/'
        // }];

        $scope.eventSources = [$scope.events];
    }]);

function callAtInterval() {
    console.log("Interval occurred");
}