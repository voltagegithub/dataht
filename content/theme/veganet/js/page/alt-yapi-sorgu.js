	$('.selectiki').select2({
		language: 'tr'
	});
	
	$(document).on('select2:open', () => {
		document.querySelector('.select2-search__field').focus();
	});
	
	loading(false)
	$('#koyDiv').hide()
	$('#ilceDiv').hide()
	$('#mahalleDiv').hide()
	$('#sokakDiv').hide()
	$('#binaDiv').hide()
	$('#daireDiv').hide()
	
	async function request( name, value ){
		loading(true)
		await $.getJSON("/altyapisor.php?"+name+"=" +value, function(result){
			$("#" + name).html('');
			$.each(result, function(i,row){
				var option = new Option(row.name, row.id, true, true);
				$("#" + name).append(option);
				$("#" + name).val(null).trigger('change');
				
				if((name == 'bucak' || name == 'koy'))
				{
					if(name == 'bucak'){
						if(result.length == 1){
							// bucak bir tane ise köy seç
							request('koy',row.id).then(()=>{
								loading()
							})
				
						}else{
							// bucak birden fazla ise 
						}
					} 
					if(name == 'koy'){
						if(result.length == 1){
							request('mahalle',row.id)
							.then(()=>{
								$('#mahalleDiv').show()	
								$("#mahalle").select2('open')
								loading()
							})
						}else{
							$('#koyDiv').show()
						}
					}	
					
					$("#" + name).val(row.id).trigger('change');	
					$("#" + name).select2("close")
					
				}
			});
			
		
			
			if(result.length>1){
				//$("#" + name).select2('open')
			}
		
		});
	}
	$('#il').select2('open').on('select2:select', async function(e){
		await request('ilce', e.target.value).then(()=>{
			$('#ilceDiv').show()	
			$("#ilce").select2('open')
			loading()
		})
	}).trigger('change');
	
	$('#ilce').on('select2:select', async function(e){
		await request('bucak',e.target.value).then(()=>{})
	});
	
	$('#bucak').on('select2:select',function(e){
		request('koy',e.target.value)
	});
	
	$('#koy').on('select2:select', async function(e){
		await request('mahalle',e.target.value).then(()=>{
			$('#mahalleDiv').show()	
			$("#mahalle").select2('open')
			loading()
		})
	});
	
	$('#mahalle').on('select2:select', async function(e){
		await request('sokak',e.target.value).then(()=>{
			$('#sokakDiv').show()	
			$("#sokak").select2('open')
			loading()
		})
	})
	
	$('#sokak').on('select2:select', async function(e){
		await request('bina',e.target.value).then(()=>{
			$('#binaDiv').show()	
			$("#bina").select2('open')
			loading()
		})
	})
	
	$('#bina').on('select2:select', async function(e){
		await request('daire',e.target.value).then(()=>{
			$('#daireDiv').show()	
			$("#daire").select2('open')
			loading()
		})
		
	})
	
	$('#daire').on('select2:select', async function(e){
		adresSorgu(e.target.value)
	})


function loading(visible = false){
	if(visible == true){
		$(".loader").css("display", "inline-block");
		return 
	}
	$(".loader").css("display", "none");
}
	
function tekrarSorgula(){
	$('#ilce').html('')
	$('#bucak').html('')
	$('#koy').html('')
	$('#mahalle').html('')
	$('#sokak').html('')
	$('#bina').html('')

	$('#ilceDiv').hide()	
	$('#koyDiv').hide()	
	$('#mahalleDiv').hide()	
	$('#sokakDiv').hide()	
	$('#binaDiv').hide()	
	$('#daireDiv').hide()	

	document.getElementById("SonucDiv").style.display = "none";
	document.getElementById("Adres").style.display = "block";
	
}
	
function adresSorgu(kapino, sorgu = 'adres') {
	$.ajax	({	
			type: "POST",
			url	:'altyapisor.php',
			data: { kapino , sorgu },
			beforeSend: function() {
				loading(true)
			},
			success	: function(gelenveri){ 
				loading()
				var veri = "";
				veri = JSON.parse(gelenveri);
				const { serviceAbility } = veri;
				
				var portvaryok  = serviceAbility.port;
				var mesafe      = serviceAbility.santralmesafe + 'Metre'
				var hiz         = serviceAbility.hiz
				var hizmetturu  = serviceAbility.hizmetturu
				
			
				if(serviceAbility.extra.FIBERX > 0 ){
					mesafe = "Fiber";
					hiz = "100";
				}	
				
				document.getElementById("SonucDiv").style.display = "block";
				document.getElementById("Adres").style.display = "none";
				$('#_hiz').text(hiz);
				$('#_adress').text(veri.acikadres + '(' + veri.bbk + ')' );
				$('#_tur').text(hizmetturu);
				
				$('#adres').val(veri.acikadres);
				$('#bbkkodu').val(veri.bbk);
				$('#sorgusonuc').val(hiz);
				$('#hizmetturu').val(hizmetturu);
					
			},
			complete: function() { loading() },
		});
	}   
	
function aboneOl(){
	$('#sizi-arayalim').modal('show');
	
}
