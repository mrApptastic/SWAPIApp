var starWarsApp = angular.module("starWarsApp", ["ngRoute", "ngAnimate", "starWarsText", "mrMr", "ui.bootstrap"]);

var appVersion = 1;

starWarsApp.run(function ($rootScope) {
    /* Quick fix for global scope issue when changing page */
	$rootScope.refresh = function() {
        window.onkeydown = null;
        window.onmouseenter = null;
        window.onmouseleave = null;
        window.onmousemove = null;
        window.onkeyup = null;
    };
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
            <div id="StarWarsTextContainer">
            <star-wars-text title="Star Wars API" sub-title="Test application" lines="
            <p>This is a test application only intended for demonstration of my skills. Hopefully, you'll enjoy it.</p>
            <p>Henrik Beske, 3-6-2019</p>">
            </star-wars-text>
            </div>
        `,  
            controller: "mainController"
        })
        .when("/characters", {
            template: `
            <div class="container" >
            <div class="row">
                <div class="col-md-6">
            <form
                ng-submit="getCharacters()">
                <input class="input-lg form-control" ng-model="searchText" type="text" ng-blur="getCharacters()" placeholder="Search For Characters" />
            </form>
                </div>
                <div class="col-md-6">
                    <select class="form-control" ng-model="selectedYear">
                        <option value="32 BBY">Episode I: The Phantom Menace</option>
                        <option value="22 BBY">Episode II: Attack of the Clones</option>
                        <option value="19 BBY">Episode III: Revenge of the Sith</option>
                        <option value="0 BBY">Episode IV: A New Hope</option>
                        <option value="3 ABY">Episode V: The Empire Strikes Back</option>
                        <option value="4 ABY">Episode VI: Return of the Jedi</option>
                        <option value="34 ABY">Episode VII: The Force Awakens</option>
                        <option value="34 ABY">Episode VIII: The Last Jedi</option>
                    </select>
                </div>
            </div>
            <div class="container" ng-show="loadingCharacters">
                 <br/>
                 <mrspin color="#C6BA73" size="100"></mrspin>
            </div>
            <div ng-show="!loadingCharacters">
             <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>BMI</th>
                    <th>BMR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="character in characters" data-toggle="modal" data-target="#characterModal" ng-click="changeCharacter(character)">
                    <td ng-bind="character.name"></td>
                    <td ng-bind="character.height"></td>
                    <td ng-bind="character.mass"></td>
                    <td class="text-center">
                        <i class="fa" ng-class="character.gender == 'female' ? 'fa-venus' : 'fa-mars'" aria-hidden="true"></i>
                    </td>
                    <td ng-bind="character.age = getAge(character.birth_year)"></td>
                    <td ng-bind="character.bmi = (!isNaN(character.mass) ? (character.mass) : 1) | BMIFilter : character.height"></td>
                    <td ng-bind="character.bmr = character.age | BMRFilter : (character.gender == 'female') : (!isNaN(character.mass) ? (character.mass) : 1) : character.height""></td>
                  </tr>
                </tbody>
              </table>
              <ul uib-pagination total-items="totalCharacters" ng-model="selectedCharacterPage" max-size="10" class="pagination-sm" boundary-link-numbers="true" rotate="false" ng-click="getCharacters()"></ul>
              <div class="modal" id="characterModal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" ng-bind="selectedCharacter.name"></h4>
                      <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <div class="modal-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Height</td>
                            <td ng-bind="selectedCharacter.height"></td>
                          </tr>
                         <tr>
                            <td>Weight</td>
                            <td ng-bind="selectedCharacter.mass"></td>
                          </tr>
                          <tr>
                            <td>Gender</td>
                            <td ng-bind="selectedCharacter.gender"></td>
                          </tr>
                          <tr>
                            <td>Year Of Birth</td>
                            <td ng-bind="selectedCharacter.birth_year"></td>
                          </tr>
                          <tr>
                            <td>Hair</td>
                            <td ng-bind="selectedCharacter.hair_color"></td>
                          </tr>
                          <tr>
                            <td>Eyes</td>
                            <td ng-bind="selectedCharacter.eye_color"></td>
                          </tr>              
                          <tr>
                            <td>Skin</td>
                            <td ng-bind="selectedCharacter.skin_color"></td>
                          </tr>                                                                                          
                        </tbody
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        `,  
            controller: "characterController"
        })
        .when("/species", {
            template: `
            <div class="container" >
            <div class="row">
                <div class="col-md-12">
            <form
                ng-submit="getSpecies()">
                <input class="input-lg form-control" ng-model="searchText" type="text" ng-blur="getSpecies()" placeholder="Search For Species" />
            </form>
                </div>
            </div>
            <div class="container" ng-show="loadingSpecies">
                 <br/>
                 <mrspin color="#C6BA73" size="100"></mrspin>
            </div>
            <div ng-show="!loadingSpecies">
             <table class="table" >
             <thead>
             <tr>
               <th>Name</th>
               <th>Average Lifespan</th>
               <th>Language</th>
               <th>Classification</th>
               <th>Designation</th>
             </tr>
           </thead>
           <tbody>
             <tr ng-repeat="specie in species" data-toggle="modal" data-target="#specieModal" ng-click="changeSpecie(specie)">
               <td ng-bind="specie.name"></td>
               <td ng-bind="specie.average_lifespan"></td>
               <td ng-bind="specie.language"></td>
               <td ng-bind="specie.classification"></td>
               <td ng-bind="specie.designation"></td>
             </tr>
           </tbody>
              </table>
              <ul uib-pagination total-items="totalSpecies" ng-model="selectedSpeciesPage" max-size="10" class="pagination-sm" boundary-link-numbers="true" rotate="false" ng-click="getSpecies()"></ul>
              <div class="modal" id="specieModal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" ng-bind="selectedSpecie.name"></h4>
                      <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <div class="modal-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Classification</td>
                            <td ng-bind="selectedSpecie.classification"></td>
                          </tr>
                        </tbody
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        `,  
            controller: "speciesController"
        })
        .when("/vehicles", {
            template: `
            <div class="container" >
            <div class="row">
                <div class="col-md-12">
            <form
                ng-submit="getVehicles()">
                <input class="input-lg form-control" ng-model="searchText" type="text" ng-blur="getVehicles()" placeholder="Search For Vehicles" />
            </form>
                </div>
            </div>
            <div class="container" ng-show="loadingVehicles">
                 <br/>
                 <mrspin color="#C6BA73" size="100"></mrspin>
            </div>
            <div ng-show="!loadingVehicles">
             <table class="table" >
             <thead>
             <tr>
               <th>Name</th>
               <th>Model</th>
               <th>Manufacturer</th>
               <th>Passengers</th>
               <th>Max. Speed</th>
             </tr>
           </thead>
           <tbody>
             <tr ng-repeat="vehicle in vehicles" data-toggle="modal" data-target="#vehicleModal" ng-click="changeVehicle(vehicle)">
               <td ng-bind="vehicle.name"></td>
               <td ng-bind="vehicle.model"></td>
               <td ng-bind="vehicle.manufacturer"></td>
               <td ng-bind="vehicle.passengers"></td>
               <td ng-bind="vehicle.max_atmosphering_speed"></td>
             </tr>
           </tbody>
              </table>
              <ul uib-pagination total-items="totalVehicles" ng-model="selectedVehiclesPage" max-size="10" class="pagination-sm" boundary-link-numbers="true" rotate="false" ng-click="getVehicles()"></ul>
              <div class="modal" id="vehicleModal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" ng-bind="selectedVehicle.name"></h4>
                      <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <div class="modal-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Model</td>
                            <td ng-bind="selectedVehicle.model"></td>
                          </tr>
                        </tbody
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        `,  
            controller: "vehicleController"
        })
        .when("/starships", {
            template: `
            <div class="container" >
            <div class="row">
                <div class="col-md-12">
            <form
                ng-submit="getStarships()">
                <input class="input-lg form-control" ng-model="searchText" type="text" ng-blur="getStarships()" placeholder="Search For Starships" />
            </form>
                </div>
            </div>
            <div class="container" ng-show="loadingStarships">
                 <br/>
                 <mrspin color="#C6BA73" size="100"></mrspin>
            </div>
            <div ng-show="!loadingStarships">
             <table class="table" >
             <thead>
             <tr>
               <th>Name</th>
               <th>Model</th>
               <th>Manufacturer</th>
               <th>Passengers</th>
               <th>Max. Speed</th>
             </tr>
           </thead>
           <tbody>
             <tr ng-repeat="starship in starships" data-toggle="modal" data-target="#starshipModal" ng-click="changeStarship(starship)">
               <td ng-bind="starship.name"></td>
               <td ng-bind="starship.model"></td>
               <td ng-bind="starship.manufacturer"></td>
               <td ng-bind="starship.passengers"></td>
               <td ng-bind="starship.max_atmosphering_speed"></td>
             </tr>
           </tbody>
              </table>
              <ul uib-pagination total-items="totalStarships" ng-model="selectedStarshipPage" max-size="10" class="pagination-sm" boundary-link-numbers="true" rotate="false" ng-click="getStarships()"></ul>
              <div class="modal" id="starshipModal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" ng-bind="selectedStarship.name"></h4>
                      <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <div class="modal-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Model</td>
                            <td ng-bind="selectedStarship.model"></td>
                          </tr>
                        </tbody
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        `,  
            controller: "starShipController"
        })
        .when("/planets", {
            template: `
            <div class="container" >
            <div class="row">
                <div class="col-md-12">
            <form
                ng-submit="getPlanets()">
                <input class="input-lg form-control" ng-model="searchText" type="text" ng-blur="getPlanets()" placeholder="Search For Planets" />
            </form>
                </div>
            </div>
            <div class="container" ng-show="loadingPlanets">
                 <br/>
                 <mrspin color="#C6BA73" size="100"></mrspin>
            </div>
            <div ng-show="!loadingPlanets">
             <table class="table" >
             <thead>
             <tr>
               <th>Name</th>
               <th>Rotation Period</th>
               <th>Orbital Period</th>
               <th>Diameter</th>
               <th>Population</th>
             </tr>
           </thead>
           <tbody>
            <tr ng-repeat="planet in planets" data-toggle="modal" data-target="#planetModal" ng-click="changePlanet(planet)">
               <td ng-bind="planet.name"></td>
               <td ng-bind="planet.rotation_period"></td>
               <td ng-bind="planet.orbital_period"></td>
               <td ng-bind="planet.diameter"></td>
               <td ng-bind="planet.population"></td>
             </tr>
           </tbody>
              </table>
              <ul uib-pagination total-items="totalPlanets" ng-model="selectedPlanetsPage" max-size="10" class="pagination-sm" boundary-link-numbers="true" rotate="false" ng-click="getPlanets()"></ul>
              <div class="modal" id="planetModal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" ng-bind="selectedPlanet.name"></h4>
                      <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <div class="modal-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Rotation Period</td>
                            <td ng-bind="selectedPlanet.rotation_period"></td>
                          </tr>
                        </tbody
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        `,  
            controller: "planetController"
        })
        .when("/movies", {
            template: `
            <div class="container" >
            <div class="container" ng-show="loadingMovies">
                 <br/>
                 <mrspin color="#C6BA73" size="100"></mrspin>
            </div>
            <div ng-show="!loadingMovies">
             <table class="table" >
             <thead>
             <tr>
               <th>Name</th>
               <th>Episode</th>
               <th>Director</th>
               <th>Producer</th>
               <th>Release_date</th>
             </tr>
           </thead>
           <tbody>
           <tr ng-repeat="movie in movies" data-toggle="modal" data-target="#movieModal" ng-click="changeMovie(movie)">
               <td ng-bind="movie.title"></td>
               <td ng-bind="movie.episode_id"></td>
               <td ng-bind="movie.director"></td>
               <td ng-bind="movie.producer"></td>
               <td ng-bind="movie.release_date"></td>
             </tr>
           </tbody>
              </table>
            <div class="modal" id="movieModal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" ng-bind="selectedMovie.title"></h4>
                      <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <div class="modal-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Director</td>
                            <td ng-bind="selectedMovie.director"></td>
                          </tr>
                        </tbody
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

        `,  
            controller: "movieController"
        })
        .when("/stats", {
            template: `
            <div id="filmGraph"></div>
        `,  
            controller: "statController"
        })
        .when("/funstuff", {
            template: `
            <div class="container-fluid" id="mrSnakeyContainer">
            <canvas id="mrSnakey"></canvas>
            <canvas id="canvasBanditten" style="background: url('Media/MosEisley-celebration.png'); background-position: center top; background-size: auto 100%"></canvas>
            <div id="toolUha" style="width: calc(100% + 30px);background: var(--main-color-1);padding: 5px;"></div>
            </div>
        `,  
            controller: "funController"
        });
        //.when("/news", {
        //    templateUrl: "/Home/News?v=" + appVersion,
        //    controller: "newsController"
        //});
        

}]);

starWarsApp.controller("mainController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.refresh();
}]);

starWarsApp.controller("characterController", ["$scope", "$rootScope", "dataService", "$rootScope", function ($scope, $rootScope, dataService, $rootScope) {
    $rootScope.refresh();
    $scope.loadingCharacters = true;  
    $scope.selectedCharacterPage = 1;
    $scope.searchText = "";
    $scope.selectedYear = "0 BBY";
    $scope.getCharacters = function () {
        dataService.getAllCharacters($scope.selectedCharacterPage, $scope.searchText).then(function(response) {
            $scope.totalCharacters = response.data.count;
            $scope.characters = response.data.results;
        }).finally(function() {
            $scope.loadingCharacters = false;     
        });
    };
    $scope.getCharacters();
    $scope.getAge = function (year) {
        currentYear = parseInt(($scope.selectedYear.indexOf("BBY") !== -1 ? "-" : "") + $scope.selectedYear);
        yearOfBirth = parseInt((year.indexOf("BBY") !== -1 ? "-" : "") + year);
        var age = (currentYear - yearOfBirth);
        if (!isNaN(age)) {
            return age;
        }
        else {
            return "Unknown";
        }
        
    };
    $scope.changeCharacter = function (character) {
      $scope.selectedCharacter = character;
    };
}]);

starWarsApp.controller("speciesController", ["$scope", "$rootScope", "dataService", "$rootScope", function ($scope, $rootScope, dataService, $rootScope) {
    $rootScope.refresh();
    $scope.loadingSpecies = true;		
    $scope.selectedSpeciesPage = 1;
    $scope.searchText = "";
    $scope.getSpecies = function() {
        dataService.getAllRaces($scope.selectedSpeciesPage, $scope.searchText).then(function(response) {
            $scope.totalSpecies = response.data.count;
            $scope.species = response.data.results;
        }).finally(function() {
            $scope.loadingSpecies = false;      
        });
    };
    $scope.getSpecies();
    $scope.changeSpecie = function (specie) {
      $scope.selectedSpecie = specie;
    };
}]);

starWarsApp.controller("vehicleController", ["$scope", "$rootScope", "dataService", "$rootScope", function ($scope, $rootScope, dataService, $rootScope) {
    $rootScope.refresh();
    $scope.loadingVehicles = true;       
    $scope.selectedVehiclesPage = 1;
    $scope.searchText = "";
    $scope.getVehicles = function() {
        dataService.getAllVehicles($scope.selectedVehiclesPage, $scope.searchText).then(function(response) {
            $scope.totalVehicles = response.data.count;
            $scope.vehicles = response.data.results;
        }).finally(function() {
            $scope.loadingVehicles = false;      
        });
    };
    $scope.getVehicles();
    $scope.changeVehicle = function (vehicle) {
      $scope.selectedVehicle = vehicle;
    };
}]);

starWarsApp.controller("starShipController", ["$scope", "$rootScope", "dataService", "$rootScope", function ($scope, $rootScope, dataService, $rootScope) {
    $rootScope.refresh();
    $scope.loadingStarships = true;       
    $scope.selectedStarshipPage = 1;
    $scope.searchText = "";
    $scope.getStarships = function() {
        dataService.getAllCrafts($scope.selectedStarshipPage, $scope.searchText).then(function(response) {
            $scope.totalStarships = response.data.count;
            $scope.starships = response.data.results;
        }).finally(function() {
            $scope.loadingStarships = false;      
        });
    };
    $scope.getStarships();
    $scope.changeStarship = function (starship) {
      $scope.selectedStarship = starship;
    };
}]);

starWarsApp.controller("planetController", ["$scope", "$rootScope", "dataService", "$rootScope", function ($scope, $rootScope, dataService, $rootScope) {
    $rootScope.refresh();
    $scope.loadingPlanets = true;       
    $scope.selectedPlanetsPage = 1;
    $scope.searchText = "";
    $scope.getPlanets = function() {
        dataService.getAllPlanets($scope.selectedPlanetsPage, $scope.searchText).then(function(response) {
            $scope.totalPlanets = response.data.count;
            $scope.planets = response.data.results;
        }).finally(function() {
            $scope.loadingPlanets = false;      
        });
    };
    $scope.getPlanets();
    $scope.changePlanet = function (planet) {
      $scope.selectedPlanet = planet;
    };
}]);

starWarsApp.controller("movieController", ["$scope", "$rootScope", "dataService", "$rootScope", function ($scope, $rootScope, dataService, $rootScope) {
    $rootScope.refresh();
    $scope.loadingMovies = true;       
    $scope.selectedMoviesPage = 1;
    $scope.searchText = "";
    $scope.getMovies = function() {
        dataService.getAllMovies($scope.selectedMoviesPage, $scope.searchText).then(function(response) {
            $scope.totalMovies = response.data.count;
            $scope.movies = response.data.results;
        }).finally(function() {
            $scope.loadingMovies = false;      
        });
    };
    $scope.getMovies();
    $scope.changeMovie = function (movie) {
      $scope.selectedMovie = movie;
    };
}]);

starWarsApp.controller("statController", ["$scope", "$rootScope", "dataService", "$rootScope", function ($scope, $rootScope, dataService, $rootScope) {
    $rootScope.refresh();
}]);

starWarsApp.controller("funController", ["$scope", "$rootScope", "$rootScope", function ($scope, $rootScope, $rootScope) {
    $rootScope.refresh();
    setTimeout(function() {
        var baseWidth = document.getElementById("mrSnakeyContainer").offsetWidth;
        var ib = new mrSnakey("mrSnakey", 
                              baseWidth, 
                              (baseWidth * 2/3));
        var bo = new captainCanvas("canvasBanditten", "toolUha");
        document.getElementById("canvasBanditten").width = baseWidth;
        document.getElementById("canvasBanditten").height = baseWidth * 2/3;
    }, 0);
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

            /*
            $.post( "test.php", function( error ) {

            });

            */
            console.log(error);
        }
    };
}]);

starWarsApp.service("messageService", [function () {
    this.success = function (body, title) {
        toastr.success(body, title, this.options);
    };
    this.warning = function (body, title) {
        toastr.warning(body, title, this.options);
    };
    this.error = function (body, title) {
        toastr.error(body, title, this.options);
    };
    this.info = function (body, title) {
        toastr.info(body, title, this.options);
    };
    this.confirm = function (body) {
        if (!body) {
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
    this.getAllCharacters = function (page, search) {
        return $http.get("https://swapi.co/api/people/?page=" + page + "&search=" + search)
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
    this.getAllCrafts = function (page, search) {
        return $http.get("https://swapi.co/api/starships/?page=" + page + "&search=" + search)
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
    this.getAllVehicles = function (page, search) {
        return $http.get("https://swapi.co/api/vehicles/?page=" + page + "&search=" + search)
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
    this.getAllPlanets = function (page, search) {
        return $http.get("https://swapi.co/api/planets/?page=" + page + "&search=" + search)
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
    this.getAllMovies = function (page, search) {
        return $http.get("https://swapi.co/api/films/?page=" + page + "&search=" + search)
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
    this.getAllRaces = function (page, search) {
        return $http.get("https://swapi.co/api/species/?page=" + page + "&search=" + search)
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

    /* jQuery Code for handling active classes on click */
    $('.navbar-nav .nav-link').click(function(){
        $('.navbar-nav .nav-link').removeClass('active');
        $(this).addClass('active');
    })
}]);