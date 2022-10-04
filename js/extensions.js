Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

String.prototype.getScore = function () {
  if (this == "J" || this == "Q" || this == "K" || this == "10")
  {
    return 10;
  }

  if (this == "A")
  {
    return 11;
  }

  return +this;
}
