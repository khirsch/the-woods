// Back end logic
function Player () {
  this.health = 100;
  this.axeHealth = 100;
  this.inv = [];
}
Player.prototype.invContains = function(item) {
  return this.inv.indexOf(item) >= 0;
}
Player.prototype.removeItems = function(items) {
  var inv = this.inv;
  items.forEach(function(item) {
    if(inv.indexOf(item) >= 0) {
      var location = inv.indexOf(item);
      inv.splice(location, 1);
    }
  });
  this.inv = inv;
}
function Page (number, subtitle, prompt, img, options) {
  this.number = number;
  this.subtitle = subtitle;
  this.prompt = prompt;
  this.img = img;
  Object.defineProperties(this, {
    "options": {
      get: function() {
        var newOptions = []
        options.forEach(function(option) {
          var display = true;
          if (option.display) {
            display = eval(option.display);
          }
          if (display) {
            newOptions.push(option);
          }
        });
        return newOptions;
      }
    }
  });
}
function Book (pages) {
  this.pages = pages;
  this.currentPage = pages[0];
  this.player = new Player();
  this.gameOver = false;
  this.startOver = false;
  this.win = false;
}
Book.prototype.loadPage = function(option) {
  var outcome = true;
  if (option.test) {
    outcome = eval(option.test);
  }
  if (outcome && option.healthPass && this.player.invContains("amulet")) {
    this.player.health += option.healthPass * 0.5;
  } else if (outcome && option.healthPass) {
    this.player.health += option.healthPass;
  } else if (!outcome && option.healthFail && this.player.invContains("amulet")) {
    this.player.health += option.healthFail * 0.5;
  } else if (!outcome && option.healthFail) {
    this.player.health += option.healthFail;
  }
  if (outcome && option.itemPass) {
      this.player.inv = this.player.inv.concat(option.itemPass);
  } else if (!outcome && option.itemFail) {
      this.player.inv = this.player.inv.concat(option.itemFail);
  }
  if(outcome && option.itemRemovePass) {
    this.player.removeItems(option.itemRemovePass);
  } else if (!outcome && option.itemRemoveFail) {
    this.player.removeItems(option.itemRemoveFail);
  }
  if (option.axeHealth && this.player.invContains("axe")) {
    this.player.axeHealth += option.axeHealth;
    if (this.player.axeHealth <= 0) {
      this.player.removeItems(['axe']);
    }
  }
  if (this.player.health <= 0) {
    this.gameOver = true;
    this.currentPage = this.pages[32];
  } else if (outcome) {
    this.currentPage = this.pages[option.nextPass];
  } else {
    this.currentPage = this.pages[option.nextFail];
  }
  if (outcome && option.win) {
    this.win = true;
  } else if (!outcome && option.gameOverFail) {
    this.gameOver = true;
    book.player.health = 0;
  } else if (option.reset) {
    this.startOver = true;
  }
}
Book.prototype.reset = function() {
  this.currentPage = this.pages[0];
  this.player = new Player();
  this.gameOver = false;
  this.pages = setPages();
  this.startOver = false;
  this.win = false;
}
function setPages() {
  var owlPages = [];
  owlPages.push(new Page(8,
    "Owl Encounter",
    "An owl flies over and lands on a branch near your head. He gives you the following riddle: Three playing cards in a row. Can you name them with these clues? There is a Two to the right of a King. A Diamond will be found to the left of a Spade. An Ace is to the left of a Heart. A Heart is to the left of a Spade. What is your answer?",
    "img/page-icons/owl.svg",
    [{text: "Ace of Diamonds, King of Hearts, Two of Spades.", nextPass: 11, itemPass: ["hat"], win: true},
    {text: "King of Hearts, Ace of Diamonds, Two of Spades.", nextPass: 24, healthPass: -20}]
  ));
  owlPages.push(new Page(8,
    "Owl Encounter",
    "An owl flies over and lands on a branch near your head. He gives you the following riddle: It cannot be seen, cannot be felt, cannot be heard, cannot be smelt. It lies behind stars and under hills, and empty holes it fills. It comes first and follows after, ends life, kills laughter. What is your answer?",
    "img/page-icons/owl.svg",
    [{text: "Evil.", nextPass: 24, healthPass: -20},
    {text: "Darkness.", nextPass: 11, itemPass: ["hat"], win: true}]
  ));
  owlPages.push(new Page(8,
    "Owl Encounter",
    "An owl flies over and lands on a branch near your head. He gives you the following riddle: Alive without breath, as cold as death. Never thirsty, ever drinking. All in mail, never clinking. What is your answer?",
    "img/page-icons/owl.svg",
    [{text: "Fish.", nextPass: 11, itemPass: ["hat"], win: true},
    {text: "Vampire.", nextPass: 24, healthPass: -20}]
  ));
  var rand = Math.round(Math.random()*2);
  var owlPage = owlPages[rand];
  var pages = [];
  pages.push(new Page(0,
    "Zombie Attack",
    "You are sleeping peacefully in your tent when all of a sudden you hear the moans of an approaching zombie horde. What do you do?",
    "img/page-icons/zombie.svg",
    [{text: "Run away!", nextPass: 1},
    {text: "Play dead.", nextFail: 2, test: "false", gameOverFail: true}]
  ));
  pages.push(new Page(1,
    "The Woods",
    "You run into the woods and soon realize that you've lost your sense of direction. Now what?",
    "img/page-icons/woods.svg",
    [{text: "Try to find your way back to camp.", nextPass: 7, nextFail: 27, test: "Math.random() > 0.5", gameOverFail: true},
    {text: "Keep running.", nextPass: 3}]
  ));
  pages.push(new Page(2,
    "YOU DIED!",
    "The zombies were not fooled by your act. They mercilessly devoured your uncreative brain.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(3,
    "The Woods",
    "You stop in a clearing to catch your breath. In the near distance, you notice a cave.",
    "img/page-icons/woods.svg",
    [{text: "Make for the cave.", nextPass: 5},
    {text: "Continue through the woods.", test: "Math.random() > 0.5", nextPass: 8, nextFail: 9}]
  ));
  pages.push(new Page(4,
    "YOU SURVIVED!",
    "You have survived the night and lived to find help in the morning.",
    "img/page-icons/sunrise.svg",
    [{text: "Start over?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(5,
    "The Cave",
    "Upon entering the cave, you see a shrouded figure standing in the dark depths. He welcomes you in an alluring voice, and you can't help but notice his sharp fangs as he speaks. He's a vampire!",
    "img/page-icons/cave.svg",
    [{text: "Attack him.", nextPass: 6, nextFail: 39, test: "book.player.invContains('axe')", healthPass: -50, gameOverFail: true, axeHealth: -50},
    {text: "Strike up a conversation.", nextPass: 17, itemPass: ["amulet"]}]
  ));
  pages.push(new Page(6,
    "You Did It!",
    "With a swing of your mighty axe, you slay the vampire!",
    "img/page-icons/vampire.svg",
    [{text: "Explore the cave.", nextPass: 18, itemPass: ["mushroom"]},
    {text: "Get the heck outta there!", nextPass: 10}]
  ));
  pages.push(new Page(7,
    "A Small Victory",
    "You manage to find your way back. After searching the trampled campsite, you find your axe still in the stump where you left it.",
    "img/page-icons/axe.svg",
    [{text: "Pick it up and continue on.", nextPass: 3, itemPass: ["axe"]}]
  ));
  pages.push(owlPage);
  pages.push(new Page(9,
    "The Lodge",
    "You stumble upon an abandoned hunting lodge.",
    "img/page-icons/lodge.svg",
    [{text: "Go inside.", nextPass: 28, healthPass: -20, itemPass: ["compass", "water"]},
    {text: "Continue through the woods.", nextPass: 10}]
  ));
  pages.push(new Page(10,
    "Zombie Attack",
    "As you make your way through the woods, a zombie crashes out of the trees and lunges at you!",
    "img/page-icons/zombie.svg",
    [{text: "Defend yourself.", test: "book.player.invContains('axe')", nextPass: 16, nextFail: 25, healthPass: -30, healthFail: -60, axeHealth: -50},
    {text: "Cower in fear.", nextFail: 32, test: "false", gameOverFail: true}]
  ));
  pages.push(new Page(11,
    "YOU SURVIVED!",
    "The owl's riddle proved to be no match for your wit. As the owl turns to fly away, it drops a large conical hat at your feet. You put it on and find yourself teleported safely out of the woods.",
    "img/page-icons/sunrise.svg",
    [{text: "Start over?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(12,
    "A Mysterious Stranger",
    "As you look ahead through the trees, you notice a mysterious stranger sitting in a clearing. What do you do?",
    "img/page-icons/person.svg",
    [{text: "Confront them.", nextPass: 13},
    {text: "Avoid them.", nextPass: 19}]
  ));
  pages.push(new Page(13,
    "A Mysterious Stranger",
    "The mysterious stranger looks up as you approach. The stranger stands and begins to reach for something in their pocket...",
    "img/page-icons/person.svg",
    [{text: "Offer to trade your water bottle for help.", nextPass: 14, display: "book.player.invContains('water')", itemRemovePass: ["water"]},
    {text: "Give the mushroom to them as a peace offering.", nextPass: 20, display: "book.player.invContains('mushroom')", itemRemovePass: ["mushroom"]},
    {text: "Attack them. Better safe than sorry!", test: "book.player.invContains('axe')" , nextPass: 21, nextFail: 22, healthFail: -40, healthPass: -20, axeHealth: -50},
    {text: "Run away.", nextPass: 19, display: "!book.player.invContains('water') && !book.player.invContains('mushroom')"}]
  ));
  pages.push(new Page(14,
    "A Mysterious Stranger",
    "The stranger accepts your water and in return offers you a map of the area.",
    "img/page-icons/woods.svg",
    [{text: "Thank the stranger and take the map.", itemPass: ["map"], itemFail: ["map"], nextPass: 15, nextFail: 19, test: "book.player.invContains('compass')", win: true}]
  ));
  pages.push(new Page(15,
    "YOU SURVIVED!",
    "Using the map and compass, you are able to navigate your way out of the woods.",
    "img/page-icons/sunrise.svg",
    [{text: "Start over?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(16,
    "Zombie Attack",
    "Quick on your feet, you dodge the zombie and subdue it with a swing of your axe.",
    "img/page-icons/zombie.svg",
    [{text: "Continue on.", nextPass: 12}]
  ));
  pages.push(new Page(17,
    "Vampire Encounter",
    "The vampire senses your desperation. He gives you a shiny amulet from around his neck; it looks valuable. You feel safer wearing it. You hear a zombie approaching in the distance. What do you do?",
    "img/page-icons/vampire.svg",
    [{text: "Run out of the cave in a panic.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.7 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]},
    {text: "Thank the vampire and leave the cave.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.9 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]}]
  ));
  pages.push(new Page(18,
    "The Cave",
    "You explore deeper into the cave and you come to a dead end. On the ground, you find a patch of mushrooms. You pick one up to examine it. It looks odd. What do you do with it?",
    "img/page-icons/cave.svg",
    [{text: "Place the mushroom in your pocket and leave the cave.", nextPass: 10},
    {text: "Eat the mushroom.", test: "false", nextFail: 26, gameOverFail: true, itemRemoveFail: ["mushroom"]}]
  ));
  pages.push(new Page(19,
    "The Woods",
    "Stumbling from fear, you continue deeper into the woods. Caught unaware, you fall into a bear trap!",
    "img/page-icons/woods.svg",
    [{text: "Try to use the knife to free yourself from the bear trap.", display: "book.player.invContains('knife')", nextPass: 23},
    {text: "Wait and hope someone finds you.", test: "Math.random() > 0.8", nextPass: 30, nextFail: 29, gameOverFail: true, win: true}]
  ));
  pages.push(new Page(20,
    "A Mysterious Stranger",
    "The mysterious stranger eats the mushroom. As it turns out, it was poisonous! The stranger chokes and dies. You see a knife at their side. Do you pick it up?",
    "img/page-icons/person.svg",
    [{text: "Yes, it may be useful.", itemPass: ["knife"], nextPass: 19},
    {text: "No, it could be dangerous.", nextPass: 19}]
  ));
  pages.push(new Page(21,
    "A Mysterious Stranger",
    "You use the axe to kill the mysterious stranger. It was a brief struggle, but you quickly overpowered them. You see a knife by their side. Do you pick it up?",
    "img/page-icons/person.svg",
    [{text: "Yes, it may be useful.", nextPass: 19, itemPass: ["knife"]},
    {text: "No, it could be dangerous.", nextPass: 19}]
  ));
  pages.push(new Page(22,
    "A Mysterious Stranger",
    "You attempt to fight the stranger with your bare hands. They pull out a knife and swing wildly. What do you do?",
    "img/page-icons/person.svg",
    [{text: "Run away.", nextPass: 19},
    {text: "Stand your ground.", nextFail: 33, test: "false", gameOverFail: true}]
  ));
  pages.push(new Page(23,
    "The Woods",
    "You try to use the knife to free yourself. Slowly but surely, you manage to take the trap apart. You hear the sound of rushing water nearby.",
    "img/page-icons/woods.svg",
    [{text: "Follow the sound.", nextPass: 41},
    {text: "Head in the opposite direction.", nextPass: 42, win: true}]
  ));
  pages.push(new Page(24,
    "Owl Encounter",
    "Wrong answer! The owl is enraged and attacks you with his sharp talons. Feathers are flying everywhere. What do you do?",
    "img/page-icons/owl.svg",
    [{text: "Run away from the owl.", nextPass: 10},
    {text: "Try to fight the owl.", nextPass: 34, nextFail: 35, test: "book.player.invContains('axe')", healthPass: -10, healthFail: -20, axeHealth: -50}]
  ));
  pages.push(new Page(25,
    "Zombie Attack",
    "You have nothing to fight off the zombie with but your own two fists. You try punching it. It does not go well, but you still manage to escape.",
    "img/page-icons/woods.svg",
    [{text: "Keep going.", nextPass: 12}]
  ));
  pages.push(new Page(26,
    "YOU DIED!",
    "Oh no! The mushroom turned out to be poisonous. You choke and sputter, then fall to the ground.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(27,
    "YOU DIED!",
    "While looking for the campsite, you encounter the horde. There are too many of them and you can't escape. They eat you.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(28,
    "Ghost Attack",
    "Upon exploring the lodge, you find a compass and a bottle of water. You also find the vengeful ghost of a former ranger! The room suddenly feels freezing. Objects fly everywhere. What do you do?",
    "img/page-icons/ghost.svg",
    [{text: "Run away.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.8 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]},
    {text: "Beg for mercy.", nextPass: 36, healthPass: -20}]
  ));
  pages.push(new Page(29,
    "YOU DIED!",
    "You wait for what seems like ages. Suddenly, a noise comes from over the ridge. The zombie horde has caught up with you! They eat you.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(30,
    "YOU SURVIVED!",
    "Your prayers were answered! A park ranger patrolling the woods has found you. The ranger frees you from the bear trap and guides you out of the woods.",
    "img/page-icons/sunrise.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(31,
    "Gnome Encounter",
    "You feel something brush up against your leg. Looking around, you notice a pointy hat bouncing away into the bushes. Your pockets feel a little bit lighter.",
    "img/page-icons/gnome.svg",
    [{text: "Keep moving forward.", nextPass: 12}]
  ));
  pages.push(new Page(32,
    "YOU DIED!",
    "The dark woods proved to be more than you could handle.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(33,
    "YOU DIED!",
    "The mysterious stranger proved to be more than you could handle.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(34,
    "Owl Encounter",
    "You swing your axe at the owl. The owl disappears into the night.",
    "img/page-icons/owl.svg",
    [{text: "Keep exploring.", nextPass: 10}]
  ));
  pages.push(new Page(35,
    "Owl Encounter",
    "You fight the owl with your bare hands. The owl continues to rip into your flesh with its talons. What do you do?",
    "img/page-icons/owl.svg",
    [{text: "Run away!", nextPass: 10},
    {text: "Keep fighting the owl.", nextPass: 37, nextFail: 38, healthPass: -20, healthFail: -20, itemPass: ["hat"], test: "Math.random() > 0.5", win: true}]
  ));
  pages.push(new Page(36,
    "Ghost Attack",
    "The ghost ignores your plea and begins to attack you. What do you do?",
    "img/page-icons/ghost.svg",
    [{text: "Run away.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.8 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]},
    {text: "Close your eyes and hope it goes away.", nextPass: 40, healthPass: -20}]
  ));
  pages.push(new Page(37,
    "YOU SURVIVED!",
    "You successfully killed the owl with your bare hands. You find a conical hat. You put on the hat and it teleports you out of the woods.",
    "img/page-icons/sunrise.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(38,
    "Owl Encounter",
    "You successfully killed the owl with your bare hands.",
    "img/page-icons/woods.svg",
    [{text: "Keep exploring.", nextPass: 10}]
  ));
  pages.push(new Page(39,
  "YOU DIED!",
    "The vampire proved to be more than you could handle.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(40,
    "Ghost Attack",
    "The ghost continues to attack you. What do you do?",
    "img/page-icons/ghost.svg",
    [{text: "Run away.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.8 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]},
    {text: "Try to hide.", nextPass: 40, healthPass: -20}]
  ));
  pages.push(new Page(41,
    "The Waterfall",
    "Following the sound, you find a waterfall. You glimpse an alcove beyond the falls.",
    "img/page-icons/waterfall.svg",
    [{text: "Explore the alcove.", nextFail: 43, test: "false", gameOverFail: true},
    {text: "Follow the stream.", nextPass: 44, win: true}]
  ));
  pages.push(new Page(42,
    "YOU SURVIVED!",
    "You stumble down the path. You see the sun rising in the distance and make your way out of the woods.",
    "img/page-icons/sunrise.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(43,
    "YOU DIED!",
    "As you navigate towards the alcove, the rocks prove too slippery. You fall and break your neck.",
    "img/page-icons/rip.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(44,
    "YOU SURVIVED!",
    "You follow the stream, which just so happens to be a way out of the woods.",
    "img/page-icons/sunrise.svg",
    [{text: "Start over?", nextPass: 0, reset: true}]
  ));
  return pages;
}
var book = new Book(setPages());

// Front end logic
$(document).ready(function() {
  function loadStartPage() {
    $('.title h1').fadeIn();
    setTimeout(function() {
      $('.title #mainSubtitle').fadeIn();
    }, 1000);
    setTimeout(function() {
      $('.title #character').fadeIn();
    }, 2000);
  }
  loadStartPage();
  function changePageInfo() {
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
    $('#axeCurrentHealth').css("width",book.player.axeHealth + "%");
    if (book.player.axeHealth === 0) {
      $('#axe').addClass("axeBroken");
      $('#axe').show();
    } else {
      $('#axe').removeClass("axeBroken");
    }
  }
  function changePage() {
    if (book.startOver) {
      $('.bottomLine').hide();
      $('body').removeClass();
      $('body').addClass("backgroundStart");
      book.reset();
      $('.book').fadeOut(function() {
        changePageInfo();
        $('.title').fadeIn();
      });
      loadStartPage();
    } else if (book.win) {
      $('body').removeClass("backgroundStart");
      $('body').addClass("backgroundWin");
      changePageInfo();
    } else if (book.gameOver) {
      $('body').removeClass("backgroundStart");
      $('body').addClass("backgroundLose");
      changePageInfo();
    } else {
      $('.story').addClass("fadeOut");
      setTimeout(function() {
        changePageInfo();
        $('.story').removeClass("fadeOut");
        $('.story').addClass("fadeIn");
      }, 100);
    }
  }
  $('.start').click(function() {
    $('.title').hide();
    $('.book').show();
    $('.bottomLine').show();
    if ($(this).attr('id') === "boy") {
      $('#profilePic').html("<img src='img/boy.svg' alt='Boy'>");
    } else {
      $('#profilePic').html("<img src='img/girl.svg' alt='Girl'>");
    }
    changePageInfo();
    $('.title h1').hide();
    $('.title #mainSubtitle').hide();
    $('.title #character').hide();
    $('.story').addClass("fadeIn");
  });
  $('li').click(function() {
    var optionNum = $(this).attr('id').charAt(6);
    var option = book.currentPage.options[optionNum];
    book.loadPage(option);
    changePage();
  });
});
