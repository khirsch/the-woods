// Back end logic
function Player () {
  this.alive = true;
  this.health = 100;
  this.inv = [];
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
  this.gameOver = false;
}

Book.prototype.loadPage = function(option) {
  console.log(book.player);
  if(option.gameOver === true) {
    this.gameOver = true;
  }
  if(option.health) {
    this.player.health += option.health;
    if(this.player.health <= 0) {
      this.player.alive = false;
      this.gameOver = true;
    }
  }
  if (this.gameOver) {
    if (!this.player.alive) {
      this.currentPage = this.pages[2];
    } else {
      this.currentPage = this.pages[4];
    }
    this.reset();
  } else if (eval(option.test)) {
    this.currentPage = this.pages[option.nextPass];
    if(option.item) {
      this.player.inv.push(option.item);
    }
  } else {
    this.currentPage = this.pages[option.nextFail];
  }
}

Book.prototype.reset = function() {
  this.player = new Player();
  this.gameOver = false;
}

Book.prototype.playerDies = function() {
  this.currentPage = this.pages[2]; // 2 - death page
}

var pages = [];
pages.push(new Page(0,
  "subtitle",
  "Your camp has been overrun by zombies! AXEEEE",
  "img/zombie.svg",
  [{text: "Run away!", nextPass: 1, test: "true", item: "axe", health: -5}, {text: "Play dead.", nextPass: 2, test: "true", health: -100}]
));
pages.push(new Page(1,
  "subtitle",
  "You lose your sense of direction and get lost!",
  "",
  [{text: "Go back to camp.", nextPass: 2, test: "true", health: -100}, {text: "Look for a new shelter.", nextPass: 3, test: "true"}]
));
pages.push(new Page(2,
  "YOU DIED!",
  "You have been mauled by a bear.",
  "img/rip.svg",
  [{text: "Try again?", nextPass: 0, test: "true"}]
));
pages.push(new Page(3,
  "subtitle",
  "Make for cave or build your own shelter?",
  "",
  [{text: "Cave", nextPass: 2, test: "true", health: -100}, {text: "Build", nextPass:4, test: "true", gameOver: true}]
));
pages.push(new Page(4,
  "YOU WIN!!!!",
  "You have survived the night and lived to find help in the morning.",
  "img/fire.svg",
  [{text: "Play again?", nextPass: 0, test: "true"}]
));
var book = new Book(pages);

// Front end logic
$(document).ready(function() {
  function changePage() {
    $('#subtitle').text(book.currentPage.subtitle);
    $('#prompt').text(book.currentPage.prompt);
    $('#storyImg').attr("src", book.currentPage.img);
    $('li').hide();
    book.currentPage.options.forEach(function(option, i) {
      $('#option' + i).show();
      $('#option' + i).attr("value", book.currentPage.number);
      $('#option' + i).text(book.currentPage.options[i].text);
    });
  }
  $('#start').click(function() {
    $('.title').hide();
    $('.story').show();
    changePage();
  });
  $('li').click(function() {
    // var next = parseInt($(this).val());
    var optionNum = $(this).attr('id').charAt(6);
    var option = book.currentPage.options[optionNum];
    book.loadPage(option);
    changePage();
  });
});
