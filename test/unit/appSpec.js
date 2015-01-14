'use strict';

/* jasmine specs for controllers go here */
describe('CatalogApp controllers', function() {

  beforeEach(module('catalogApp'));

  describe('CatalogCtrl', function(){
    var scope, $httpBackend, ctrl,
        catalogData = function() {
          return {
            items: [
              {
                "name": "Search engines",
                "items": [
                  {"name": "Google", "url": "http://google.com"},
                  {
                    "name": "Others",
                    "items": [
                      {"name": "Link to yahoo", "url": "http://yahoo.com"},
                      {"name": "Link to yandex", "url": "http://yandex.ru"}
                    ]
                  }
                ]
              },
              {
                "name": "Tut.by",
                "url": "http://tut.by"
              }
            ]
          }
        };


    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('data/catalog.json').respond(catalogData());
      scope = $rootScope.$new();
      ctrl = $controller('CatalogCtrl', {$scope: scope});
    }));

    it('checks initial scope', function () {
      expect(scope.breadcrumbs.length).toEqual(1);
      expect(scope.breadcrumbs[0].name).toEqual('Catalog');
    });

    it('should fetch catalog', function() {
      expect(scope.items).toBeUndefined();
      $httpBackend.flush();

      expect(scope.items).toEqual(catalogData().items);
    });

    describe('Tests scope methods', function () {
      beforeEach(function () {
        $httpBackend.flush();
        spyOn(window, 'open');
      });
      afterEach(function () {
        //window.open.restore();
      });

      it('should navigate to Search engines category', function () {
        scope.item = scope.items[0];
        scope.browseCategory();
        expect(scope.items).toEqual(catalogData().items[0].items);
      });

      it('should navigate in categories', function () {
        scope.item = scope.items[0];
        scope.browseCategory();
        expect(scope.items).toEqual(catalogData().items[0].items);

        scope.item = scope.items[1];
        scope.browseCategory();
        expect(scope.items).toEqual(catalogData().items[0].items[1].items);
      });

      it('should navigate to correct category via breadcrumbs', function () {
        // browse category
        var category1 = scope.items[0];
        scope.item = category1;
        scope.browseCategory();
        expect(scope.breadcrumbs.length).toEqual(2);
        expect(scope.breadcrumbs[1]).toEqual(category1);

        // browse deeper category
        var category2 = scope.items[0];
        scope.item = category2;
        scope.browseCategory();
        expect(scope.breadcrumbs[2]).toEqual(category2);

        // click on category1 breadcrumb
        scope.breadcrumb = scope.breadcrumbs[1];
        scope.onBreadcrumbClick();
        expect(scope.breadcrumbs.length).toEqual(2);
        expect(scope.breadcrumbs[1]).toEqual(category1);

        // click on root breadcrumb
        scope.breadcrumb = scope.breadcrumbs[0];
        scope.onBreadcrumbClick();
        expect(scope.breadcrumbs.length).toEqual(1);
      });

      it('tests link click', function () {
        scope.item = scope.items[1];
        scope.openLink();
        expect(window.open).toHaveBeenCalledWith(scope.item.url);
      });
    });

  });
});
