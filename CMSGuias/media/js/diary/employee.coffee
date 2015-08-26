app = angular.module 'EmpApp', ['ngCookies', 'ngSanitize']
      .config ($httpProvider) ->
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
        $httpProvider.defaults.xsrfCookieName = 'csrftoken'
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
        return

app.controller "empCtrl", ($scope, $http, $cookies) ->
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  angular.element(document).ready ->
    console.log "ready"
    $('.datepicker').pickadate
      container: 'body'
      format: 'yyyy-mm-dd'
    $('.modal-trigger').leanModal()
    $(".modal.bottom-sheet").css "max-height", "60%"
    $scope.listEmployee()
    $scope.listCharge()
    return
  $scope.data = {}
  $scope.predicate = 'fields.firstname'
  $scope.listEmployee = ->
    $http.get '',
      params:
        'list': true
    .success (response) ->
      console.log response
      if response.status
        $scope.list = response.employee
        return
      else
        swal "Alerta!", "No se han encontrado datos.", "warning"
        return
    return
  $scope.listCharge = ->
    $http.get '/charge/',
      params:
        charge: true
    .success (response) ->
      if response.status
        $scope.charge = response.charge
        return
      else
        swal 'Alerta!', 'No se han encontrado datos', 'warning'
        return
    return
  $scope.saveEmployee = ->
    console.log $scope.employee
    if typeof($scope.employee.empdni_id) is "undefined"
      return false
    params = $scope.employee
    params.save = true
    $http
      url: ''
      method: 'post'
      data: $.param params
    .success (response) ->
      if response.status
        $scope.listEmployee()
        $("#madd").closeModal()
        return
      else
        swal 'Error', 'error al guardar los cambios.', 'error'
        return
    return
  $scope.edit = ->
    $scope.employee =
      empdni_id: this.x.pk
      firstname: this.x.fields.firstname
      lastname: this.x.fields.lastname
      birth: this.x.fields.birth
      email: this.x.fields.email
      address: this.x.fields.address
      phone: this.x.fields.phone
      phonejob: this.x.fields.phonejob
      fixed: this.x.fields.fixed
    $("[name=charge]").val this.x.fields.charge
    $("#madd").openModal()
    return
  return