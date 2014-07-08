// Generated by CoffeeScript 1.7.1
(function() {
  var changeradio, searchquote, viewReport;

  $(document).ready(function() {
    $("[name=dates],[name=datee]").datepicker({
      "changeMonth": true,
      "changeYear": true,
      "showAnim": "slide",
      "dateFormat": "yy-mm-dd"
    });
    $("[name=search]").on("change", changeradio);
    $(".btn-search").on("click", searchquote);
    $(".btn-view").on("click", viewReport);
  });

  changeradio = function(event) {
    event.preventDefault();
    $(this).each(function() {
      if (this.checked) {
        if (this.value === "code") {
          $("[name=code]").attr("disabled", false);
          $("[name=dates],[name=datee]").attr("disabled", true);
        } else if (this.value === "dates") {
          $("[name=dates],[name=datee]").attr("disabled", false);
          $("[name=code]").attr("disabled", true);
        }
      }
    });
  };

  searchquote = function(event) {
    var data, pass;
    event.preventDefault();
    data = {};
    pass = false;
    $("[name=search]").each(function() {
      if (this.checked) {
        if (this.value === "code") {
          if ($("[name=code]").val() === "") {
            $("[name=code]").focus();
            $().toastmessage("showWarningToast", "Campo vacio, este campo no puede estar vacio.");
          } else {
            pass = true;
            data = {
              "by": "code",
              "code": $("[name=code]").val()
            };
          }
        } else if (this.value === "dates") {
          $("[name=dates],[name=datee]").each(function() {
            if (this.name === "datee") {
              data.datee = this.value;
              return true;
            }
            if (this.value === "") {
              this.focus();
              $().toastmessage("showWarningToast", "Campo vacio, este campo no puede estar vacio.");
              return false;
            } else {
              pass = true;
              data = {
                "by": "dates",
                "dates": this.value
              };
            }
          });
        }
      }
    });
    if (pass) {
      $.getJSON('', data, function(response) {
        var $tb, k, template;
        if (response.status) {
          template = "<tr>\n<td>{{ item }}</td>\n<td>{{ cotizacion_id }}</td>\n<td>{{ proveedor_id }}</td>\n<td>{{ razonsocial }}</td>\n<td>{{ keygen }}</td>\n<td>{{ traslado }}</td>\n<td>\n    <button class=\"btn btn-xs btn-link text-blue\"><span class=\"glyphicon glyphicon-eye-open\"></span></button>\n</td>\n<td>\n    <button class=\"btn btn-xs btn-link text-green\"><span class=\"glyphicon glyphicon-envelope\"></span></button>\n</td>\n<td>\n    <button class=\"btn btn-xs btn-link text-red\"><span class=\"glyphicon glyphicon-fire\"></span></button>\n</td>\n</tr>";
          $tb = $("table > tbody");
          $tb.empty();
          for (k in response.list) {
            response.list[k].item = parseInt(k) + 1;
            $tb.append(Mustache.render(template, response.list[k]));
          }
        }
      });
    }
  };

  viewReport = function(event) {
    var pass, quote, supplier, url;
    quote = this.value;
    supplier = $(this).attr("data-sup");
    pass = false;
    if (quote === "") {
      $().toastmessage("showWarningToast", "no se puede mostrar el report: fatal id quote.");
      return false;
    } else {
      pass = true;
    }
    if (supplier === "") {
      $().toastmessage("showWarningToast", "no se puede mostrar el report: fatal id supplier.");
      return false;
    } else {
      true;
    }
    if (pass) {
      url = "/reports/quote/" + quote + "/" + supplier;
      window.open(url, "_blank");
    }
  };

}).call(this);
