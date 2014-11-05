// Generated by CoffeeScript 1.7.1
var addDetailsPurchase, approvedProject, assignedResponsible, calAmountPurchaseOrder, changeView, deleteDetailsPurchase, deleteSubproject, fileTree, getAmountLiteral, getPercentIVA, getSectors, openNewSector, openNewSubproyecto, openUpdateSector, openUpdateSubproject, openWindow, publisherCommnet, setSubproject, showEditComment, showEditDetailsPurchase, toggleComment, treeAdminaandOpera, uploadFiles;

$(document).ready(function() {
  $(".panel-purchase-order-toggle").hide();
  $("input[name=podt],input[name=podf]").datepicker({
    "changeYear": true,
    "changeMonth": true,
    "showAnim": "slide",
    "dateFormat": "yy-mm-dd"
  });
  $(".new-sector").on("click", openNewSector);
  $(document).on("click", ".btn-edit-sector", openUpdateSector);
  $(".new-subproject").on("click", openNewSubproyecto);
  $(document).on("click", "#accordion > .panel-primary", setSubproject);
  $(document).on("click", ".btn-edit-sub", openUpdateSubproject);
  $(".btn-responsible").on("click", function() {
    return $(".mresponsible").modal("show");
  });
  $(".btn-files").on("click", function() {
    return $(".mfiles").modal("show");
  });
  $(".btn-cuadro").on("click", function(evetn) {
    return changeView(23);
  });
  $(".btn-list").on("click", function(event) {
    return changeView(100);
  });
  $(".btn-admin").on("click", function() {
    return $("[name=administrative]").click();
  });
  $(".btn-opera").on("click", function() {
    return $("[name=operation]").click();
  });
  $(".btn-upload-files").on("click", uploadFiles);
  $(".btn-show-comment").on("click", toggleComment);
  $(".btn-message-edit").on("click", showEditComment);
  $(".btn-message-del").on("click", showEditComment);
  $(".btn-assigned").on("click", assignedResponsible);
  $(".btn-approved").on("click", approvedProject);
  $(document).on("click", ".btn-del-sub", deleteSubproject);
  $(".btn-add-purchase-order-details").on("click", addDetailsPurchase);
  $("input[name=podt]").on("change", getPercentIVA);
  $(document).on("click", ".btn-edit-pod", showEditDetailsPurchase);
  $(document).on("click", ".btn-del-pod", deleteDetailsPurchase);
  $(".btn-details-purchare-order-toggle").click(function() {
    var $btn;
    $btn = $(this);
    $("div.panel-purchase-order-toggle").toggle(600, function() {
      if ($(".panel-purchase-order-toggle").is(":visible")) {
        $btn.find("span").eq(0).removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
        $btn.find("span").eq(1).text("Cancelar");
        $btn.removeClass("text-green").addClass("text-red");
        return;
      } else {
        $btn.find("span").eq(0).removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
        $btn.find("span").eq(1).text("Agregar Detalle");
        $btn.removeClass("text-red").addClass("text-green");
        return;
      }
      return $("input[name=podedit]").val("");
    });
  });
  $("button.btn-add-purchase-order").mouseover(function() {
    $(this).find("span").removeClass("glyphicon-plus-sign").addClass("glyphicon-plus");
  }).mouseout(function() {
    $(this).find("span").removeClass("glyphicon-plus").addClass("glyphicon-plus-sign");
  }).click(function() {
    $("div.mpurchase").modal("toggle");
  });
  $("#message").focus(function() {
    $(this).animate({
      "height": "102px"
    }, 500);
  }).blur(function() {
    $(this).animate({
      "height": "34px"
    }, 500);
  });
  $("input[name=poids]").blur(function(event) {
    var percent;
    percent = parseFloat(this.value);
    if (!isNaN(percent)) {
      this.value = percent.toFixed(3);
      calAmountPurchaseOrder();
    } else {
      this.value = 0;
      $().toastmessage("showWarningToast", "Solo se aceptan Números.");
    }
    $(".pods").text("" + this.value + "%");
  }).change(function(event) {
    $(".pods").text("" + this.value + "%");
    calAmountPurchaseOrder();
  });
  treeAdminaandOpera();
  tinymce.init({
    selector: "textarea#message",
    theme: "modern",
    menubar: false,
    statusbar: false,
    plugins: "link contextmenu",
    font_size_style_values: "10px,12px,13px,14px,16px,18px,20px",
    toolbar: "undo redo | styleselect | fontsizeselect |"
  });
  $(".btn-publisher").on("click", publisherCommnet);
});

approvedProject = function() {
  var data;
  data = new Object();
  data.type = "approved";
  data.admin = $("select[name=admin-approve]").val();
  data.passwd = $("input[name=passwd-approve]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  $().toastmessage("showToast", {
    text: "Realmente desea habilitar el proyecto?",
    type: "confirm",
    sticky: true,
    buttons: [
      {
        value: 'No'
      }, {
        value: 'Si'
      }
    ],
    success: function(result) {
      if (result === "Si") {
        $.post("", data, function(response) {
          if (response.status) {
            return location.reload();
          } else {
            return $().toastmessage("showWarningToast", "Fallo Transaccion: " + response.raise);
          }
        }, "json");
      }
    }
  });
};

assignedResponsible = function() {
  var admin, data, passwd, responsible;
  responsible = $("select[name=responsible]").val();
  admin = $("select[name=admin]").val();
  passwd = $("input[name=passwd]").val();
  if ((responsible != null) && (admin != null) && (passwd != null)) {
    data = new Object();
    data.responsible = responsible;
    data.admin = admin;
    data.passwd = passwd;
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    data.type = 'responsible';
    $.post("", data, function(response) {
      if (response.status) {
        return location.reload();
      } else {
        return $().toastmessage("", "Transaccion error: " + response.raise);
      }
    });
    return;
  }
};

publisherCommnet = function() {
  var data;
  data = new Object();
  data.edit = $("input[name=edit-message]").val();
  data.message = $.trim($("#message_ifr").contents().find("body").html());
  data.status = $("select[name=message-status]").val();
  if (data.message === "<p><br data-mce-bogus=\"1\"></p>") {
    $().toastmessage("showWarningToast", "No se puede publicar el mensaje, campo vacio.");
    return false;
  }
  if (data.edit === "") {
    data.type = "add";
  } else {
    data.type = "edit";
  }
  data.proyecto = $("input[name=pro]").val();
  data.subproyecto = $("input[name=sub]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  $.post("", data, function(response) {
    if (response.status) {
      return location.reload();
    }
  });
};

showEditComment = function() {
  var id;
  if (this.getAttribute("data-id") !== "") {
    id = this.getAttribute("data-id");
    $("#message_ifr").contents().find("body").html($(".comment" + id).find("div").eq(2).html());
    $("select[message-status]").val(this.getAttribute("data-status"));
    $("input[name=edit-message]").val(id);
  }
};


/*listComment = ->
    $.getJSON "", "list":"comment", (response) ->
        if response.status
            template = "
            <div class=\"alert alert-{{ status }} comment{{ id }}\">
                <div>
                    {{!editing}}
                    <small>{{ date }} {{ time }}</small>
                </div>
                <div>
                    {{ message }}
                </div>
                <div>
                    <small class=\"pull-right\">{{ charge }}</small>
                </div>
            </div>"
            edit = "<div class=\"btn-group pull-right\">
                        <button type=\"button\" data-toggle=\"dropdown\" class=\"btn btn-xs btn-link text-black dropdown-toggle\"><span class=\"glyphicon glyphicon-collapse-down\"></span></button>
                        <ul role=\"menu\" class=\"dropdown-menu\">
                            <li><a data-status=\"{{ status }}\" data-id=\"{{ id }}\" class=\"btn-message-edit\">Editar</a></li>
                            <li><a data-status=\"{{ status }}\" data-id=\"{{ id }}\" class=\"btn-message-del\">Eliminar</a></li>
                        </ul>
                    </div>"
            $panel = $("div.comment-list > .panel-body")
            $panel.empty()
            dni = $("input[name=dni]").val()
            html = ""
            for x of response.alerts
                if x.empdni == dni
                    template = template.replace "{{!editing}}", edit
                html = html.concat Mustache.to_html template, response.alerts[x]
            console.log html
            $panel.html html
            return
    return
 */

toggleComment = function() {
  $(".panel-comment").find(".panel-body").toggle(function() {
    if ($(this).is(":hidden")) {
      $(".btn-show-comment").find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
      return $(".panel-comment").css("height", "1em");
    } else {
      $(".btn-show-comment").find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
      return $(".panel-comment").css("height", "23em");
    }
  });
};

treeAdminaandOpera = function() {
  var admin, opera, year;
  year = new Date().getFullYear();
  if ($("input[name=sub]").val() === "") {
    admin = "/storage/projects/" + year + "/" + ($("input[name=pro]").val()) + "/administrative/";
    opera = "/storage/projects/" + year + "/" + ($("input[name=pro]").val()) + "/operation/";
  } else {
    admin = "/storage/projects/" + year + "/" + ($("input[name=pro]").val()) + "/" + ($("input[name=sub]").val()) + "/administrative/";
    opera = "/storage/projects/" + year + "/" + ($("input[name=pro]").val()) + "/" + ($("input[name=sub]").val()) + "/operation/";
  }
  fileTree('filetree_administrative', admin);
  fileTree('filetree_operation', opera);
};

fileTree = function(id, path) {
  $("#" + id).fileTree({
    root: path,
    script: "/json/get/path/",
    folderEvent: "click",
    expandSpeed: 750,
    collapseSpeed: 750,
    multiFolder: true
  }, function(file) {
    console.log(file);
    return window.open(file, "_blank");
  });
};

setSubproject = function(event) {
  $("input[name=sub]").val($(this).attr("data-sub"));
  if ($("input[name=sub]").val() !== "") {
    $(".header-project > .info-sub").remove();
    $(".header-project").append("<p class=\"info-sub\"><strong>Subproyecto :</strong> " + ($(".text-" + $(this).attr("data-sub")).html()) + " <strong> Codigo :</strong> " + ($(this).attr("data-sub")) + "</p>");
  } else {
    $("input[name=sub]").val();
    $(".header-project > .info-sub").remove();
  }
  getSectors();
};

getSectors = function() {
  var data, url;
  data = new Object();
  data.pro = $("input[name=pro]").val();
  data.sub = $("input[name=sub]").val();
  url = "/sales/projects/sectors/crud/";
  $.getJSON(url, data, function(response) {
    var $list, $sec, edit, editable, template, templist, x;
    if (response.status) {
      if (data.sub === "") {
        data.sub = "None";
      }
      template = "<article> {{!editable}} <a href=\"/sales/projects/manager/sector/" + data.pro + "/" + data.sub + "/{{ sector_id }}/\" class=\"text-black\"> {{ sector_id }} {{ nomsec }} <small>{{ planoid }}</small> </a> </article>";
      edit = "<button class=\"btn btn-xs text-black btn-link pull-left btn-edit-sector\" value=\"{{ sector_id }}\"> <span class=\"glyphicon glyphicon-pencil\"></span> </button> <button class=\"btn btn-xs text-black btn-link pull-right\" value=\"{{ sector_id }}\"> <span class=\"glyphicon glyphicon-trash\"></span> </button>";
      editable = $("input[name=status-project]").val();
      if (editable !== 'AC') {
        template = template.replace("{{!editable}}", edit);
      }
      templist = "<li><a href=\"/sales/projects/manager/sector/" + data.pro + "/" + data.sub + "/{{ sector_id }}/\" class=\"text-black\"><span class=\"glyphicon glyphicon-chevron-right\"></span> {{ nomsec }}</a></li>";
      $list = data['sub'] === "" ? $(".sectorsdefault") : $(".sectors" + data['sub']);
      $sec = $(".all-sectors");
      $sec.empty();
      $list.empty();
      for (x in response.list) {
        $sec.append(Mustache.render(template, response.list[x]));
        $list.append(Mustache.render(templist, response.list[x]));
      }
      equalheight(".all-sectors article");
    } else {
      return $().toastmessage("showErrorToast", "Error, transaction not complete. " + response.raise);
    }
  });
};

openNewSector = function(event) {
  var pro, sub, url;
  pro = $("input[name=pro]").val();
  sub = $("input[name=sub]").val();
  url = "/sales/projects/sectors/crud/?pro=" + pro + "&sub=" + sub + "&type=new";
  openWindow(url, false);
};

openUpdateSector = function(event) {
  var pro, sec, sub, url;
  pro = $("input[name=pro]").val();
  sub = $("input[name=sub]").val();
  sec = this.value;
  url = "/sales/projects/sectors/crud/?pro=" + pro + "&sub=" + sub + "&sec=" + sec + "&type=update";
  openWindow(url, false);
};

openNewSubproyecto = function(event) {
  var pro, url;
  pro = $("input[name=pro]").val();
  url = "/sales/projects/subprojects/crud/?pro=" + pro + "&type=new";
  openWindow(url, true);
};

openUpdateSubproject = function(event) {
  var pro, sub, url;
  pro = $("input[name=pro]").val();
  sub = this.value;
  url = "/sales/projects/subprojects/crud/?pro=" + pro + "&sub=" + sub + "&type=update";
  openWindow(url, true);
};

openWindow = function(url, reload) {
  var interval, win;
  win = window.open(url, "Popup", "toolbar=no, scrollbars=yes, resizable=no, width=400, height=600");
  interval = window.setInterval(function() {
    if (win === null || win.closed) {
      window.clearInterval(interval);
      if (reload) {
        location.reload();
      } else {
        getSectors();
      }
    }
  }, 1000);
  return win;
};

changeView = function(percent) {
  $(".all-sectors > article").css({
    "width": "" + percent + "%"
  });
  equalheight(".all-sectors article");
};

uploadFiles = function(event) {
  var data;
  data = new FormData();
  $("input[name=administrative], input[name=operation]").each(function(index, element) {
    if (this.files[0] != null) {
      data.append(this.name, this.files[0]);
    }
  });
  data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
  data.append("type", "files");
  data.append("pro", $("input[name=pro]").val());
  data.append("sub", $("input[name=sub]").val());
  $.ajax({
    data: data,
    url: "",
    type: "POST",
    dataType: "json",
    cache: false,
    processData: false,
    contentType: false,
    success: function(response) {
      if (response.status) {
        return location.reload();
      } else {
        return $().toastmessage("showErrorToast", "Error al subir los archivos al servidor");
      }
    }
  });
};

deleteSubproject = function() {
  var del;
  del = this;
  $().toastmessage("showToast", {
    text: "Debe tener en cuenta que al eliminar el Subproyecto (Adicional) este eliminara todos los sectores y materiales que contenga. Desea Eliminar el subproyecto (Adicional)?",
    sticky: true,
    type: "confirm",
    buttons: [
      {
        value: "Si"
      }, {
        value: "No"
      }
    ],
    success: function(result) {
      var data;
      if (result === "Si") {
        data = new Object();
        data.delsub = true;
        data.sub = del.value;
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
        $.post("", data, function(response) {
          if (response.status) {
            $().toastmessage("showNoticeToast", "Se a eliminado correctamente.");
            return setTimeout(function() {
              return location.reload();
            }, 2600);
          } else {
            return $().toastmessage("showErrorToast", "No se a podido eliminar el Subproyecto. " + response.raise);
          }
        }, "json");
      }
    }
  });
};

calAmountPurchaseOrder = function() {
  var amount, dsct, igv, pdsct, pigv, total;
  amount = 0;
  $(".table-details-purchase-order > tbody > tr").each(function(index, element) {
    var $td;
    $td = $(element).find("td");
    return amount += convertNumber($td.eq(6).text());
  });
  $(".pos").text(amount);
  if (isNaN(amount)) {
    amount = 0;
  }
  pdsct = parseFloat($("input[name=poids]").val());
  dsct = (amount * pdsct) / 100;
  amount = amount - dsct;
  pigv = $(".povigv").text().split("%");
  pigv = parseInt(pigv[0]);
  igv = (amount * pigv) / 100;
  total = amount + igv;
  dsct = dsct.toFixed(2);
  igv = igv.toFixed(2);
  total = total.toFixed(2);
  $(".pod").text(dsct);
  $(".poi").text(igv);
  $(".pot").text(total);
  getAmountLiteral();
};

addDetailsPurchase = function(event) {
  var $tb, $td, data, temp;
  data = new Object;
  data.desc = $.trim($("input[name=podd").val());
  data.unit = $("select[name=podu]").find("option:selected").text();
  data.date = $("input[name=podf]").val();
  data.quantity = convertNumber($("input[name=podq]").val());
  data.price = convertNumber($("input[name=podp]").val());
  data.amount = data.quantity * data.price;
  if (data.desc !== "" && !isNaN(data.price) && !isNaN(data.quantity)) {
    if ($.trim($("input[name=podedit]").val()) !== "") {
      $td = $("tr.pod" + ($.trim($("input[name=podedit]").val())) + " > td");
      $td.eq(1).text($("input[name=podd").val());
      $td.eq(2).text($("select[name=podu]").val());
      $td.eq(3).text($("input[name=podf]").val());
      $td.eq(4).text($("input[name=podq]").val());
      $td.eq(5).text($("input[name=podp]").val());
      $td.eq(6).text(parseFloat($("input[name=podq]").val()) * parseFloat($("input[name=podp]").val()));
      $("input[name=podedit]").val("");
    } else {
      $tb = $(".table-details-purchase-order > tbody");
      temp = "<tr class=\"pod{{ item }}\"> <td>{{ item }}</td> <td>{{ desc }}</td> <td>{{ unit }}</td> <td>{{ date }}</td> <td>{{ quantity }}</td> <td>{{ price }}</td> <td>{{ amount }}</td> <td class=\"text-center\"> <button class=\"btn btn-link btn-xs text-primary btn-edit-pod\" value=\"{{ item }}\"> <span class=\"glyphicon glyphicon-edit\"></span> </button> </td> <td class=\"text-center\"> <button class=\"btn btn-link btn-xs text-red btn-del-pod\" value=\"{{ item }}\"> <span class=\"glyphicon glyphicon-trash\"></span> </button> </td> </tr>";
      data.item = $tb.find("tr").length + 1;
      $tb.append(Mustache.render(temp, data));
    }
    calAmountPurchaseOrder();
    $(".btn-details-purchare-order-toggle").click();
  } else {
    $().toastmessage("showWarningToast", "Existen campos vacios!");
  }
};

getPercentIVA = function(event) {
  var data, date;
  data = new Object;
  data.percentigv = true;
  date = $.trim($("input[name=podt]").val());
  if (date !== "") {
    data.year = new Date("" + date + " 00:00").getFullYear();
  }
  $.getJSON("/json/general/conf/igv/", data, function(response) {
    if (response.status) {
      $(".povigv").text("" + response.igv + "%");
    }
  });
};

getAmountLiteral = function(event) {
  var data;
  data = new Object;
  data.number = $(".pot").text();
  $.getJSON("/json/convert/number/to/literal/", data, function(response) {
    if (response.status) {
      $(".literal-amount").text("SON: " + response.literal + " /100 " + ($("select[name=pocu]").find("option:selected").text()));
    }
  });
};

showEditDetailsPurchase = function(event) {
  var $td;
  $("input[name=podedit]").val(this.value);
  $td = $("tr.pod" + this.value + " > td");
  $("input[name=podd").val($td.eq(1).text());
  $("select[name=podu]").val($td.eq(2).text());
  $("input[name=podf]").val($td.eq(3).text());
  $("input[name=podq]").val($td.eq(4).text());
  $("input[name=podp]").val($td.eq(5).text());
  $(".btn-details-purchare-order-toggle").click();
};

deleteDetailsPurchase = function(event) {
  var $tr;
  $tr = $("tr.pod" + this.value);
  $tr.remove();
  $(".table-details-purchase-order > tbody > tr").each(function(index, element) {
    var $td;
    $td = $(element).find("td");
    $td.eq(0).text(index + 1);
    $td.eq(7).find("button").val(index + 1);
    $td.eq(8).find("button").val(index + 1);
  });
  calAmountPurchaseOrder();
};
