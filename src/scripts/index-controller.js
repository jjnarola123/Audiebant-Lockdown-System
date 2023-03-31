var app = angular.module('app', []);
app.controller('IndexController', function () {
    var vm = this;
    vm.speedModes = [
        {
            name: "MegaBits/seconds",
            value: "Mbps",
            toMbpsMultiplier: 1
        },
        {
            name: "MegaBytes/seconds",
            value: "MBps",
            toMbpsMultiplier: 8
        },
        {
            name: "KiloBits/seconds",
            value: "Kbps",
            toMbpsMultiplier: 1 / 1024
        },
        {
            name: "KiloBytes/seconds",
            value: "KBps",
            toMbpsMultiplier: 1 / 1024 * 8
        },
    ]
    //vm.speed = 0;
    vm.speedMode = vm.speedModes[0];
    vm.size = 0;

    vm.calculate = function () {
        if (vm.speed == 0 || vm.size == 0) {
            return null;
        }
        var sizeInMegaBits = vm.size * vm.sizeMode.toMbitsMultiplier;
        var speedInMbps = vm.speed * vm.speedMode.toMbpsMultiplier;
        var secs = sizeInMegaBits / speedInMbps;
        var t = vm.secondsToTime(secs);
        vm.res = t;
    };

    vm.onChange = function (f) {
        vm.res = null;
        f.$setPristine();
    };

    vm.onCalculate = function (f) {
        f.$submitted = true;
        if (f.$valid) {
            vm.calculate();
        }
    };

    vm.onReset = function (f) {
        f.$setPristine();
        vm.speed = 0;
        vm.speedMode = vm.speedModes[0];
        vm.size = 0;
        vm.sizeMode = vm.sizeModes[0];
        vm.res = null;
    };

    vm.secondsToTime = function (secs) {
        secs = Math.round(secs);
        var hours = Math.floor(secs / (60 * 60));

        var divisorForMinutes = secs % (60 * 60);
        var minutes = Math.floor(divisorForMinutes / 60);

        var divisorForSeconds = divisorForMinutes % 60;
        var seconds = Math.ceil(divisorForSeconds);

        var obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    };
});
app.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9.]/g, '');

                    if (digits.split('.').length > 2) {
                        digits = digits.substring(0, digits.length - 1);
                    }

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseFloat(digits);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});