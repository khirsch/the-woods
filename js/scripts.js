function Player (currentPage) {
  this.currentPage = currentPage;
  this.alive = true;
}

function Page (number, text, options) {
  this.number = number;
  this.text = text;
  this.options = options;
}

function Book (player, currentPage, pages) {
  this.pages = pages;
}

Book.prototype.loadPage = function(num) {
  this.currentPage = this.pages[num];
}

Book.prototype.playerDies = function() {
  this.currentPage = this.pages[10]; // 10 - death page
}
