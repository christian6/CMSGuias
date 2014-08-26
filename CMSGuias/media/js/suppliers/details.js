// Generated by CoffeeScript 1.7.1
var calcTotals, saveBlurDigit, validMinandMax;

$(document).ready(function() {
  $("input[name=dates]").datepicker({
    "minDate": "0",
    "dateFormt": "yy-mm-dd",
    "showAnim": "slide"
  });
  $(document).on("blur", "input[name=prices], input[name=desct]", saveBlurDigit);
  calcTotals();
});

validMinandMax = function(item) {
  if ($.trim(item.value) !== "") {
    if (parseFloat($.trim(item.value)) >= parseInt(item.getAttribute("min")) && parseFloat($.trim(item.value)) <= parseInt(item.getAttribute("max"))) {
      return true;
    } else {
      item.value = item.getAttribute("min");
      return false;
    }
  } else {
    item.value = item.getAttribute("min");
    return false;
  }
};

saveBlurDigit = function(event) {
  var data;
  validMinandMax(this);
  if (isNaN(this.value)) {
    data = new Object();
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    if (this.name === "prices") {
      data.blur = "price";
    } else if (this.name === "desct") {
      data.blur = "desct";
    }
    data.val = this.value;
    $.post("", data, function(response) {
      var $td, amount, discount, price, quantity;
      console.log(response);
      if (response.status) {
        $td = $("table > tbody > tr." + (this.getAttribute("data-mat")) + " > td");
        quantity = response.quantity;
        if (data.blur === "desct") {
          price = parseFloat($td.eq(4).val());
          discount = parseFloat(data.val);
        } else {
          price = parseFloat(data.val);
          discount = parseFloat($td.eq(5).val() === "" ? 0 : $td.eq(5).val());
        }
        discount = price - ((price * discount) / 100);
        amount = quantity * discount;
        $td.eq(6).text(amount.toFixed(2));
        return calcTotals();
      }
    });
    return;
  }
};

calcTotals = function() {
  var amount, cigv, igv, totals;
  amount = 0;
  $("table > tbody > tr").each(function(index, element) {
    amount += parseFloat($(element).find("td").eq(6).text());
  });
  cigv = parseInt($("input[name=igv]").val());
  igv = (amount * cigv) / 100;
  totals = amount + igv;
  $(".subtc").text(amount.toFixed(2));
  $(".igvc").text(igv.toFixed(2));
  $(".totalc").text(totals.toFixed(2));
};
