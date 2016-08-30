// Back end logic
function Player () {
  this.alive = true;
  this.health = 100;
  this.inv = ["lighter"];
}

Player.prototype.invContains = function(item) {
  return this.inv.indexOf(item) >= 0;
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
  this.startOver = false;
}

Book.prototype.loadPage = function(option) {
  var outcome = eval(option.test);
  if(option.gameOver === true) {
    this.gameOver = true;
  }
  if (option.reset) {
    this.reset();
  }
  if (outcome) {
    if(option.healthPass) {
      this.player.health += option.healthPass;
    }
    if(option.itemPass) {
      this.player.inv.push(option.itemPass);
    }
  } else {
    if(option.healthFail) {
      this.player.health += option.healthFail;
    }
    if(option.itemFail) {
      this.player.inv.push(option.itemFail);
    }
  }
  if (this.player.health <= 0) {
    this.player.alive = false;
    this.gameOver = true;
    this.currentPage = this.pages[2];
  } else if (this.gameOver && this.player.alive) {
    this.currentPage = this.pages[4];
  } else if (outcome) {
    this.currentPage = this.pages[option.nextPass];
  } else {
    this.currentPage = this.pages[option.nextFail];
  }
}

Book.prototype.reset = function() {
  this.player = new Player();
  this.gameOver = false;
}

var pages = [];
pages.push(new Page(0,
  "subtitle",
  "Your camp has been overrun by zombies!",
  "img/page-icons/zombie.svg",
  [{text: "Run away!", nextPass: 1, test: "true", healthPass: -5, itemPass: "axe"},
  {text: "Play dead.", nextPass: 2, test: "true", healthPass: -100}]
));
pages.push(new Page(1,
  "subtitle",
  "You lose your sense of direction and get lost!",
  "",
  [{text: "Go back to camp.", test: "false", healthFail: -100},
  {text: "Look for a new shelter.", nextPass: 3, test: "true"}]
));
pages.push(new Page(2,
  "YOU DIED!",
  "The dark forest proved to be more than you could handle.",
  "img/page-icons/rip.svg",
  [{text: "Try again?", nextPass: 0, test: "true", reset: 'true'}]
));
pages.push(new Page(3,
  "subtitle",
  "Make for cave or build your own shelter?",
  "",
  [{text: "Cave", nextPass: 5, test: "true"},
  {text: "Build", nextPass: 4, test: "true", gameOver: true}]
));
pages.push(new Page(4,
  "YOU WIN!!!!",
  "You have survived the night and lived to find help in the morning.",
  "img/page-icons/fire.svg",
  [{text: "Play again?", nextPass: 0, test: "true", reset: 'true'}]
));
pages.push(new Page(5,
  "Subtitle",
  "Upon entering the cave, a swarm of bats flies out all around you. As the air clears, you see a shrouded figure standing in the dark depths of the cave. She welcomes you in a shrill voice, and you can't help but notice her sharp fangs as she speaks. She's a vampire!",
  "img/page-icons/cave.svg",
  [{text: "Try to kill her.", nextPass: 6, nextFail: 2, test: "book.player.invContains('axe')", healthPass: -50, healthFail: -100, itemPass: "amulet"},
  {text: "Try to befriend her.", nextPass: 7, test: "true", itemPass: "amulet"}]
));
pages.push(new Page(6,
  "subtitle",
  "You killed the vampire! You take a shiny amulet from around her neck, thinking it looks valuable.",
  "",
  [{text: "You are tired from running and go to sleep.", nextPass: 8, test: "true"},
  {text: "Afraid there may be more vampires, you look deeper in the cave.", nextPass: 9, test: "true"}]
));
// pages.push(new Page(7,
//   "subtitle",
//   "Befriend vampire. Get amulet.",
//   "",
//   [{text: "", nextPass: , nextFail: , test: ""},
//   {text: "", nextPass: , test: ""}]
// ));
// pages.push(new Page(7,
//   "subtitle",
//   "",
//   "",
//   [{text: "", nextPass: , nextFail: , test: ""},
//   {text: "", nextPass: , test: "", item: ""}]
// ));
var book = new Book(pages);

// Front end logic
$(document).ready(function() {
  function changePage() {
    $('#subtitle').text(book.currentPage.subtitle);
    $('#prompt').text(book.currentPage.prompt);
    $('#storyImg').attr("src", book.currentPage.img);
    $('#healthbar').css("width", book.player.health + "%");
    $('.item').hide();
    book.player.inv.forEach(function(item) {
      $("#" + item).show();
    });
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
    var optionNum = $(this).attr('id').charAt(6);
    var option = book.currentPage.options[optionNum];
    book.loadPage(option);
    changePage();
  });
});
