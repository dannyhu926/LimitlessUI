弹窗modal翻页
<script>
    $(".pagination a").click(function () {
        var url = $(this).data('url');
        $(".modal-content").load(url);
    });
</script>

点击提交按钮后，手动关闭
$("#baseModal").modal("hide");
