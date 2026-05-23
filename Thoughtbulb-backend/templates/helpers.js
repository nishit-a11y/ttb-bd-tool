const hbs = require("handlebars");

hbs.registerHelper("convertToINR", function (array1, num) {
    if (array1[num]) {
        let x = array1[num].toString().trim();
        y = Number.parseInt(x);
        x = Math.abs(y);
        return ((y<0 ? "-" :"") +
            " INR " +
            x.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                })
                .slice(1, -3)
        );
    }
    return "Nil";
});

hbs.registerHelper("convertToINRNum", function (num) {
    if (num) {
        num = num.toString().trim();
        y = Number.parseInt(num);
        num = Math.abs(y);
        return ((y<0 ? "-" :"") +
            " INR " +
            num.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                })
                .slice(1, -3)
        );
    }
    return "Nil";
});

hbs.registerHelper("eq", function(str1,str2){
    return (str1 === str2);
});

hbs.registerHelper('if_even', function(conditional, options) {
    if((conditional % 2) == 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });