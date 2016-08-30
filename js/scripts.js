// Back end logic
function Player () {
  this.alive = true;
  this.health = 100;
  this.inv = ["lighter"];
}

Player.prototype.invContains = function(item) {
  return this.inv.indexOf(item) >= 0;
}

function Page (number, subtitle, prompt, img, gameOverPage, options) {
  this.number = number;
  this.subtitle = subtitle;
  this.prompt = prompt;
  this.img = img;
  this.gameOverPage = gameOverPage;
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
  var outcome = true;
  var nextPage;
  if (option.test) {
    outcome = eval(option.test);
  }
  if(option.gameOver === true) {
    this.gameOver = true;
  }
  if (option.reset) {
    this.reset();
  }
  if (outcome) {
    if(option.healthPass) {
      if (book.player.invContains("amulet")) {
        this.player.health += option.healthPass * 0.5;
      } else {
        this.player.health += option.healthPass;
      }
    }
    if(option.itemPass) {
        this.player.inv = this.player.inv.concat(option.itemPass);
    }
  } else {
    if(option.healthFail) {
      if (book.player.invContains("amulet")) {
        this.player.health += option.healthFail * 0.5;
      } else {
        this.player.health += option.healthFail;
      }
    }
    if(option.itemFail) {
        this.player.inv = this.player.inv.concat(option.itemFail);
    }
  }
  if (this.player.health <= 0) {
    this.player.alive = false;
    this.gameOver = true;
  }
  if (this.gameOver && this.player.alive) {
    nextPage = this.pages[4];
  } else if (outcome) {
    nextPage = this.getPage(this.pages[option.nextPass]);
  } else {
    nextPage = this.getPage(this.pages[option.nextFail]);
  }
  if (this.player.health <= 0 && nextPage.gameOverPage) {
    this.currentPage = nextPage;
  } else if (this.player.health <= 0) {
    this.currentPage = this.pages[2];
  } else {
    this.currentPage = nextPage;
  }
}
Book.prototype.getPage = function(page) {
  var newPage = $.extend(true, {}, page)
  var newOptions = []
  page.options.forEach(function(option) {
    var display = true;
    if(option.display) {
      display = eval(option.display);
    }
    if (display) {
      newOptions.push(option);
    }
  });
  newPage.options = newOptions;
  return newPage;
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
  false,
  [{text: "Run away!", nextPass: 1},
  {text: "Play dead.", nextPass: 2, healthPass: -1000}]
));
pages.push(new Page(1,
  "subtitle",
  "You lose your sense of direction and get lost!",
  "",
  false,
  [{text: "Go back to camp.", nextPass: 7, nextFail: 2, test: "Math.random() > 0.5", healthFail: -1000},
  {text: "Keep running.", nextPass: 3}]
));
pages.push(new Page(2,
  "YOU DIED!",
  "The dark forest proved to be more than you could handle.",
  "img/page-icons/rip.svg",
  true,
  [{text: "Try again?", nextPass: 0, reset: 'true'}]
));
pages.push(new Page(3,
  "subtitle",
  "Make for cave or make a fire?",
  "",
  false,
  [{text: "Cave", nextPass: 5},
  {text: "Fire", nextPass: 10}]
));
pages.push(new Page(4,
  "YOU SURVIVED!",
  "You have survived the night and lived to find help in the morning.",
  "img/page-icons/fire.svg",
  false,
  [{text: "Play again?", nextPass: 0, reset: 'true'}]
));
pages.push(new Page(5,
  "Subtitle",
  "Upon entering the cave, a swarm of bats flies out all around you. As the air clears, you see a shrouded figure standing in the dark depths of the cave. She welcomes you in a shrill voice, and you can't help but notice her sharp fangs as she speaks. She's a vampire!",
  "img/page-icons/cave.svg",
  false,
  [{text: "Try to kill her.", nextPass: 6, nextFail: 2, test: "book.player.invContains('axe')", healthPass: -50, healthFail: -1000, itemPass: ["amulet"]},
  {text: "Try to befriend her.", nextPass: 17, itemPass: ["amulet"]}]
));
pages.push(new Page(6,
  "subtitle",
  "You killed the vampire! You take a shiny amulet from around her neck, thinking it looks valuable.",
  "",
  false,
  [{text: "Keep exploring the cave.", nextPass: 18, itemPass: ["mushroom"]},
  {text: "Afraid there may be more vampires, you leave the cave.", nextPass: 12}]
));
pages.push(new Page(7,
  "subtitle",
  "You made it back to camp and found an axe",
  "",
  false,
  [{text: "pick up the axe", nextPass: 3, itemPass: ["axe"]}]
));
pages.push(new Page(8,
  "subtitle",
  "You meet an owl (Riddle)",
  "",
  false,
  [{text: "answer1", nextPass: 11, itemPass: ["hat"]},
  {text: "answer2", nextPass: 24, healthPass: -40}]
));
pages.push(new Page(9,
  "subtitle",
  "Abandoned hunting lodge - find compass/water, but then get attacked by a ghost",
  "",
  false,
  [{text: "run away", nextPass: 12, itemPass: ["compass", "water"], healthPass: -20}]
));
pages.push(new Page(10,
  "subtitle",
  "Attacked by zombies",
  "",
  false,
  [{text: "fight the zombies", test: "book.player.invContains('axe')", nextPass: 16, nextFail: 25, healthPass: -30, healthFail: -60}]
));
pages.push(new Page(11,
  "YOU SURVIVED!",
  "You received a magical hat and teleported out of the forest.",
  "",
  false,
  [{text: "Play again?", nextPass: 0, reset: 'true'}]
));
pages.push(new Page(12,
  "subtitle",
  "You meet a weird person",
  "",
  false,
  [{text: "confront", nextPass: 13},
  {text: "run away", nextPass: 19}]
));
pages.push(new Page(13,
  "subtitle",
  "you confront the stranger",
  "",
  false,
  [{text: "give water", nextPass: 14, display: "book.player.invContains('water')", itemPass: ["map"]},
  {text: "give mushroom", nextPass: 20, display: "book.player.invContains('mushroom')", itemPass: ["knife"]},
  {text: "fight stranger", test: "book.player.invContains('axe')" , nextPass: 21, nextFail: 22, healthFail: -40, healthPass: -20, itemPass: ["knife"]}]
));
pages.push(new Page(14,
  "subtitle",
  "You gave them water. you got a map",
  "",
  false,
  [{text: "take map", nextPass: 15, nextFail: 19, test: "book.player.invContains('compass')"}]
));
pages.push(new Page(15,
  "YOU SURVIVED!",
  "You used map and compass to escape the forest",
  "",
  false,
  [{text: "Play again?", nextPass: 0, reset: 'true'}]
));

pages.push(new Page(16,
  "subtitle",
  "Kill zombies with axe",
  "",
  false,
  [{text: "keep exploring", test: "Math.random() > 0.5", nextPass: 8, nextFail: 9}]
));
pages.push(new Page(17,
  "subtitle",
  "Vampire gives you an amulet",
  "",
  false,
  [{text: "leave the cave", nextPass: 12}]
));
pages.push(new Page(18,
  "subtitle",
  "You found a mushroom",
  "",
  false,
  [{text: "leave the cave", nextPass: 12},
  {text: "eat the mushroom", nextPass: 26, healthPass: -1000}]
));
pages.push(new Page(19,
  "subtitle",
  "You get stuck in a bear trap",
  "",
  false,
  [{text: "use knife to free self from bear trap", display: "book.player.invContains('knife')", nextPass: 23},
  {text: "wait for someone to find you", nextPass: 2, healthPass: -1000}]
));
pages.push(new Page(20,
  "subtitle",
  "the mushroom turned out to be poisoned! the man dies, you take his knife",
  "",
  false,
  [{text: "keep exploring", nextPass: 19}]
));
pages.push(new Page(21,
  "subtitle",
  "you used the axe to kill the stranger. you take his knife",
  "",
  false,
  [{text: "keep exploring", nextPass: 19}]
));
pages.push(new Page(22,
  "subtitle",
  "you fight the stranger with your bear hands. you barely manage to get away.",
  "",
  false,
  [{text: "keep exploring", nextPass: 19}]
));
pages.push(new Page(23,
  "subtitle",
  "you use the knife to free yourself from the bear trap. exhausted, you see an exit from the forest.",
  "",
  false,
  [{text: "stuble out of forest", nextPass: 4}]
));
pages.push(new Page(24,
  "subtitle",
  "Wrong answer! Owl attacks you.",
  "",
  false,
  [{text: "run away", display: "true", nextPass: 12}]
));
pages.push(new Page(25,
  "subtitle",
  "You barely escape the zombies",
  "",
  false,
  [{text: "keep running", nextPass: 12}]
));
pages.push(new Page(26,
  "subtitle",
  "You ate the mushroom. It was poisoned. You died.",
  "",
  true,
  [{text: "Play again?", nextPass: 0, reset: true }]
));
var book = new Book(pages);

// Front end logic
$(document).ready(function() {
  function changePage() {
    $('#subtitle').text(book.currentPage.subtitle);
    $('#prompt').text(book.currentPage.prompt);
    $('#storyImg').attr("src", book.currentPage.img);
    $('#healthbar').css("width", book.player.health + "%");
    if (book.player.health < 25) {
      $('#healthbar').css("background-color", "#990000");
    } else {
      $('#healthbar').css("background-color", "#718059");
    }
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
