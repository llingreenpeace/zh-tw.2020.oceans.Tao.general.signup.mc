import './main.scss'

const {$, history, AOS} = window

$(document).ready(function () {
	// show the petition succ info
	if (window.location.pathname.indexOf('/petition/2') >= 0 && $(window).width() <= 800) {
		// This prevents the page from scrolling down to where it was previously.
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}

		let enc = document.querySelector(".en__component")
		let top = enc.getBoundingClientRect().top+window.pageYOffset
		window.scrollTo(0, top);
	}
});

var input = $('.typing__input').val();
var counter = 0;
var freq = 100;
var timer = null;

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
AOS.init({
	easing: 'ease-out-back',
	duration: 1000,
});

$(document).ready(function() {

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

	//for EN
	$('.en__field--text').each(function() {
		var input = $(this).find('input');
		var label = $(this).find('label');
		var div = $(this).find('.en__field__element');

		var labelText = label.text();
		label.hide();

		if (labelText === '電郵地址' || labelText === '電子郵件') {
			input.attr('placeholder', '電子郵件');
			input.attr('id', 'email');
			input.clone().attr('type', 'email').insertAfter(input).prev().remove();
		} else if (labelText == '中文姓名') {
			input.attr('placeholder', '中文姓名');
			input.attr('id', 'full_name');
			if (input_hide) { div.hide(); }
		} else if (['姓氏', '名字'].indexOf(labelText) > -1) {
			input.attr('placeholder', labelText);
			// input.attr('id', 'full_name');
			if (input_hide) { div.hide(); }
		} else if (labelText == '聯絡電話') {
			input.attr('placeholder', '聯絡電話');
			input.attr('id', 'phone_number');
			input.clone().attr('type', 'tel').insertAfter(input).prev().remove();
			if (input_hide) { div.hide(); }
		}
	});

	$('.en__field--select').find('label').hide();
	if (input_hide) { $('.en__field--select').find('div').hide(); }
	// $('.en__field__input--select').append($('<option>', {
	// 	value: '',
	// 	text: '出生年份'
	// }));
	for (var i = new Date().getFullYear(); i > 1900; i--) {
		$('.en__field__input--select').append($('<option>', {
			value: '01/01/' + i.toString(),
			text: i
		}));
	}

	$('.en__field--email-ok-taiwan').find('label').first().hide();
	$('.en__field--email-ok-taiwan').insertAfter($('.en__submit'));
	if (input_hide) { $('.en__field--email-ok-taiwan').hide(); }
	$('.en__component--contactblock').insertBefore($('#email'));
	$('.en__field__label--item').html($('.en__field__label--item').text().replace('隱私保護政策', '<a href="http://www.greenpeace.org/taiwan/aboutus/privacy/">隱私保護政策</a>'));

	$('#email').focus(function() {
		$('.en__field__element, .en__field--checkbox').slideDown(400);
	});

	$('.en__submit').click(function() {
		$('.en__field__element, .en__field--checkbox').slideDown(400);
	});

	$('.cta__btn').click(function() {
		$('.en__field__element, .en__field--checkbox').slideDown(400);
		$('html, body').animate({ scrollTop: $('#email').offset().top }, 'slow');
		$('#email').focus();
	});
});

// swap images
$(() => {
	setInterval(() => {
		$(".before-after img").toggleClass("active");
	}, 1000)
})