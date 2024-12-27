`select2` 是一个用于增强 HTML 选择框功能的 jQuery 插件，支持搜索、远程数据加载等功能。要在 `select2` 中实现 AJAX 下拉自动分页，你需要配置 `select2` 的 AJAX 选项，并处理服务器端的分页逻辑。
以下是一个基本的实现步骤：
1. **配置 Select2 的 AJAX 选项**：
   - 设置 `ajax` 选项，包括 `url`、`dataType`、`delay`、`data` 和 `processResults`。
   - 使用 `data` 函数来构建请求参数，包括分页参数（如 `page`）。
   - 使用 `processResults` 函数来处理服务器返回的数据，并设置分页信息processResults 函数中的 pagination.more 是一个布尔值，表示是否还有更多数据。（4.0.2版本以下是result）

2. **服务器端处理分页**：
   - 根据请求中的分页参数（如 `page` 和 `pageSize`）来查询数据库。
   - 返回的数据应包含当前页的数据列表和总记录数，以便 `select2` 知道何时停止加载更多数据。
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



