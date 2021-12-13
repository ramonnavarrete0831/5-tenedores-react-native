import React from "react";

/*const conektaio = new Conektaio();

  const tokenParams = {
    card: {
      number: "371449635398431",
      name: "Ramón Navarrete",
      exp_year: "2020",
      exp_month: "12",
      cvc: "1234",
    },
  };

  console.log(
    "validateNumber : " + conektaio.validateNumber(tokenParams.card.number)
  );
  console.log(
    "validateExpirationDate : " +
      conektaio.validateExpirationDate(
        tokenParams.card.exp_month,
        tokenParams.card.exp_year
      )
  );
  console.log("validateCVC : " + conektaio.validateCVC(tokenParams.card.cvc));

  console.log("validateCVC : " + conektaio.getBrand(tokenParams.card.number));

  conektaio
    .tokenizeCard(tokenParams)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });*/
class Conektaio {
  card_types = [
    {
      name: "amex",
      pattern: /^3[47]/,
      valid_length: [15],
    },
    {
      name: "diners_club_carte_blanche",
      pattern: /^30[0-5]/,
      valid_length: [14],
    },
    {
      name: "diners_club_international",
      pattern: /^36/,
      valid_length: [14],
    },
    {
      name: "jcb",
      pattern: /^35(2[89]|[3-8][0-9])/,
      valid_length: [16],
    },
    {
      name: "laser",
      pattern: /^(6304|670[69]|6771)/,
      valid_length: [16, 17, 18, 19],
    },
    {
      name: "visa_electron",
      pattern: /^4(026|17500|405|508|844|91[37])/,
      valid_length: [16],
    },
    {
      name: "visa",
      pattern: /^4/,
      valid_length: [16],
    },
    {
      name: "mastercard",
      pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
      valid_length: [16],
    },
    {
      name: "maestro",
      pattern: /^(5018|5020|5038|6304|6759|6761|6763)/,
      valid_length: [12, 13, 14, 15, 16, 17, 18, 19],
    },
    {
      name: "discover",
      pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/, // eslint-disable-line max-len
      valid_length: [16],
    },
    {
      name: "pagaflex",
      pattern: /^(636937[0-1][0-9])/,
      valid_length: [16],
    },
    {
      name: "carnet",
      pattern: /^(639559|506221|50643[6-7])/,
      valid_length: [16],
    },
    {
      name: "sivale",
      pattern: /^(627636)/,
      valid_length: [16],
    },
  ];

  tokenizeCard = (card) =>
    new Promise(async (resolve, reject) => {
      try {
        const tokenRes = await fetch("https://api.conekta.io/tokens", {
          method: "POST",
          body: JSON.stringify(card),
          headers: {
            Accept: "application/vnd.conekta-v0.3.0+json",
            "Content-Type": "application/json",
            Authorization: "Basic a2V5X0JOTEVoeUpzZnR6dHJMVENOSHg4dGFn",
            "Accept-Language": "es",
            "Conekta-Client-User-Agent": JSON.stringify({
              agent: "Conekta JavascriptBindings-AJAX/v1.0.0 build 2.0.17",
            }),
          },
        });

        const token = await tokenRes.json();
        if (
          typeof token.id === "undefined" &&
          !(typeof token.code === "undefined")
        ) {
          reject(token);
        } else {
          resolve(token);
        }
      } catch (error) {
        reject(error);
      }
    });

  validateNumber = (number) => {
    var card_type, length_valid, luhn_valid;
    if (typeof number === "string") {
      number = number.replace(/[ -]/g, "");
    } else if (typeof number === "number") {
      number = number.toString();
    } else {
      number = "";
    }
    card_type = this.get_card_type(number);
    luhn_valid = false;
    length_valid = false;
    if (card_type != null) {
      luhn_valid = this.is_valid_luhn(number);
      length_valid = this.is_valid_length(number, card_type);
    }
    return luhn_valid && length_valid;
  };

  validateExpirationDate = (exp_month, exp_year) => {
    var month, year;
    month = this.parseMonth(exp_month);
    year = this.parseYear(exp_year);
    if (
      typeof month === "number" &&
      month > 0 &&
      month < 13 &&
      typeof year === "number" &&
      year > this.minYear() &&
      year < this.maxYear()
    ) {
      return (
        new Date(year, month, new Date(year, month, 0).getDate()) > new Date()
      );
    } else {
      return false;
    }
  };

  validateCVC = (cvc) => {
    return (
      (typeof cvc === "number" && cvc >= 0 && cvc < 10000) ||
      (typeof cvc === "string" && cvc.match(/^[\d]{3,4}$/) !== null)
    );
  };

  getBrand = (number) => {
    var brand;
    if (typeof number === "string") {
      number = number.replace(/[ -]/g, "");
    } else if (typeof number === "number") {
      number = toString(number);
    }
    brand = this.get_card_type(number);
    if (brand && brand.name) {
      return brand.name;
    }
    return null;
  };

  get_card_type = (number) => {
    var card, card_type, i, len, ref;
    const card_types = this.card_types;

    ref = (function () {
      var j, len, results;
      results = [];
      for (j = 0, len = card_types.length; j < len; j++) {
        card = card_types[j];
        results.push(card);
      }
      return results;
    })();

    for (i = 0, len = ref.length; i < len; i++) {
      card_type = ref[i];
      if (number.match(card_type.pattern)) {
        return card_type;
      }
    }
    return null;
  };

  is_valid_luhn = (number) => {
    var digit, i, len, n, ref, sum;
    sum = 0;
    ref = number.split("").reverse();
    for (n = i = 0, len = ref.length; i < len; n = ++i) {
      digit = ref[n];
      digit = +digit;
      if (n % 2) {
        digit *= 2;
        if (digit < 10) {
          sum += digit;
        } else {
          sum += digit - 9;
        }
      } else {
        sum += digit;
      }
    }
    return sum % 10 === 0;
  };

  is_valid_length = (number, card_type) => {
    return card_type.valid_length == number.length ? true : false;
  };

  parseMonth = (month) => {
    if (typeof month === "string" && month.match(/^[\d]{1,2}$/)) {
      return parseInt(month);
    } else {
      return month;
    }
  };

  parseYear = (year) => {
    if (typeof year === "number" && year < 100) {
      year += 2000;
    }
    if (typeof year === "string" && year.match(/^([\d]{2,2}|20[\d]{2,2})$/)) {
      if (year.match(/^([\d]{2,2})$/)) {
        year = "20" + year;
      }
      return parseInt(year);
    } else {
      return year;
    }
  };

  minYear = () => {
    return new Date().getFullYear() - 1;
  };

  maxYear = () => {
    return new Date().getFullYear() + 22;
  };
}
export default Conektaio;
