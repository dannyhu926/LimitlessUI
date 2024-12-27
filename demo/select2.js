Select2 内置了对 AJAX 的支持，使用 jQuery 的 AJAX 方法。通过查询关键字获取数据，适用于大数据 In Version 4.0.2 slightly different Just in processResults and in result :
json：{
  "items": [
    {"id": 1,"name": "Tetris","text": "s9xie/hed"},
    {"id": 2,"name": "Tetrisf","text": "s9xie/hed"}
  ]
}
<select id="mySelect2" style="width: 100%;"></select>

<script>
$(document).ready(function() {
    $('#mySelect2').select2({
        ajax: {
            url: '/api/search', // 替换为你的数据请求 URL
            dataType: 'json',
            delay: 250,  // 延迟时间，用于防抖动
            data: function (params) {
                return {
                    q: params.term, // 搜索关键词
                    page: params.page || 1 // 当前页码
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;

                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        placeholder: '搜索仓库',
        escapeMarkup: function (markup) { return markup; }, // 避免转义 HTML
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection
    });

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
            "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

        if (repo.description) {
            markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
        }

        markup += "<div class='select2-result-repository__statistics'>" +
            "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
            "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
            "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
        "</div>" +
        "</div></div>";

        return markup;
    }

    function formatRepoSelection(repo) {
        return repo.full_name || repo.text;
    }
});


    // Set/get value	
	$('.access-get').on('click', function () { alert('Selected value is: '+$('.select-access-value').val()); });
	$('.access-set').on('click', function () { $('.select-access-value').val('CA').trigger('change'); });
	
	// Enable/disable menu	
	$('.access-disable').on('click', function () { $('.select-access-enable').prop('disabled', true); });
	$('.access-enable').on('click', function () { $('.select-access-enable').prop('disabled', false); });
</script>



