var starWarsApp = angular.module("starWarsApp", ["ngRoute", "ngAnimate", "starWarsText", "mrMr"]);

var appVersion = 1;

starWarsApp.run(function ($rootScope) {
    // $rootScope.msg = "Hej hej" ;
});

starWarsApp.config(['$provide', '$routeProvider', function ($provide, $routeProvider) {

    $provide.decorator('$exceptionHandler', function ($delegate, errorService) {

        return function (exception, cause) {
            $delegate(exception, cause);
            errorService.logError("Totalt øv fejl!\r\n\r\nException:\r\n" + exception + "\r\n\r\nCause:\r\n" + cause);
        };
    });

    $routeProvider
        .when("/", {
            template: `
<h2 ng-bind="uha"></h2>
        `,  
            controller: "mainController"
        })
        //.when("/news", {
        //    templateUrl: "/Home/News?v=" + appVersion,
        //    controller: "newsController"
        //});
        

}]);

starWarsApp.controller("mainController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $scope.uha = "Star Wars - Uha!";
}]);

starWarsApp.service("errorService", ["messageService", function (messageService) {
    this.logError = function (exception, cause, message) {
        if (exception) {
            if (message) {
                messageService.error(message);
            } else if (exception) {
                if (exception.message) {
                    messageService.error(exception.message);
                } else if (exception.statusText) {
                    messageService.error(exception.statusText);
                } else {
                    messageService.error(exception);
                }
            }

            var error = {
                "Exception": exception,
                "Cause": cause,
                "Navigator": navigator
            };

            console.log(error);
        }
    };
}]);

starWarsApp.service("messageService", [function () {
    this.success = function (body, title) {
        alert(this.body); //toastr.success(body, title, this.options);
    };
    this.warning = function (body, title) {
        alert(this.body); //toastr.warning(body, title, this.options);
    };
    this.error = function (body, title) {
        alert(this.body); //toastr.error(body, title, this.options);
    };
    this.info = function (body, title) {
        alert(this.body); //toastr.info(body, title, this.options);
    };
    this.confirm = function (body) {
        if (body === undefined || body === null) {
            body = "Are you sure?";
        }
        return ok = confirm(body);
    };
    this.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}]);

starWarsApp.service("dataService", ["$http", "messageService", "errorService", function ($http, messageService, errorService) {
    this.getAllCharacters = function () {
        return $http.get("https://swapi.co/api/people/")
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getCharacter = function (id) {
        return $http.get("https://swapi.co/api/people/" + id)
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getAllCrafts = function () {
        return $http.get("https://swapi.co/api/starships/")
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getCraft = function (id) {
        return $http.get("https://swapi.co/api/starships/" + id)
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getAllVehicles = function () {
        return $http.get("https://swapi.co/api/vehicles/")
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getVehicle = function (id) {
        return $http.get("https://swapi.co/api/vehicles/" + id)
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getAllPlanets = function () {
        return $http.get("https://swapi.co/api/planets/")
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getPlanet = function (id) {
        return $http.get("https://swapi.co/api/planets/" + id)
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getAllMovies = function () {
        return $http.get("https://swapi.co/api/films/")
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getMovie = function (id) {
        return $http.get("https://swapi.co/api/films/" + id)
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getAllRaces = function () {
        return $http.get("https://swapi.co/api/species/")
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
    this.getRace = function (id) {
        return $http.get("https://swapi.co/api/species/" + id)
            .then(function (result) {
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };
}]);