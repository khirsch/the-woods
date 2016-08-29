// Back end logic
function Player () {
  this.alive = true;
}

function Page (number, subtitle, prompt, img, options) {
  this.number = number;
  this.subtitle = subtitle;
  this.prompt = prompt;
  this.img = img;
  this.options = options;
}

function Book (pages) {
  this.pages = pages;
  this.currentPage = pages[0];
  this.player = new Player();
}

Book.prototype.loadPage = function(num) {
  this.currentPage = this.pages[num];
}

Book.prototype.playerDies = function() {
  this.currentPage = this.pages[10]; // 10 - death page
}

var pages = [];
pages.push(new Page(0,
  "subtitle",
  "Your camp has been overrun by a bear!",
  "",
  [{text: "Run away!", num: 1}, {text: "Play dead.", num: 2}]
));
pages.push(new Page(1,
  "subtitle",
  "You lose your sense of direction and get lost!",
  "",
  [{text: "Go back to camp.", num: 2}, {text: "Look for a new shelter.", num: 4}]
));
pages.push(new Page(2,
  "YOU DIED!",
  "You have been mauled by a bear.",
  "",
  [{text: "Try again?", num: 0}]
));
pages.push(new Page(4,
  "subtitle",
  "Make for cave or build your own shelter?",
  "",
  [{text: "Cave", num: 2}, {text: "Build", num:5}]
));
pages.push(new Page(5,
  "YOU WIN!!!!",
  "You have survived the night and lived to find help in the morning.",
  "",
  [{text: "Play again?", num: 0}]
));
var book = new Book(pages);

// Front end logic
$(document).ready(function() {
  $('#start').click(function() {
    $('.title').hide();
    $('.story').show();
    $('#subtitle').text(book.currentPage.subtitle);
    $('#prompt').text(book.currentPage.prompt);
    $('li').hide();
    book.currentPage.options.forEach(function(option, i) {
      $('#option' + i).show();
      $('#option' + i).attr("value", book.currentPage.options[i].num);
      $('#option' + i).text(book.currentPage.options[i].text);
    });
  });
  $('li').click(function() {
    var next = parseInt($(this).val());
    book.loadPage(next);
    $('#subtitle').text(book.currentPage.subtitle);
    $('#prompt').text(book.currentPage.prompt);
    $('li').hide();
    book.currentPage.options.forEach(function(option, i) {
      $('#option' + i).show();
      $('#option' + i).attr("value", book.currentPage.options[i].num);
      $('#option' + i).text(book.currentPage.options[i].text);
    });
  });
});
