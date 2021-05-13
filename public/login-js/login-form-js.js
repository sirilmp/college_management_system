(function($) {


    var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});

    $('#date-picker').datePicker();
    
    document.getElementById('date-picker').value="dd/mm/yyyy";

    $('#year-picker').yearPicker();

    // $( "#DoB" ).datepicker({
    //     dateFormat: "mm - dd - yy",
    //     showOn: "both",
    //     buttonText : '<i class="zmdi zmdi-calendar-alt"></i>',
    // });

    // $('.add-info-link ').on('click', function() {
    //     $('.add_info').toggle( "slow" );
    // });

    // $('#country').parent().append('<ul class="list-item" id="newcountry" name="country"></ul>');
    // $('#country option').each(function(){
    //     $('#newcountry').append('<li value="' + $(this).val() + '">'+$(this).text()+'</li>');
    // });
    // $('#country').remove();
    // $('#newcountry').attr('id', 'country');
    // $('#country li').first().addClass('init');
    // $("#country").on("click", ".init", function() {
    //     $(this).closest("#country").children('li:not(.init)').toggle();
    // });

    $('#department').parent().append('<ul class="list-item" id="newdepartment" name="department"></ul>');
    $('#department option').each(function(){
        $('#newdepartment').append('<li class="list" value="' + $(this).val() + '">'+$(this).text()+'</li>');
    });
    $('#department').remove();
    $('#newdepartment').attr('id', 'department');
    $('#department li').first().addClass('init');
    $("#department").on("click", ".init", function() {
        $(this).closest("#department").children('li:not(.init)').toggle();
    });

    // var allOptions = $("#country").children('li:not(.init)');
    // $("#country").on("click", "li:not(.init)", function() {
    //     allOptions.removeClass('selected');
    //     $(this).addClass('selected');
    //     $("#country").children('.init').html($(this).html());
    //     allOptions.toggle('slow');
    // });

    var FoodOptions = $("#department").children('li:not(.init)');
    $("#department").on("click", "li:not(.init)", function() {
        FoodOptions.removeClass('selected');
        $(this).addClass('selected');
        $("#department").children('.init').html($(this).html());
        FoodOptions.toggle('slow');
    });

    $('#create-accounts').validate({
        rules : {
            Name : {
                required: true,
            }
        },
        onfocusout: function(element) {
            $(element).valid();
        },
    });

    jQuery.extend(jQuery.validator.messages, {
        required: "",
        remote: "",
        email: "",
        url: "",
        date: "",
        dateISO: "",
        number: "",
        digits: "",
        creditcard: "",
        equalTo: ""
    });


})(jQuery);