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
    if(option.itemRemovePass) {
      var inv = this.player.inv;
      option.itemRemovePass.forEach(function(item) {
        if (inv.indexOf(item) >= 0) {
          var location = inv.indexOf(item);
          inv.splice(location, 1);
        }
      });
      this.player.inv = inv;
    }
  } else {
    if(option.healthFail) {
      if (book.player.invContains("amulet")) {
        this.player.health += option.healthFail * 0.5;
      } else {
        this.player.health += option.healthFail;
      }
      if(option.itemRemoveFail) {
        var inv = this.player.inv;
        option.itemRemoveFail.forEach(function(item) {
          if(inv.indexOf(item) >= 0) {
            var location = inv.indexOf(item);
            inv.splice(location, 1);
          }
        });
        this.player.inv = inv;
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
    this.currentPage = this.pages[32];
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
  this.pages = setPages();

}

function setPages() {
  var owlPages = [];
  owlPages.push(new Page(8,
    "subtitle",
    "You meet an owl. He gives you the following riddle: Three playing cards in a row. Can you name them with these clues? There is a two to the right of a king. A diamond will be found to the left of a spade. An ace is to the left of a heart. A heart is to the left of a spade. Now, identify all three cards. What is your answer?",
    "img/page-icons/owl.svg",
    false,
    [{text: "Ace of Diamonds, King of Hearts, Two of Spades", nextPass: 11, itemPass: ["hat"]},
    {text: "King of Hearts, Ace of Diamonds, Two of Spades", nextPass: 24, healthPass: -40}]
  ));
  owlPages.push(new Page(8,
    "subtitle",
    "You meet an owl. He gives you the following riddle: It cannot be seen, cannot be felt, cannot be heard, cannot be smelt. It lies behind stars and under hills, and empty holes it fills. It comes first and follows after, ends life, kills laughter. What is your answer?",
    "img/page-icons/owl.svg",
    false,
    [{text: "dark", nextPass: 11, itemPass: ["hat"]},
    {text: "evil", nextPass: 24, healthPass: -40}]
  ));
  owlPages.push(new Page(8,
    "subtitle",
    "You meet an owl. He gives you the following riddle: Alive without breath, as cold as death; Never thirsty, ever drinking, all in mail never clinking. What is your answer?",
    "img/page-icons/owl.svg",
    false,
    [{text: "fish", nextPass: 11, itemPass: ["hat"]},
    {text: "armour", nextPass: 24, healthPass: -40}]
  ));
  var rand = Math.round(Math.random()*2);
  var owlPage = owlPages[rand];

  var randomPages = [];
  randomPages.push(new Page(10,
    "subtitle",
    "you encounter a gnome",
    "img/page-icons/gnome.svg",
    false,
    [{text: "run away", nextPass: 31, nextFail: 12, test: "book.player.invContains('amulet') || book.player.invContains('compass')", itemRemovePass: ["amulet", "compass"]}]
  ));
  randomPages.push(new Page(10,
    "subtitle",
    "Attacked by zombies",
    "img/page-icons/zombie.svg",
    false,
    [{text: "fight the zombies", test: "book.player.invContains('axe')", nextPass: 16, nextFail: 25, healthPass: -30, healthFail: -60}]
  ));

  var rand;
  if (Math.random() > 0.8) {
    rand = 0;
  } else {
    rand = 1;
  }
  var randomPage = randomPages[rand];

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
    "img/page-icons/woods.svg",
    false,
    [{text: "Go back to camp.", nextPass: 7, nextFail: 27, test: "Math.random() > 0.5", healthFail: -1000},
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
    "img/page-icons/woods.svg",
    false,
    [{text: "Cave", nextPass: 5},
    {text: "Fire", test: "Math.random() > 0.5", nextPass: 8, nextFail: 9}]
  ));
  pages.push(new Page(4,
    "YOU SURVIVED!",
    "You have survived the night and lived to find help in the morning.",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Play again?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(5,
    "Subtitle",
    "Upon entering the cave, a swarm of bats flies out all around you. As the air clears, you see a shrouded figure standing in the dark depths of the cave. She welcomes you in a shrill voice, and you can't help but notice her sharp fangs as she speaks. She's a vampire!",
    "img/page-icons/cave.svg",
    false,
    [{text: "Try to kill her.", nextPass: 6, nextFail: 2, test: "book.player.invContains('axe')", healthPass: -50, healthFail: -1000},
    {text: "Try to befriend her.", nextPass: 17, itemPass: ["amulet"]}]
  ));
  pages.push(new Page(6,
    "subtitle",
    "You killed the vampire!",
    "img/page-icons/vampire.svg",
    false,
    [{text: "Keep exploring the cave.", nextPass: 18, itemPass: ["mushroom"]},
    {text: "Afraid there may be more vampires, you leave the cave.", nextPass: 10}]
  ));
  pages.push(new Page(7,
    "subtitle",
    "You made it back to camp and found an axe",
    "img/page-icons/axe.svg",
    false,
    [{text: "pick up the axe", nextPass: 3, itemPass: ["axe"]}]
  ));
  pages.push(owlPage);
  pages.push(new Page(9,
    "subtitle",
    "Abandoned hunting lodge - find compass/water",
    "img/page-icons/lodge.svg",
    false,
    [{text: "explore the lodge", nextPass: 28, healthPass: -20, itemPass: ["compass", "water"]}]
  ));
  pages.push(randomPage);
  pages.push(new Page(11,
    "YOU SURVIVED!",
    "You received a magical hat and teleported out of the forest.",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Play again?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(12,
    "subtitle",
    "You meet a weird person",
    "img/page-icons/person.svg",
    false,
    [{text: "confront", nextPass: 13},
    {text: "run away", nextPass: 19}]
  ));
  pages.push(new Page(13,
    "subtitle",
    "you confront the stranger",
    "img/page-icons/person.svg",
    false,
    [{text: "give water", nextPass: 14, display: "book.player.invContains('water')", itemRemovePass: ["water"]},
    {text: "give mushroom", nextPass: 20, display: "book.player.invContains('mushroom')", itemRemovePass: ["mushroom"]},
    {text: "fight stranger", test: "book.player.invContains('axe')" , nextPass: 21, nextFail: 22, healthFail: -40, healthPass: -20, itemPass: ["knife"]}]
  ));
  pages.push(new Page(14,
    "subtitle",
    "You gave them water. you got a map",
    "img/page-icons/woods.svg",
    false,
    [{text: "take map", itemPass: ["map"], itemFail: ["map"], nextPass: 15, nextFail: 19, test: "book.player.invContains('compass')"}]
  ));
  pages.push(new Page(15,
    "YOU SURVIVED!",
    "You used map and compass to escape the forest",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Play again?", nextPass: 0, reset: 'true'}]
  ));

  pages.push(new Page(16,
    "subtitle",
    "Kill zombies with axe",
    "img/page-icons/zombie.svg",
    false,
    [{text: "keep exploring", nextPass: 12}]
  ));
  pages.push(new Page(17,
    "Vampire Encounter",
    "The vampire senses your despiration. He gives you a shiny amulet from around his neck. It looks valuable. You feel safer wearing it. You hear the zombies approaching in the distance.",
    "img/page-icons/vampire.svg",
    false,
    [{text: "Leave the cave.", nextPass: 10}]
  ));
  pages.push(new Page(18,
    "The Cave",
    "You run deeper into the cave and you come to a dead end. On the ground below you, you find a patch of mushrooms. You pick one up to examine it.",
    "img/page-icons/cave.svg",
    false,
    [{text: "Place the mushroom in your pocket, and leave the cave.", nextPass: 10},
    {text: "Eat the mushroom.", nextPass: 26, healthPass: -1000, itemRemovePass: ["mushroom"]}]
  ));
  pages.push(new Page(19,
    "The Woods",
    "Stumbling from fear, you continue deeper into the forest. In your haste to get away, you fall into a bear trap.",
    "img/page-icons/woods.svg",
    false,
    [{text: "Use your knife to free yourself from the bear trap.", display: "book.player.invContains('knife')", nextPass: 23},
    {text: "Wait and hope someone finds you.", test: "Math.random() > 0.8", nextPass: 30, nextFail: 29, healthFail: -1000}]
  ));
  pages.push(new Page(20,
    "The Mysterious Stranger",
    "The mysterious stranger eats your mushroom. The mushroom turned out to be poisoned! The mysterious stranger dies. You see a knife at his side",
    "img/page-icons/person.svg",
    false,
    [{text: "Take the knife.", itemPass: ["knife"], nextPass: 19}]
  ));
  pages.push(new Page(21,
    "The Mysterious Stranger",
    "You use the axe to kill the mysterious stranger. You see a knife by his side.",
    "img/page-icons/person.svg",
    false,
    [{text: "Take the knife.", nextPass: 19}]
  ));
  pages.push(new Page(22,
    "The Mysterious Stranger",
    "You fight the stranger with your bare hands. He pulls out a knife and swings wildly. You barely manage to get away.",
    "img/page-icons/person.svg",
    false,
    [{text: "Keep running.", nextPass: 19}]
  ));
  pages.push(new Page(23,
    "The Woods",
    "You use the knife to free yourself from the bear trap. Exhausted, you see an exit from the forest.",
    "img/page-icons/woods.svg",
    false,
    [{text: "Stumble out of forest.", nextPass: 4}]
  ));
  pages.push(new Page(24,
    "Owl Encounter",
    "Wrong answer! The owl is enraged and attacks you with his sharp talons. Feathers are flying everywhere.",
    "img/page-icons/owl.svg",
    false,
    [{text: "Run away from the owl.", display: "true", nextPass: 10}]
  ));
  pages.push(new Page(25,
    "Zombie Attack",
    "You have nothing to fight off the zombies with, but your own two fists. You try punching a zombie. It does not go well. You barely escape with your life",
    "img/page-icons/woods.svg",
    false,
    [{text: "Keep running.", nextPass: 12}]
  ));
  pages.push(new Page(26,
    "YOU DIED!",
    "Oh no! The mushroom turned out to be poisoned. You died.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Play again?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(27,
    "YOU DIED!",
    "The zombies are still at the camp eating your friends. There are too many of them and you can't escape. They eat you.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Play again?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(28,
    "Ghost Attack",
    "you were attacked by a ghost.",
    "img/page-icons/ghost.svg",
    true,
    [{text: "Run away, again.", nextPass: 10}]
  ));
  pages.push(new Page(29,
    "YOU DIED!",
    "The zombies caught up with you before anyone came to help.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Play again?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(30,
    "YOU SURVIVED!",
    "Your prayers were answered, and a park ranger patrolling the forest found you and saved you.",
    "img/page-icons/sunrise.svg",
    true,
    [{text: "Play again?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(31,
    "Gnome Encounter",
    "The gnome ran away as quickly as it appeared. You glance at your bag and notice something is missing. The gnome took an item!",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Keep exploring the woods.", nextPass: 12}]
  ));
  pages.push(new Page(32,
    "YOU DIED!",
    "The dark forest proved to be more than you could handle.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Try again?", nextPass: 0, reset: 'true'}]
  ));
  return pages;
}
var book = new Book(setPages());

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
  $('.start').click(function() {
    $('.title').hide();
    $('.book').show();
    if ($(this).attr('id') === "boy") {
      $('#profilePic').html("<img src='img/boy.png' alt='Boy'>");
    } else {
      $('#profilePic').html("<img src='img/girl.png' alt='Girl'>");
    }
    changePage();
  });
  $('li').click(function() {
    var optionNum = $(this).attr('id').charAt(6);
    var option = book.currentPage.options[optionNum];
    book.loadPage(option);
    changePage();
  });
});
