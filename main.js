$(function() {
	// ---- CANVAS UTILS ----

	// Scale image
	var scaleImageToFit = function scaleImageToFit(imgWidth, imgHeight, maxWidth, maxHeight) {
		var ratio = 0;
		if (imgWidth > imgHeight)
			ratio = maxWidth / imgWidth;
		else
			ratio = maxHeight / imgHeight;
		return [imgWidth * ratio, imgHeight * ratio];
	};

	// Wrap canvas text
	var wrapText = function wrapText(context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var line = '';
		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	};

	var darkText = '#222222';
	var numberFont = '56pt "Highlander Std Bold"';
	var titleFont = 'bolder 56pt "kingthings_petrockregular"';

	var numberText = function numberText(context, number, color, x, y) {
		context.shadowColor = "black";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 7;
		context.lineWidth = 6;
		context.font = numberFont;
		context.fillStyle = color;
		context.strokeStyle = 'white';
		context.shadowColor = "rgba( 0, 0, 0, 1 )";
		context.strokeText(number, x, y);
		context.shadowColor = "rgba( 0, 0, 0, 0 )";
		context.fillText(number, x, y);

		return context;
	};

	var nameText = function nameText(context, name, color, x, y) {
		context.font = titleFont;
		context.textAlign = 'center';
		context.fillStyle = color;
		context.strokeStyle = 'white';
		context.lineWidth = 3;
		context.strokeText(name, x, y);
		context.fillText(name, x, y);

		return context;
	};

	// Generate Hero - Converts image to canvas; returns new canvas element
	var generateHero = function generateHero(image, heroData) {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.id = "hero";
		var centerX = canvas.width / 2;
		var context = canvas.getContext("2d");

		// background
		context.drawImage(image, 0, 0);

		// hero
		if (document.getElementById('hero-drop').childNodes.length && document.getElementById('hero-drop').firstChild.tagName === 'IMG') {
			var heroImage = new Image();
			heroImage.src = document.getElementById("hero-drop").firstChild.src;
			var heroW = 500;
			var heroH = 500;
			var resizedImage = scaleImageToFit(heroImage.width, heroImage.height, heroW, heroH);
			var heroX = ((heroW - resizedImage[0]) / 2) + 490;
			var heroY = ((heroH - resizedImage[1]) / 2) + 160;
			context.drawImage(heroImage, 0, 0, heroImage.width, heroImage.height, heroX, heroY, resizedImage[0], resizedImage[1]);
		}

		context = nameText(context, heroData.name, '#a72a0c', centerX, 88); // name
		context = numberText(context, heroData.defense, '#d75e00', 173, 250); // defense
		context = numberText(context, heroData.health, '#3c315f', 365, 250); // health

		// ability
		context.font = 'small-caps 24pt "Highlander Std Bold"';
		context.textAlign = 'center';
		context.fillStyle = darkText;
		context.strokeStyle = 'white';
		context.lineWidth = 1;
		context.fillText(heroData.ability, 290, 322);

		// description
		context.fillStyle = 'white';
		context.font = '24pt "Highlander Std Book"';
		var maxWidth = 300;
		var lineHeight = 36;
		var x = 298;
		var y = 386;
		var text = heroData.description;
		wrapText(context, text, x, y, maxWidth, lineHeight);

		return convertCanvasToImage(canvas);
	};


	// Generate Monster
	var generateMonster = function generateMonster(blankCard, monsterData) {
		var canvas = document.createElement("canvas");
		canvas.width = blankCard.width;
		canvas.height = blankCard.height;
		canvas.id = "monster";
		var centerX = canvas.width / 2;
		var context = canvas.getContext("2d");

		// background
		context.drawImage(blankCard, 0, 0);

		// monster
		if (document.getElementById('monster-drop').childNodes.length && document.getElementById('monster-drop').firstChild.tagName === 'IMG') {
			var monsterImage = new Image();
			monsterImage.src = document.getElementById("monster-drop").firstChild.src;
			var monsterW = 745;
			var monsterH = 510;
			var resizedImage = scaleImageToFit(monsterImage.width, monsterImage.height, monsterW, monsterH);
			var monsterX = ((monsterW - resizedImage[0]) / 2);
			var monsterY = ((monsterH - resizedImage[1]) / 2) + 160;
			context.drawImage(monsterImage, 0, 0, monsterImage.width, monsterImage.height, monsterX, monsterY, resizedImage[0], resizedImage[1]);
		}
		// overlays
		var typeOverlay = document.getElementById("monster-" + monsterData.attackType.toLowerCase() + "-src");
		var defenseOverlay = document.getElementById("monster-defense-src");
		context.drawImage(typeOverlay, 0, 0);
		if (monsterData.defense !== '' && monsterData.defense !== '0' && monsterData.defense !== 0) {
			context.drawImage(defenseOverlay, 0, 0);
		}


		var nameColor = '#BC6A42';
		switch (monsterData.level) {
			case "1":
				nameColor = '#d75e00';
				break;
			case "2-3":
				nameColor = '#7C3A2C';
				break;
			case "4-5":
				nameColor = '#5C3F51';
				break;
			case "6":
				nameColor = '#3C265D';
				break;
		}
		context = nameText(context, monsterData.name, nameColor, centerX, 88); // name

		// tier
		context.font = 'bolder 32pt "kingthings_petrockregular"';
		context.textAlign = 'center';
		context.fillStyle = nameColor;
		context.strokeStyle = 'white';
		context.lineWidth = 3;
		context.strokeText(monsterData.tier, centerX, 140);
		context.fillText(monsterData.tier, centerX, 140);

		context = numberText(context, monsterData.gold, '#346391', 620, 227); // reward
		context = numberText(context, monsterData.health, '#3c315f', 118, 227); // health
		context = numberText(context, monsterData.overkill, '#2F281E', 118, 340); // overkill
		if (monsterData.defense !== '' && monsterData.defense !== '0' && monsterData.defense !== 0) {
			context = numberText(context, monsterData.defense, '#d75e00', 118, 454); // defense
		}
		context = numberText(context, monsterData.movement, '#c93e65', 118, 740); // move
		context = numberText(context, monsterData.attack, '#B83D2B', 585, 740); // attack

		// ability
		context.font = 'small-caps 32pt "Highlander Std Bold"';
		context.textAlign = 'center';
		context.fillStyle = darkText;
		context.strokeStyle = 'white';
		context.lineWidth = 1;
		context.fillText(monsterData.ability, centerX, 773);
		// description
		context.fillStyle = 'white';
		context.font = '24pt "Highlander Std Book"';
		var maxWidth = 500;
		var lineHeight = 36;
		var x = centerX;
		var y = 840;
		var text = monsterData.description;
		wrapText(context, text, x, y, maxWidth, lineHeight);

		return convertCanvasToImage(canvas);
	};


	// Generate Quest
	var generateQuest = function generateQuest(image, questData) {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.id = "quest";
		var centerX = canvas.width / 2;
		var context = canvas.getContext("2d");
		// background
		context.drawImage(image, 0, 0);
		// quest
		if (document.getElementById('quest-drop').childNodes.length && document.getElementById('quest-drop').firstChild.tagName === 'IMG') {
			var questImage = new Image();
			questImage.src = document.getElementById("quest-drop").firstChild.src;
			var questW = 500;
			var questH = 500;
			var resizedImage = scaleImageToFit(questImage.width, questImage.height, questW, questH);
			var questX = ((questW - resizedImage[0]) / 2) + 150;
			var questY = ((questH - resizedImage[1]) / 2) + 360;
			context.drawImage(questImage, 0, 0, questImage.width, questImage.height, questX, questY, resizedImage[0], resizedImage[1]);
		}
		// name
		context.font = 'bolder 56pt "kingthings_petrockregular"';
		context.textAlign = 'center';
		context.fillStyle = '#5B4C2D';
		context.strokeStyle = 'white';
		context.lineWidth = 3;
		context.strokeText(questData.name, centerX, 200);
		context.fillText(questData.name, centerX, 200);
		// description
		context.fillStyle = 'white';
		context.font = '24pt "Highlander Std Book"';
		var maxWidth = 500;
		var lineHeight = 36;
		var x = centerX;
		var y = 1010;
		var text = questData.description;
		wrapText(context, text, x, y, maxWidth, lineHeight);

		return convertCanvasToImage(canvas);
	};


	// Generate upgrade - Converts image to canvas; returns new canvas element
	var generateUpgrade = function generateUpgrade(blankCard, upgradeData) {
		var canvas = document.createElement("canvas");
		canvas.width = blankCard.width;
		canvas.height = blankCard.height;
		canvas.id = "upgrade";
		var centerX = canvas.width / 2;
		var context = canvas.getContext("2d");
		var yOffset = 0;

		// background
		context.drawImage(blankCard, 0, 0);

		// upgrade
		if (document.getElementById('upgrade-drop').childNodes.length && document.getElementById('upgrade-drop').firstChild.tagName === 'IMG') {
			var upgradeImage = new Image();
			upgradeImage.src = document.getElementById("upgrade-drop").firstChild.src;
			var upgradeW = 300;
			var upgradeH = 300;
			var resizedImage = scaleImageToFit(upgradeImage.width, upgradeImage.height, upgradeW, upgradeH);
			var upgradeX = ((upgradeW - resizedImage[0]) / 2) + 70;
			var upgradeY = ((upgradeH - resizedImage[1]) / 2) + 130;
			context.drawImage(upgradeImage, 0, 0, upgradeImage.width, upgradeImage.height, upgradeX, upgradeY, resizedImage[0], resizedImage[1]);
		}
		

		var nameColor = '#a72a0c';
		switch (upgradeData.type) {
			case "Melee":
				nameColor = '#B83D2B';
				break;
			case "Ranged":
				nameColor = '#B83D2B';
				break;
			case "Boost":
				nameColor = '#32531E';
				break;
			case "Permanent":
				nameColor = '#171345';
				break;
		}

		if (upgradeData.subname !== '') {
			yOffset = -10;
		}

		// name
		context.font = 'small-caps 32pt "Highlander Std Bold"';
		context.textAlign = 'center';
		context.fillStyle = nameColor;
		context.strokeStyle = 'white';
		context.lineWidth = 3;
		//context.strokeText(upgradeData.name, centerX, 70 + yOffset);
		context.fillText(upgradeData.name, centerX, 70 + yOffset);

		if (upgradeData.subname !== '') {
			context.font = 'italic small-caps 24pt "Highlander Std Book"';
			context.textAlign = 'center';
			context.fillStyle = nameColor;
			context.strokeStyle = 'white';
			context.lineWidth = 3;
			//context.strokeText(upgradeData.name, centerX, 100);
			context.fillText(upgradeData.subname, centerX, 100);
		}

		// cost
		context.shadowColor = "black";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 7;
		context.lineWidth = 4;
		context.font = '40pt "Highlander Std Bold"';
		context.fillStyle = '#346391';
		context.strokeStyle = 'white';
		context.shadowColor = "rgba( 0, 0, 0, 1 )";
		context.strokeText(upgradeData.cost, 105, 155);
		context.shadowColor = "rgba( 0, 0, 0, 0 )";
		context.fillText(upgradeData.cost, 105, 155);

		if (upgradeData.type === 'Melee' || upgradeData.type === 'Ranged') {
			context = numberText(context, upgradeData.attack, '#B83D2B', 335, 470); // attack
		}
		yOffset = 0;
		if (upgradeData.type === 'Boost') {
			yOffset = 36;
		}

		// ability
		context.font = 'small-caps 24pt "Highlander Std Bold"';
		context.textAlign = 'left';
		context.fillStyle = darkText;
		context.strokeStyle = 'white';
		context.lineWidth = 1;
		context.fillText(upgradeData.category, 75, 478 + yOffset);

		// description
		if (upgradeData.type === 'Boost' || upgradeData.type === 'Permanent') {
			context.fillStyle = 'white';
		} else {
			context.lineWidth = 3;
			context.fillStyle = darkText;
		}
		context.textAlign = 'center';
		context.font = '20pt "Highlander Std Book"';
		var maxWidth = 360;
		var lineHeight = 32;
		var x = centerX;
		var y = 532 + yOffset;
		var text = upgradeData.description;
		wrapText(context, text, x, y, maxWidth, lineHeight);

		return convertCanvasToImage(canvas);
	};

	var convertCanvasToImage = function convertCanvasToImage(canvas) {
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		return image;
	}

	// ----- UI UTILS -----
	var activePanel = function activePanel(panelName) {
		$('#main-selection li').removeClass('active').find("a[data-panel='" + panelName + "']").parent().addClass('active');
		$('.generator-panel').hide();
		$('#' + panelName + '-generator').show();
	};

	$("#main-selection").on("click", "a", function(e) {
		e.preventDefault();
		activePanel($(this).data('panel'));
	});

	$("form").on("submit", function(e) {
		e.preventDefault();
		var formId = this.id;

		if (formId === 'hero-form') {
			var heroData = getHeroData();
			var newImage = generateHero(document.getElementById("placeholder-hero"), heroData);
			$('#hero-cards').append(newImage);
		} else if (formId === 'monster-form') {
			var monsterData = getMonsterData();
			var newImage = generateMonster(document.getElementById("placeholder-monster"), monsterData);
			$('#monster-cards').append(newImage);
		} else if (formId === 'quest-form') {
			var questData = getQuestData();
			var newImage = generateQuest(document.getElementById("placeholder-quest"), questData);
			$('#quest-cards').append(newImage);
		} else if (formId === 'upgrade-form') {
			var upgradeData = getUpgradeData();
			var newImage = generateUpgrade(document.getElementById("placeholder-upgrade"), upgradeData);
			$('#upgrade-cards').append(newImage);
		}

	});


	// monster model
	var getMonsterData = function getMonsterData() {
		return {
			name: $("#monster-name").val(),
			tier: $("#monster-tier").val(),
			health: $("#monster-health").val(),
			overkill: $("#monster-overkill").val(),
			defense: $("#monster-defense").val(),
			gold: $("#monster-reward").val(),
			movement: $("#monster-movement").val(),
			level: $("#monster-level").val(),
			attack: $("#monster-attack").val(),
			ability: $("#monster-skill-name").val(),
			description: $("#monster-skill-description").val(),
			attackType: $("#monster-attack-type").val()
		}
	};

	// hero model
	var getHeroData = function getHeroData() {
		return {
			name: $("#hero-name").val(),
			defense: $("#defense").val(),
			health: $("#health").val(),
			ability: $("#skill-name").val(),
			description: $("#skill-description").val()
		}
	};

	// quest model
	var getQuestData = function getQuestData() {
		return {
			name: $("#quest-name").val(),
			description: $("#quest-description").val()
		}
	};

	// upgrade model
	var getUpgradeData = function getUpgradeData() {
		return {
			name: $("#upgrade-name").val(),
			subname: $("#upgrade-subname").val(),
			cost: $("#upgrade-cost").val(),
			type: $("#upgrade-type").val(),
			level: $("#upgrade-level").val(),
			category: $("#upgrade-category").val(),
			attack: $("#upgrade-attack").val(),
			description: $("#upgrade-description").val()
		}
	};

	var pickPlaceholder = function pickPlaceholder(kind) {
		if (kind === 'monster') {
			switch ($('#monster-level').val()) {
				case "1":
					imageSrc = 'img/monster-level-1.jpg';
					break;
				case "2-3":
					imageSrc = 'img/monster-level-2-3.jpg';
					break;
				case "4-5":
					imageSrc = 'img/monster-level-4-5.jpg';
					break;
				case "6":
					imageSrc = 'img/monster-level-6.jpg';
					break;
			}
		}
		if (kind === 'upgrade') {
			switch ($('#upgrade-type').val()) {
				case "Melee":
					imageSrc = 'img/upgrade-melee.jpg';
					break;
				case "Ranged":
					imageSrc = 'img/upgrade-ranged.jpg';
					break;
				case "Boost":
					imageSrc = 'img/upgrade-boost.jpg';
					break;
				case "Permanent":
					imageSrc = 'img/upgrade-permanent.jpg';
					break;
			}
		}
		$("#placeholder-" + kind).attr("src", imageSrc);
	};

	$("#monster-attack-type,#monster-level").on("change", function() {
		pickPlaceholder('monster');
	});

	$("#upgrade-type").on("change", function() {
		pickPlaceholder('upgrade');
	});

	// Hero drag + drop
	var monsterDrop = document.getElementById("monster-drop");
	monsterDrop.addEventListener("dragover", function (evt) {
		evt.preventDefault();
	}, false);
	monsterDrop.addEventListener("drop", function (evt) {
		var files = evt.dataTransfer.files;
		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				var reader = new FileReader();
				// Note: addEventListener doesn't work in Google Chrome for this event
				reader.onload = function (evt) {
					var dropImage = new Image();
					dropImage.src = evt.target.result;
					while (monsterDrop.firstChild) {
					    monsterDrop.removeChild(monsterDrop.firstChild);
					}
					monsterDrop.appendChild(dropImage);
					//img.src = evt.target.result;
					//console.log(evt.target.result);
				};
				reader.readAsDataURL(file);
			}
		}
		evt.preventDefault();
	}, false);

	// Monster drag + drop
	var heroDrop = document.getElementById("hero-drop");
	heroDrop.addEventListener("dragover", function (evt) {
		evt.preventDefault();
	}, false);
	heroDrop.addEventListener("drop", function (evt) {
		var files = evt.dataTransfer.files;
		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				var reader = new FileReader();
				// Note: addEventListener doesn't work in Google Chrome for this event
				reader.onload = function (evt) {
					var dropImage = new Image();
					dropImage.src = evt.target.result;
					while (heroDrop.firstChild) {
					    heroDrop.removeChild(heroDrop.firstChild);
					}
					heroDrop.appendChild(dropImage);
					//img.src = evt.target.result;
					//console.log(evt.target.result);
				};
				reader.readAsDataURL(file);
			}
		}
		evt.preventDefault();
	}, false);

	// Quest drag + drop
	var questDrop = document.getElementById("quest-drop");
	questDrop.addEventListener("dragover", function (evt) {
		evt.preventDefault();
	}, false);
	questDrop.addEventListener("drop", function (evt) {
		var files = evt.dataTransfer.files;
		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				var reader = new FileReader();
				// Note: addEventListener doesn't work in Google Chrome for this event
				reader.onload = function (evt) {
					var dropImage = new Image();
					dropImage.src = evt.target.result;
					while (questDrop.firstChild) {
					    questDrop.removeChild(questDrop.firstChild);
					}
					questDrop.appendChild(dropImage);
					//img.src = evt.target.result;
					//console.log(evt.target.result);
				};
				reader.readAsDataURL(file);
			}
		}
		evt.preventDefault();
	}, false);

	// Upgrade drag + drop
	var upgradeDrop = document.getElementById("upgrade-drop");
	upgradeDrop.addEventListener("dragover", function (evt) {
		evt.preventDefault();
	}, false);
	upgradeDrop.addEventListener("drop", function (evt) {
		var files = evt.dataTransfer.files;
		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				var reader = new FileReader();
				// Note: addEventListener doesn't work in Google Chrome for this event
				reader.onload = function (evt) {
					var dropImage = new Image();
					dropImage.src = evt.target.result;
					while (upgradeDrop.firstChild) {
					    upgradeDrop.removeChild(upgradeDrop.firstChild);
					}
					upgradeDrop.appendChild(dropImage);
					//img.src = evt.target.result;
					//console.log(evt.target.result);
				};
				reader.readAsDataURL(file);
			}
		}
		evt.preventDefault();
	}, false);



	activePanel('hero');
	pickPlaceholder('monster');
	pickPlaceholder('upgrade');

});