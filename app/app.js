'use strict';

/* App Module */

var catalogApp = angular.module('catalogApp', []);

catalogApp.controller('CatalogCtrl', ['$scope', '$http',
  function($scope, $http) {

    var root = {name: 'Catalog'};
    $scope.breadcrumbs = [ root ];

    $http.get('data/catalog.json').success(function(data) {
      $scope.items = data.items;
      root.items = data.items;
    });

    $scope.browseCategory = function () {
      $scope.items = this.item.items;
      $scope.breadcrumbs.push(this.item);
    };

    $scope.openLink = function () {
      window.open(this.item.url);
    };

    $scope.onBreadcrumbClick = function () {
      $scope.items = this.breadcrumb.items;
      var position = $scope.breadcrumbs.indexOf(this.breadcrumb);
      $scope.breadcrumbs = $scope.breadcrumbs.slice(0, position + 1);
    };
  }]);
