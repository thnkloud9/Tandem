(function() {
  'use strict';

  /**
  * Constructor function for modal confirmations controllers.
  *
  * @class ModalCtrlConstructor
  * @param $scope {Object} AngularJS $scope object
  * @param $uibModalInstance {Object} AngularJS UI instance of the modal
  *     window the coontroller controls.
  * @param title {String} title of the modal window
  * @param text {String} text in the modal window's body
  */
  // XXX: this is defined as a variable, because there were *big* problems with
  // injecting controller as a dependency (and we need it to pass it as a
  // parameter to $modal.open())
  var ModalCtrlConstructor = function ($scope, $uibModalInstance, title, text) {

      $scope.title = title;
      $scope.text = text;

      /**
      * Closes the modal with a resolution of OK.
      * @method ok
      */
      $scope.ok = function () {
          $uibModalInstance.close(true);
      };

      /**
      * Closes the modal with a resolution of CANCEL.
      * @method ok
      */
      $scope.cancel = function () {
          $uibModalInstance.dismiss(false);
      };
  };

  // needed so that it works even when the code gets minified
  ModalCtrlConstructor.$inject = ['$scope', '$uibModalInstance', 'title', 'text'];


  /**
  * AngularJS Service for creating modal dialog instances.
  *
  * @class modalFactory
  */
  angular.module('app.modalFactory').factory('modalFactory', [
      '$uibModal',
      function ($uibModal) {

          return {
              /**
              * @class modalFactory
              */

              /**
              * Creates a new confirmation dialog instance.
              *
              * @class createConfirmInstance
              * @param title {String} title of the modal window
              * @param text {String} text in the modal window's body
              * @param isHeavy {Boolean} whether to create a "heavy" version
              *   of the confirmation dialog
              * @return {Object} AngularJS UI modal dialog instance
              */
              _createConfirmInstance: function (title, text, isHeavy) {
                  // this method, although "private", is publicly exposed in the
                  // factory object for easier testability
                  var templateUrl = isHeavy ?
                      'app/views/modals/confirm-heavy.html' :
                      'app/views/modals/confirm-light.html';

                  return $uibModal.open({
                      templateUrl: templateUrl,
                      controller: ModalCtrlConstructor,
                      backdrop: 'static',
                      keyboard: false,
                      resolve: {
                          title: function () {
                              return title;
                          },
                          text: function () {
                              return text;
                          }
                      }
                  });
              },

              /**
              * Opens a "light" confirmation dialog (generally used for
              * confirming non-critical actions).
              * @method confirmLight
              * @param title {String} title of the modal window
              * @param text {String} text in the modal window's body
              * @return {Object} modal dialog instance
              */
              confirmLight: function (title, text) {
                  return this._createConfirmInstance(title, text, false);
              },

              /**
              * Opens a "heavy" confirmation dialog (generally used for
              * confirming critical actions with major and/or irreversible
              * effects).
              * @method confirmHeavy
              * @param title {String} title of the modal window
              * @param text {String} text in the modal window's body
              * @return {Object} modal dialog instance
              */
              confirmHeavy:  function (title, text) {
                  return this._createConfirmInstance(title, text, true);
              },
          };

      }
  ]);
})();
