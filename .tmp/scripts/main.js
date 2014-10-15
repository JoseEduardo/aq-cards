(function() {
  $(function() {
    var convertCanvasToImage, convertImageToCanvas, getHeroData, getMonsterData, heroData, initializeForm, scaleImageToFit, wrapText;
    $.urlParam = function(name) {
      var results;
      results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results === null) {
        return null;
      } else {
        return decodeURIComponent(results[1]) || 0;
      }
    };
    initializeForm = function() {
      return $("#hero-name").val($.urlParam('hero-name'));
    };
    $("#hero-image").val($.urlParam('hero-image'));
    $("#defense").val($.urlParam('defense'));
    $("#health").val($.urlParam('health'));
    $("#skill-name").val($.urlParam('skill-name'));
    $("#skill-description").val($.urlParam('skill-description'));
    initializeForm();
    getMonsterData = function() {
      return {
        name: $("#monster-name").val(),
        tier: $("#monster-tier").val(),
        picture: $("#monster-image").val(),
        health: $("#monster-health").val(),
        overkill: $("#monster-overkill").val(),
        defense: $("#monster-defense").val(),
        gold: $("#monster-reward").val(),
        movement: $("#monster-movement").val(),
        attack: $("#monster-attack").val(),
        ability: $("#monster-skill-name").val(),
        description: $("#monster-skill-description").val(),
        attackType: $("#monster-attack-type").val()
      };
    };
    getHeroData = function() {
      return {
        name: $("#hero-name").val(),
        character: $("#hero-image").val(),
        defense: $("#defense").val(),
        health: $("#health").val(),
        ability: $("#skill-name").val(),
        description: $("#skill-description").val()
      };
    };
    heroData = getHeroData();
    $("#hero-form").submit(function(e) {
      e.preventDefault();
      heroData = getHeroData();
      $("#hero").replaceWith('<img id="hero-card" src="images/hero-large.jpg" alt="hero card" class="offscreen" />');
      $("#hero-src").replaceWith('<img src="' + heroData.character + '" id="hero-src" class="offscreen" />');
      return $("#hero-src").load(function() {
        var newCanvas;
        newCanvas = convertImageToCanvas(document.getElementById("hero-card"), document.getElementById("hero-src"), heroData);
        return $("#hero-card").replaceWith(newCanvas);
      });
    });
    wrapText = function(context, text, x, y, maxWidth, lineHeight) {
      var line, metrics, n, testLine, testWidth, words, _i, _ref;
      words = text.split(' ');
      line = '';
      for (n = _i = 0, _ref = words.length; _i < _ref; n = _i += 1) {
        testLine = line + words[n] + ' ';
        metrics = context.measureText(testLine);
        testWidth = metrics.width;
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
    scaleImageToFit = function(imgWidth, imgHeight, maxWidth, maxHeight) {
      var ratio;
      if (imgWidth > imgHeight) {
        ratio = maxWidth / imgWidth;
      } else {
        ratio = maxHeight / imgHeight;
      }
      return [imgWidth * ratio, imgHeight * ratio];
    };
    convertImageToCanvas = function(image, heroImage, heroData) {
      var canvas, context, heroH, heroW, heroX, heroY, lineHeight, maxWidth, nameX, resizedImage, text, x, y;
      canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.id = "hero";
      nameX = canvas.width / 2;
      context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      heroW = 500;
      heroH = 500;
      resizedImage = scaleImageToFit(heroImage.width, heroImage.height, heroW, heroH);
      heroX = ((heroW - resizedImage[0]) / 2) + 490;
      heroY = ((heroH - resizedImage[1]) / 2) + 160;
      context.drawImage(heroImage, 0, 0, heroImage.width, heroImage.height, heroX, heroY, resizedImage[0], resizedImage[1]);
      context.font = 'bolder 56pt "kingthings_petrockregular"';
      context.textAlign = 'center';
      context.fillStyle = '#a72a0c';
      context.strokeStyle = 'white';
      context.lineWidth = 3;
      context.strokeText(heroData.name, nameX, 88);
      context.fillText(heroData.name, nameX, 88);
      context.shadowColor = "black";
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 7;
      context.lineWidth = 6;
      context.font = '60pt "Arial Black"';
      context.fillStyle = '#d75e00';
      context.strokeStyle = 'white';
      context.shadowColor = "rgba( 0, 0, 0, 1 )";
      context.strokeText(heroData.defense, 180, 254);
      context.shadowColor = "rgba( 0, 0, 0, 0 )";
      context.fillText(heroData.defense, 180, 254);
      context.shadowColor = "black";
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 7;
      context.font = '60pt "Arial Black"';
      context.fillStyle = '#3c315f';
      context.strokeStyle = 'white';
      context.shadowColor = "rgba( 0, 0, 0, 1 )";
      context.strokeText(heroData.health, 370, 254);
      context.shadowColor = "rgba( 0, 0, 0, 0 )";
      context.fillText(heroData.health, 370, 254);
      context.font = 'bold 20pt "Trebuchet MS"';
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.strokeStyle = 'white';
      context.lineWidth = 1;
      context.fillText(heroData.ability.toUpperCase(), 290, 322);
      context.fillStyle = 'white';
      context.font = '22pt "Trebuchet MS"';
      maxWidth = 300;
      lineHeight = 36;
      x = 298;
      y = 386;
      text = heroData.description;
      wrapText(context, text, x, y, maxWidth, lineHeight);
      return canvas;
    };
    convertCanvasToImage = function(canvas) {
      var image;
      image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    };
    return $(window).bind("load", function() {
      var newCanvas;
      newCanvas = convertImageToCanvas(document.getElementById("hero-card"), document.getElementById("hero-src"), heroData);
      return $("#hero-card").replaceWith(newCanvas);
    });
  });

}).call(this);
