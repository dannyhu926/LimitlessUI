<!-- Load Bootstrap -->
<script src="../../../../global_assets/js/main/bootstrap.bundle.min.js"></script>
<!-- Load plugin -->
<script src="../../../../global_assets/js/plugins/notifications/bootbox.min.js"></script>
bootbox.confirm({ 
    size: 'small',
    message: "Your message here…", 
    callback: function(result){ /* your callback code */ }
});

bootbox.alert({ 
    size: 'small',
    message: "Your message here…", 
    callback: function(){ /* your callback code */ }
});

bootbox.prompt({ 
    size: 'small',
    message: "Your message here…", 
    callback: function(result){ /* your callback code */ }
})


bootbox.alert({
   message: "重设高度",
   callback: function() {
	   $('.bootbox').find('.modal-dialog').css('max-height', '400px').css('overflow-y', 'auto');
   }
});
   