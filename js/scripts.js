// Back end logic
function Player () {
  this.alive = true;
  this.health = 100;
  this.inv = [];
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
    "Owl Encounter",
    "You meet an owl. He gives you the following riddle: Three playing cards in a row. Can you name them with these clues? There is a two to the right of a king. A diamond will be found to the left of a spade. An ace is to the left of a heart. A heart is to the left of a spade. Now, identify all three cards. What is your answer?",
    "img/page-icons/owl.svg",
    false,
    [{text: "Ace of Diamonds, King of Hearts, Two of Spades.", nextPass: 11, itemPass: ["hat"]},
    {text: "King of Hearts, Ace of Diamonds, Two of Spades.", nextPass: 24, healthPass: -20}]
  ));
  owlPages.push(new Page(8,
    "Owl Encounter",
    "You meet an owl. He gives you the following riddle: It cannot be seen, cannot be felt, cannot be heard, cannot be smelt. It lies behind stars and under hills, and empty holes it fills. It comes first and follows after, ends life, kills laughter. What is your answer?",
    "img/page-icons/owl.svg",
    false,

    [{text: "Evil.", nextPass: 24, healthPass: -20},
    {text: "Dark.", nextPass: 11, itemPass: ["hat"]}]
  ));
  owlPages.push(new Page(8,
    "Owl Encounter",
    "You meet an owl. He gives you the following riddle: Alive without breath, as cold as death; Never thirsty, ever drinking, all in mail never clinking. What is your answer?",
    "img/page-icons/owl.svg",
    false,
    [{text: "Fish.", nextPass: 11, itemPass: ["hat"]},
    {text: "Vampire.", nextPass: 24, healthPass: -20}]
  ));
  var rand = Math.round(Math.random()*2);
  var owlPage = owlPages[rand];

  var pages = [];
  pages.push(new Page(0,
    "Zombie Attack",
    "You are sleeping peacefully in your tent when all of a sudden you hear the moans of an approaching zombie hoard. What do you do?",
    "img/page-icons/zombie.svg",
    false,
    [{text: "Run away!", nextPass: 1},
    {text: "Play dead.", nextPass: 2, healthPass: -1000}]
  ));
  pages.push(new Page(1,
    "The Woods",
    "You run into the woods and soon realize that you've lost your sense of direction! Now what?",
    "img/page-icons/woods.svg",
    false,
    [{text: "Try to find your way back to camp.", nextPass: 7, nextFail: 27, test: "Math.random() > 0.5", healthFail: -1000},
    {text: "Keep running.", nextPass: 3}]
  ));
  pages.push(new Page(2,
    "YOU DIED!",
    "The zombies were not fooled by your act. They mercilessly devoured your uncreative brain.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Try again?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(3,
    "The Woods",
    "You stop in a clearing to catch your breath. In the near distance, you notice a cave. Should you make for the cave or continue through the forest?",
    "img/page-icons/woods.svg",
    false,
    [{text: "Make for the cave.", nextPass: 5},
    {text: "Continue on your current path.", test: "Math.random() > 0.5", nextPass: 8, nextFail: 9}]
  ));
  pages.push(new Page(4,
    "YOU SURVIVED!",
    "You have survived the night and lived to find help in the morning.",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Play again?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(5,
    "The Cave",
    "Upon entering the cave, you see a shrouded figure standing in the dark depths of the cave. He welcomes you in an alluring voice, and you can't help but notice his sharp fangs as he speaks. He's a vampire!",
    "img/page-icons/cave.svg",
    false,
    [{text: "Attack him.", nextPass: 6, nextFail: 2, test: "book.player.invContains('axe')", healthPass: -50, healthFail: -1000},
    {text: "Strike up a conversation.", nextPass: 17, itemPass: ["amulet"]}]
  ));
  pages.push(new Page(6,
    "You Did It!",
    "With a swing of your mighty axe, you slay the vampire!",
    "img/page-icons/vampire.svg",
    false,
    [{text: "Explore the cave.", nextPass: 18, itemPass: ["mushroom"]},
    {text: "Get the heck outta there!", nextPass: 10}]
  ));
  pages.push(new Page(7,
    "A Small Victory",
    "You manage to find your way back. After searching the trampled campsite, you find your axe still in the stump where you left it.",
    "img/page-icons/axe.svg",
    false,
    [{text: "Pick it up and continue on.", nextPass: 3, itemPass: ["axe"]}]
  ));
  pages.push(owlPage);
  pages.push(new Page(9,
    "The Lodge",
    "You stumble upon an abandoned hunting lodge.",
    "img/page-icons/lodge.svg",
    false,
    [{text: "Explore the lodge.", nextPass: 28, healthPass: -20, itemPass: ["compass", "water"]}]
  ));
  pages.push(new Page(10,
    "Zombie Attack",
    "As you make your way through the woods, a zombie crashes out of the trees right into you!",
    "img/page-icons/zombie.svg",
    false,
    [{text: "Defend yourself!", test: "book.player.invContains('axe')", nextPass: 16, nextFail: 25, healthPass: -30, healthFail: -60}]
  ));
  pages.push(new Page(11,
    "YOU SURVIVED!",
    "The owl's riddle proved to be no match for your wit. As the owl turns to fly away, it drops a large conical hat at your feet. You put it on and find yourself teleported to safety out of the woods.",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Play again?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(12,
    "A Myserious Stranger",
    "As you look ahead through the trees, you notice a mysterious stranger sitting under a tree.",
    "img/page-icons/person.svg",
    false,
    [{text: "Confront them.", nextPass: 13},
    {text: "Avoid them.", nextPass: 19}]
  ));
  pages.push(new Page(13,
    "A Mysterious Stranger",
    "The mysterious stranger looks up as you approach. The stranger stands and begins to reach for something in their pocket...",
    "img/page-icons/person.svg",
    false,
    [{text: "Offer to trade your water bottle for help.", nextPass: 14, display: "book.player.invContains('water')", itemRemovePass: ["water"]},
    {text: "Give the mushroom to them as a peace offering.", nextPass: 20, display: "book.player.invContains('mushroom')", itemRemovePass: ["mushroom"]},
    {text: "Attack! Better safe than sorry.", test: "book.player.invContains('axe')" , nextPass: 21, nextFail: 22, healthFail: -40, healthPass: -20, itemPass: ["knife"]}]
  ));
  pages.push(new Page(14,
    "A Mysterious Stranger",
    "The stranger accepts your water and in return offers you a map of the area.",
    "img/page-icons/woods.svg",
    false,
    [{text: "Thank the stranger and take the map.", itemPass: ["map"], itemFail: ["map"], nextPass: 15, nextFail: 19, test: "book.player.invContains('compass')"}]
  ));
  pages.push(new Page(15,
    "YOU SURVIVED!",
    "Using the map and compass, you are able to navigate your way out of the woods.",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Play again?", nextPass: 0, reset: 'true'}]
  ));

  pages.push(new Page(16,
    "Zombie Attack",
    "Quick on your feet, you break away from the zombie and subdue it with a swing of your axe.",
    "img/page-icons/zombie.svg",
    false,
    [{text: "Continue on.", nextPass: 12}]
  ));
  pages.push(new Page(17,
    "Vampire Encounter",
    "The vampire senses your desperation. He gives you a shiny amulet from around his neck. It looks valuable. You feel safer wearing it. You hear the zombies approaching in the distance. What do you do?",
    "img/page-icons/vampire.svg",
    false,
    [{text: "Run out of the cave immediately.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.7 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]},
    {text: "Thank the vampire and leave the cave.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.9 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]}]
  ));
  pages.push(new Page(18,
    "The Cave",
    "You run deeper into the cave and you come to a dead end. On the ground below you, you find a patch of mushrooms. You pick one up to examine it. It looks odd. What will you do with it?",
    "img/page-icons/cave.svg",
    false,
    [{text: "Place the mushroom in your pocket, and leave the cave.", nextPass: 10},
    {text: "Eat the mushroom.", nextPass: 26, healthPass: -1000, itemRemovePass: ["mushroom"]}]
  ));
  pages.push(new Page(19,
    "The Woods",
    "Stumbling from fear, you continue deeper into the forest. In your haste to get away, you fall into a bear trap. What do you do?",
    "img/page-icons/woods.svg",
    false,
    [{text: "Try to use your knife to free yourself from the bear trap.", display: "book.player.invContains('knife')", nextPass: 23},
    {text: "Wait and hope someone finds you.", test: "Math.random() > 0.8", nextPass: 30, nextFail: 29, healthFail: -1000}]
  ));
  pages.push(new Page(20,
    "The Mysterious Stranger",
    "The mysterious stranger eats your mushroom. The mushroom turned out to be poisoned! The mysterious stranger chokes and dies. You see a knife at his side. What do you do?",
    "img/page-icons/person.svg",
    false,
    [{text: "Take the knife.", itemPass: ["knife"], nextPass: 19},
    {text: "Run away immediately.", nextPass: 19}]
  ));
  pages.push(new Page(21,
    "The Mysterious Stranger",
    "You use the axe to kill the mysterious stranger. It was a brief struggle, but you quickly overpower them. You see a knife by their side. What do you do?",
    "img/page-icons/person.svg",
    false,
    [{text: "Take the knife.", nextPass: 19, itemPass: ["knife"]},
    {text: "Run away immediately.", nextPass: 19}]
  ));
  pages.push(new Page(22,
    "A Mysterious Stranger",
    "You fight the stranger with your bare hands. They pull out a knife and swing wildly. What do you do?",
    "img/page-icons/person.svg",
    false,
    [{text: "Run away.", nextPass: 19},
    {text: "Keep fighting.", nextPass: 33}]
  ));
  pages.push(new Page(23,
    "The Woods",
    "You try to use the knife to free yourself from the bear trap. Slowly and painfully, you eventually manage to take the trap apart. Exhausted, you see the sun rise in the distance.",
    "img/page-icons/woods.svg",
    false,
    [{text: "Stumble out of forest.", nextPass: 4}]
  ));
  pages.push(new Page(24,
    "Owl Encounter",
    "Wrong answer! The owl is enraged and attacks you with his sharp talons. Feathers are flying everywhere. What do you do?",
    "img/page-icons/owl.svg",
    false,
    [{text: "Run away from the owl.", nextPass: 10},
    {text: "Try to fight the owl.", nextPass: 34, nextFail: 35, test: "book.player.invContains('axe')", healthPass: -10, healthFail: -20}]
  ));
  pages.push(new Page(25,
    "Zombie Attack",
    "You have nothing to fight off the zombies with, but your own two fists. You try punching a zombie. It does not go well. You barely escape with your life.",
    "img/page-icons/woods.svg",
    false,
    [{text: "Keep running.", nextPass: 12}]
  ));
  pages.push(new Page(26,
    "YOU DIED!",
    "Oh no! The mushroom turned out to be poisoned. You choke and sputter, falling to the ground.",
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
    "You find the vengeful ghost of a former ranger. The room suddenly feels freezing. Objects fly everywhere. What do you do?",
    "img/page-icons/ghost.svg",
    true,
    [{text: "Run away.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.8 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]},
    {text: "Try to talk to the ghost.", nextPass: 36, healthPass: -20}]
  ));
  pages.push(new Page(29,
    "YOU DIED!",
    "You wait for what seems like ages. A noise comes from over the ridge. The zombie horde catches up with you again.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Play again?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(30,
    "YOU SURVIVED!",
    "Your prayers were answered, and a park ranger patrolling the woods finds you. The ranger frees you from the bear trap and guides you out of the forest.",
    "img/page-icons/sunrise.svg",
    true,
    [{text: "Play again?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(31,
    "Gnome Encounter",
    "You feel something brush up against your leg. Looking around, you notice a pointy hat bouncing away into the bushes. Your pockets feel a little bit lighter.",
    "img/page-icons/gnome.svg",
    false,
    [{text: "Keep moving forward.", nextPass: 12}]
  ));
  pages.push(new Page(32,
    "YOU DIED!",
    "The dark forest proved to be more than you could handle.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Try again?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(33,
    "YOU DIED!",
    "The mysterious stranger proved to be more than you could handle.",
    "img/page-icons/rip.svg",
    true,
    [{text: "Try again?", nextPass: 0, reset: 'true'}]
  ));
  pages.push(new Page(34,
    "Owl Encounter",
    "You swing your axe at the owl. The owl disappers into the night.",
    "img/page-icons/owl.svg",
    false,
    [{text: "Keep exploring.", nextPass: 10}]
  ));
  pages.push(new Page(35,
    "Owl Encounter",
    "You fight the owl with your bare hands. The owl continues to rip into your flesh with its talons. What do you do?",
    "img/page-icons/owl.svg",
    false,
    [{text: "Run away.", nextPass: 10},
    {text: "Keep fighting the owl.", nextPass: 37, nextFail: 38, healthPass: -20, healthFail: -20, itemPass: ["hat"], test: "Math.random() > 0.5"}]
  ));
  pages.push(new Page(36,
    "Ghost Attack",
    "The ghost ignores your plea. What do you do?",
    "img/page-icons/ghost.svg",
    true,
    [{text: "Run away.", nextPass: 31, nextFail: 10, test: "Math.random() > 0.8 && (book.player.invContains('amulet') || book.player.invContains('compass'))", itemRemovePass: ["amulet", "compass"]},
    {text: "Try to talk to the ghost again.", nextPass: 36, healthPass: -20}]
  ));
  pages.push(new Page(37,
    "YOU SURVIVED!",
    "You successfully killed the owl with your bare hands. You find a magical hat. You put on the hat and it teleports you out of the forest.",
    "img/page-icons/sunrise.svg",
    false,
    [{text: "Play again?", nextPass: 0, reset: true}]
  ));
  pages.push(new Page(38,
    "Owl Encounter",
    "You successfully killed the owl with your bare hands.",
    "img/page-icons/woods.svg",
    false,
    [{text: "Keep exploring.", nextPass: 10}]
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
