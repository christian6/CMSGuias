// Generated by CoffeeScript 1.7.1
var changeSearch, getSearch, openWindow;

$(document).ready(function() {
  $("input[name=star],input[name=end]").datepicker({
    dateFormat: "yy-mm-dd",
    showAnim: "slide"
  });
  $("input[name=search]").on("change", changeSearch);
  $(".btn-search").on("click", getSearch);
  $(document).on("click", ".btn-purchase", openWindow);
});

changeSearch = function() {
  if (this.checked) {
    if (this.value === "status") {
      $("input[name=star],input[name=end],input[name=code]").attr("disabled", true);
      $("select[name=status]").attr("disabled", false);
      return;
    } else if (this.value === "dates") {
      $("input[name=star],input[name=end]").attr("disabled", false);
      $("select[name=status],input[name=code]").attr("disabled", true);
      return;
    } else if (this.value === "code") {
      $("input[name=star],input[name=end],select[name=status]").attr("disabled", true);
      $("input[name=code]").attr("disabled", false);
      return;
    }
  }
};

getSearch = function() {
  $("input[name=search]").each(function(index, element) {
    var data, end, start;
    if (element.checked) {
      data = new Object();
      if (element.value === "code") {
        if ($("input[name=code]").val() !== "") {
          data.code = $("input[name=code]").val();
          data.pass = true;
        } else {
          data.pass = false;
          $().toastmessage("showWarningToast", "campo de estado se encuntra vacio.");
        }
      } else if (element.value === "status") {
        if ($("select[name=status]").val() !== "") {
          data.status = $("select[name=status]").val();
          data.pass = true;
        } else {
          data.pass = false;
          $().toastmessage("showWarningToast", "campo de estado se encuntra vacio.");
        }
      } else if (element.value === "dates") {
        start = $("input[name=star]").val();
        if (start !== "") {
          data.dates = true;
          data.start = start;
          data.pass = true;
        } else {
          data.pass = false;
          $().toastmessage("showWarningToast", "campo de fecha inicio se encuntra vacio.");
        }
        end = $("input[name=end]").val();
        if (end !== "") {
          data.end = end;
        }
      }
      console.log(data);
      if (data.pass) {
        $.getJSON("", data, function(response) {
          var $tb, template, x;
          if (response.status) {
            template = "<tr> <td>{{ item }}</td> <td>{{ purchase }}</td> <td>{{ document }}</td> <td>{{ transfer }}</td> <td>{{ currency }}</td> <td><a class=\"text-black\" target=\"_blank\" href=\"/media/{{ deposito }}\"><span class=\"glyphicon glyphicon-file\"></span></a></td> <td><button value=\"{{ purchase }}\" class=\"btn btn-xs btn-link text-black btn-purchase\"><span class=\"glyphicon glyphicon-list\"></span></a></td> </tr>";
            $tb = $("table > tbody");
            $tb.empty();
            for (x in response.list) {
              response.list[x].item = parseInt(x) + 1;
              $tb.append(Mustache.render(template, response.list[x]));
            }
          }
        });
      }
    }
  });
};

openWindow = function() {
  window.open("/reports/order/purchase/" + this.value + "/", "_blank");
};
