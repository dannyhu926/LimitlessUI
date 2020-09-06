<div id="fans_list"></div>
<input type='hidden' id='mid'/>
json：{
  "items": [
    {"id": 1,"name": "Tetris","text": "s9xie/hed"},
    {"id": 2,"name": "Tetrisf","text": "s9xie/hed"}
  ]
}
<script type="text/javascript">
    $('#fans_list').select2({
        ajax: {
            url: '/admin/member/ajax_get_list',
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            data: function (term) {
                return {
                    q: term,
                };
            },
            results: function (data) {
                return {
                    results: data.items,
                };
            }
        },
        formatSelection: resultFormatSelection,  //选中后样式
    });

    function resultFormatSelection(item) {
        $("#mid").val(item.id);
        return item.text;
    }
</script>

In Version 4.0.2 slightly different Just in processResults and in result :
