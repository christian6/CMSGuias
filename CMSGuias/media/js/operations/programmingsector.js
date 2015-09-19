var app, byte2Hex, hextorbga, rgbtohex;

app = angular.module('programingApp', ['ngCookies']).config(function($httpProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

app.controller('programingCtrl', function($scope, $http, $cookies) {
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  $scope.group = {
    rgba: ""
  };
  angular.element(document).ready(function() {
    $('.modal-trigger').leanModal();
  });
  $scope.$watch('group.colour', function(val, old) {
    $scope.group.rgba = hextorbga(val, 0.5);
  });
  $scope.saveGroup = function() {
    var data;
    data = $scope.group;
    data.saveg = true;
    $http({
      url: '',
      method: 'post',
      data: $.param(data)
    }).success(function(response) {
      if (response.status) {
        swal({
          title: "Felicidades",
          text: "se guardo los datos correctamente.",
          type: "success",
          timer: 2600
        });
      } else {
        swal("Error", "no se a guardado los datos. " + response.raise, "error");
      }
    });
  };
  $scope.listGroup = function() {
    var data;
    data = {
      'listg': true
    };
    $http.get('', {
      params: data
    }).success(function(response) {
      if (response.status) {
        $scope.sglist = response.sg;
        $("#mlgroup").openModal();
        setTimeout(function() {
          return $('.dropdown-button').dropdown();
        }, 800);
      } else {
        swal("Error!", "No se han obtenido datos. " + response.raise, "error");
      }
    });
  };
  $scope.showESG = function() {
    console.log(this.$parent.x.fields.colour);
    console.log(rgbtohex(this.$parent.x.fields.colour));
    $scope.group = {
      sgroup_id: this.$parent.x.pk,
      name: this.$parent.x.fields.name,
      colour: rgbtohex(this.$parent.x.fields.colour),
      observation: this.$parent.x.fields.observation
    };
    $("#mgroup").openModal();
  };
  $scope.editGroup = function() {
    var data;
    data = {
      saveg: true
    };
    $http({
      url: '',
      data: $.param(data),
      method: 'post'
    }).success(function(response) {
      if (response.status) {

      } else {
        swal("Error", "Error al guardar los datos. " + response.raise, "error");
      }
    });
  };
});

hextorbga = function(hex, alf) {
  var b, g, r;
  if (alf == null) {
    alf = 1;
  }
  if (typeof(hex) == "undefined"){
    hex = ""
  };
  if (hex.charAt(0) === "#") {
    hex = hex.substring(1, 7);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alf + ")";
  } else {
    return hex;
  }
};

rgbtohex = function(rgb) {
  var array, b, g, r;
  if (typeof rgb !== "undefined" && rgb.length > 9) {
    array = rgb.split(',');
    r = parseInt(array[0].split('(')[1]);
    g = parseInt(array[1]);
    b = parseInt(array[2]);
    return "#" + (byte2Hex(r)) + (byte2Hex(g)) + (byte2Hex(b));
  } else {
    console.log("nothing rgba");
  }
};

byte2Hex = function(n) {
  var nybHexString;
  nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
};
