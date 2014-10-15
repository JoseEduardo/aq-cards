$( ->
	$.urlParam = (name) ->
    results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)
    if (results == null)
      return null
    else
      return decodeURIComponent(results[1]) || 0;

  initializeForm = ->
  	$("#hero-name").val($.urlParam('hero-name'))
		$("#hero-image").val($.urlParam('hero-image'))
		$("#defense").val($.urlParam('defense'))
		$("#health").val($.urlParam('health'))
		$("#skill-name").val($.urlParam('skill-name'))
		$("#skill-description").val($.urlParam('skill-description'))

	initializeForm()

	# monster model
	getMonsterData = ->
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
		}

	#hero model
	getHeroData = ->
		return {
			name: $("#hero-name").val(),
			character: $("#hero-image").val(),
			defense: $("#defense").val(),
			health: $("#health").val(),
			ability: $("#skill-name").val(),
			description: $("#skill-description").val()
		}

	heroData = getHeroData();

	# http://31.media.tumblr.com/b19f1a66b534c1a150b7046715a9227f/tumblr_mncn8goKbg1r29cuxo1_r2_400.png

	# on change
	$("#hero-form").submit (e) ->
		e.preventDefault()
		
		heroData = getHeroData()
		$("#hero").replaceWith('<img id="hero-card" src="images/hero-large.jpg" alt="hero card" class="offscreen" />')
		$("#hero-src").replaceWith('<img src="' + heroData.character + '" id="hero-src" class="offscreen" />')
		$("#hero-src").load () ->
			newCanvas = convertImageToCanvas(document.getElementById("hero-card"), document.getElementById("hero-src"), heroData)
			$("#hero-card").replaceWith(newCanvas)
		
		#console.log getHeroData()
		
	# Wrap canvas text
	wrapText = (context, text, x, y, maxWidth, lineHeight) ->
		words = text.split(' ')
		line = ''
		for n in [0...words.length] by 1
			testLine = line + words[n] + ' '
			metrics = context.measureText(testLine)
			testWidth = metrics.width
			if (testWidth > maxWidth && n > 0)
				context.fillText(line, x, y)
				line = words[n] + ' '
				y += lineHeight
			else
				line = testLine
		context.fillText(line, x, y)
		return

	# Scale image
	scaleImageToFit = (imgWidth, imgHeight, maxWidth, maxHeight) ->
		if (imgWidth > imgHeight)
			ratio = maxWidth / imgWidth
		else
			ratio = maxHeight / imgHeight
		return [imgWidth * ratio, imgHeight * ratio]

	# Converts image to canvas; returns new canvas element
	convertImageToCanvas = (image,heroImage, heroData) ->
		canvas = document.createElement("canvas")
		canvas.width = image.width
		canvas.height = image.height
		canvas.id = "hero"
		nameX = canvas.width / 2
		context = canvas.getContext("2d")
		# background
		context.drawImage(image, 0, 0)
		# hero
		heroW = 500
		heroH = 500
		resizedImage = scaleImageToFit(heroImage.width, heroImage.height, heroW, heroH)
		heroX = ((heroW - resizedImage[0]) / 2) + 490
		heroY = ((heroH - resizedImage[1]) / 2) + 160
		context.drawImage(heroImage, 0, 0, heroImage.width, heroImage.height, heroX, heroY, resizedImage[0], resizedImage[1]);
		# name
		context.font = 'bolder 56pt "kingthings_petrockregular"'
		context.textAlign = 'center'
		context.fillStyle = '#a72a0c'
		context.strokeStyle = 'white'
		context.lineWidth = 3
		context.strokeText(heroData.name, nameX, 88)
		context.fillText(heroData.name, nameX, 88)
		# defense
		context.shadowColor = "black"
		context.shadowOffsetX = 0
		context.shadowOffsetY = 0
		context.shadowBlur = 7
		context.lineWidth = 6
		#context.font = '60pt "itchighlander_lt_bookbold"'
		context.font = '60pt "Arial Black"'
		context.fillStyle = '#d75e00'
		context.strokeStyle = 'white'
		context.shadowColor = "rgba( 0, 0, 0, 1 )"
		context.strokeText(heroData.defense, 180, 254)
		context.shadowColor = "rgba( 0, 0, 0, 0 )"
		context.fillText(heroData.defense, 180, 254)
		# health
		context.shadowColor = "black"
		context.shadowOffsetX = 0
		context.shadowOffsetY = 0
		context.shadowBlur = 7
		#context.font = '60pt "itchighlander_lt_bookbold"'
		context.font = '60pt "Arial Black"'
		context.fillStyle = '#3c315f'
		context.strokeStyle = 'white'
		context.shadowColor = "rgba( 0, 0, 0, 1 )"
		context.strokeText(heroData.health, 370, 254)
		context.shadowColor = "rgba( 0, 0, 0, 0 )"
		context.fillText(heroData.health, 370, 254)
		# ability
		#context.font = '20pt "itchighlander_lt_bookbold"'
		context.font = 'bold 20pt "Trebuchet MS"'
		context.textAlign = 'center'
		context.fillStyle = 'black'
		context.strokeStyle = 'white'
		context.lineWidth = 1
		#context.strokeText(heroData.ability, 290, 322)
		context.fillText(heroData.ability.toUpperCase(), 290, 322)
		# description
		context.fillStyle = 'white'
		#context.font = '24pt "itchighlander_lt_bookregular"'
		context.font = '22pt "Trebuchet MS"'
		#context.font = '24pt "merienda_oneregular"'
		maxWidth = 300
		lineHeight = 36
		x = 298
		y = 386
		text = heroData.description
		wrapText(context, text, x, y, maxWidth, lineHeight)

		return canvas

	# Converts canvas to an image
	convertCanvasToImage = (canvas) ->
		image = new Image()
		image.src = canvas.toDataURL("image/png")
		return image

	$(window).bind("load", ->
		newCanvas = convertImageToCanvas(document.getElementById("hero-card"), document.getElementById("hero-src"), heroData)
		$("#hero-card").replaceWith(newCanvas)
	)

)



