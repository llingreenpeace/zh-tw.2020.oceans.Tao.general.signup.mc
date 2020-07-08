import './main.scss'
import {
	fetchFormInputs,
	getPostURL,
	getNumSignupsAndTarget,
	showFullPageLoading,
	hideFullPageLoading,
	sendPetitionTracking } from './jquery.mc.form-helper.js'

const {$, history, AOS} = window

var input = $('.typing__input').val();
var counter = 0;
var freq = 100;
var timer = null;

// display the typing effect
var typing = () => {
	let current_input = input.substr(0, counter);
	let last = current_input.substr(current_input.length - 1);
	if (last == '，' || last == '？' || last == '。') {
		freq = 500;
	} else
		freq = 100;
	$('.typing__output').html(current_input);
	counter++;
	if (counter === input.length + 1) {
		clearInterval(timer);
	} else {
		timer = setTimeout(typing, freq);
	}
}

$(document).ready(function() {
	AOS.init({
		easing: 'ease-out-back',
		duration: 1000,
	});

	$('.typing__output').html('');

	var input_hide = false;
	if (document.body.clientWidth > 800) {
		$('#fullpage').fullpage({
			verticalCentered: false,
			scrollBar: true,
			navigation: false,
			afterRender: function() {},
		});
		input_hide = true;

		if (document.location.href.indexOf('petition/1') != -1)
			timer = setTimeout(typing, freq);
		else {
			$('.typing__output').html(input);
		}
	} else {
		$('.typing__output').html(input);
	}

	$(".floating-signup-div").click(function() {
		$('html, body').animate({ scrollTop: $(".main-form-container").offset().top }, 'slow');
		$('#email').focus();
	});

	$(".downward-div").click(function() {
		$.fn.fullpage.moveSectionDown();
	});
});

// swap images to make it looks an animation
$(() => {
	setInterval(() => {
		$(".before-after img").toggleClass("active");
	}, 1000)
})


// handle form inilialize
$(() => {
	// Generate the year selections
	let nowYear = new Date().getFullYear()
	for (var i = nowYear; i > nowYear-100; i--) {
		$('.en__field__input--select').append($('<option>', {
			value: i.toString()+"-01-01",
			text: i
		}));
	}

	// expand the hidden fields while focus to email inputs
	$('#email').focus(function() {
		$('.slide-down-panel').slideDown(400);
	});

	$('.en__submit').click(function() {
		$('.slide-down-panel').slideDown(400);
	});

	$('.cta__btn').click(function() {
		$('.slide-down-panel').slideDown(400);
		$('html, body').animate({ scrollTop: $('#email').offset().top }, 'slow');
		$('#email').focus();
	});

	// initialize the validations


	$("form.en__component").validate({
		errorPlacement: function(error, element) {
			console.log(error)
			// element.parents("div.form-field:first").after( error );
			element.after( error );
		},
		submitHandler: function(form) {
			showFullPageLoading()

			try {
				let defaults = fetchFormInputs("#mc-form")
				let userInputs = fetchFormInputs(form)
				let postData = Object.assign(defaults, userInputs)

				// post-process values
				if (postData.MobilePhone) {
					postData.MobilePhone = postData.MobilePhone.replace(/^0{1}/, '')
				}

				fetch(getPostURL(), {
					method: 'POST',
					body: Object.keys(postData).reduce((formData, k) => {
						formData.append(k, postData[k]);
						return formData;
					}, new FormData())
				})
				.then(response => response.json())
				.then(response => {
					console.log('response', response)

					hideFullPageLoading()
					changeToPage(2)

					if (response.Supporter) { // ok, go to next page
						sendPetitionTracking("2020-ocean_sanctuaries_tao")
					}
				})
				.catch(error => {
					hideFullPageLoading()	// something wrong
					alert(error)
					console.error(error)
				})

			} catch (e) {
				console.error(e)
			}

			return false
		},
		invalidHandler: function(event, validator) {
			// 'this' refers to the form
			var errors = validator.numberOfInvalids();
			if (errors) {
				// console.log(errors)
				var message = errors===1
					? 'You missed 1 field. It has been highlighted'
					: 'You missed ' + errors + ' fields. They have been highlighted';
				$("div.error").show();
			} else {
				$("div.error").hide();
			}
		}
	});

})

// activate the share block
$(() => {
	var el = document.querySelector(".en-share-block"),
		url = el.getAttribute("data-url"),
		text = el.getAttribute("data-text")

	if ( !url) {
		console.log("Cannot find the url. Exit share_block")
	}

	var mainButton = el.querySelector(".main-share-button")
	var shareUrls = {}
	shareUrls.fb = "https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url)+"&t="+encodeURIComponent(text)
	shareUrls.line = "https://line.naver.jp/R/msg/text/?"
		+ encodeURIComponent(text) + "%0D%0A"
		+ encodeURIComponent(url)

	if (navigator.share) {
		function handleClickMainShare(e) {
			navigator.share({
			  text: text,
			  url: url
			})
		}

		mainButton.addEventListener('click', handleClickMainShare);
		mainButton.addEventListener('touchstart', handleClickMainShare);
	} else {
		mainButton.href = shareUrls.fb
	}

	// setup urls for buttons
	for (var name in shareUrls) {
		var theBtn = el.querySelector("."+name)
		if (theBtn) {
			theBtn.href = shareUrls[name]
		}
	}

})

// animate the progress bar
$(() => {
	let {numSignupTarget, numSignup} = getNumSignupsAndTarget()

	$(".signup-target").text(numSignupTarget.toLocaleString())
	$(".signup-current").text(numSignup.toLocaleString())

	let animateMilliSec = 1200
	let $signupCurrEl = $(".signup-current")

  $signupCurrEl.prop('Counter',0).animate({
		Counter: numSignup
  }, {
    duration: animateMilliSec,
    easing: 'swing',
    step: function (now) {
			$signupCurrEl.text(Math.ceil(now).toLocaleString());
    }
  });

	$(".meter > span").each(function() {
		$(this)
			.data("origWidth", $(this).width())
			.width(0)
			.animate({
				width: ""+Math.ceil(numSignup/numSignupTarget*100)+"%"
			}, animateMilliSec);
	});
})

// handle page changes
const changeToPage = (pageNo) => {
	console.log('changeToPage', pageNo)
	if (pageNo===1) {
		$("#page-2").hide()
	} else if (pageNo==2) {
		$("#page-1").hide()
		$("#page-2").show()

		// scroll to the succ element
		if ($(window).width() <= 800) {
			let enc = document.querySelector("#page-2")
			let top = enc.getBoundingClientRect().top+window.pageYOffset
			window.scrollTo(0, top);
		}

		document.querySelector(".floating-signup-div").remove()

	} else {
		throw new Error("Unknow pageNo: "+pageNo)
	}
}

// init
$(() => {
	changeToPage(1)
})