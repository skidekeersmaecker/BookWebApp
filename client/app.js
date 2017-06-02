var BookApp = angular.module('BookApp', []);

BookApp.controller('StartCtrl', [ '$scope', '$http', function ($scope, $http) {

  parseParams = function() {
    var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  };

  params = parseParams();
  
  $scope.name = "Name will be inflated here";
  if (params.access_token) {
    $http({
      method: 'GET',
      url: 'https://graph.facebook.com/v2.9/me?fields=id,name&access_token=' + params.access_token
    }).then(function (response) {
      $scope.name = response.data.name;
    }, function (err) {
      $scope.name = err;
    });
  }

//HIER DE APP ID IN PLAATSEN EN URL VAN WEBSITE OF LOCALHOST MET JUISTE POORT
  $scope.login = function() {
    window.location.href = "https://www.facebook.com/dialog/oauth?client_id=107479499800246&response_type=token&redirect_uri=http://localhost:3000/";
  };

  $http({
        method: 'GET',
        url: 'https://bookwebapp-248a4.firebaseio.com/gebruikers.json'
    }).then(function succesCallback(response) {
        console.log(response);
        $scope.gebruiker = response.data;
        console.log(response.data.naam);
    }), function errorCallback(response) {
        console.log(response);
    }

}]);

BookApp.controller("googlebooks", function ($scope, $http) {
    google.books.load();
    var viewer;
    defaultBook = '0486404374';
    $scope.inputisbn = '1448103703';

    function initialize() {
        getBook(defaultBook);
        viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
        viewer.load('ISBN:' + defaultBook);
    }

    google.books.setOnLoadCallback(initialize);

    $scope.loadBook = function () {
        newBook = $scope.inputisbn;
        getBook(newBook)
        console.log("isbn:" + $scope.inputisbn + " newBook:" + newBook);
        viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
        viewer.load('ISBN:' + newBook);
    }

    //GET CALL BOOK
    function getBook(book) {
        $http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + book).then(function (response) {
            $scope.book = response.data;
            console.log("BOOK: title: " + $scope.book.items[0].volumeInfo.title + " author: " + $scope.book.items[0].volumeInfo.authors[0]);
            $scope.titel = $scope.book.items[0].volumeInfo.title;
            $scope.auteur = $scope.book.items[0].volumeInfo.authors[0];
        });
    }
});
