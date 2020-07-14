    <!-- Search results -->
    <div class="content-group">
        <p class="text-muted text-size-small content-group"><?php echo $stepInfo['name']; ?> 共<?php echo count($list); ?>条NPC对话 <a target="_blank" href="<?php echo $this->createUrl('/gamestep/preview',['type'=>$type, 'step_id'=>$stepId]); ?>">预览对话</a></p>
        <?php if($list): ?>
        <div class="search-results-list content-group">
            <div class="panel panel-flat timeline-content">
                <div class="panel-body">
                    <ul class="media-list chat-list content-group" id="chat-list">
                        <li class="media" data-id="<?php echo $npc['id']; ?>" style="margin-right: 0%">
                            <div class="rightmenu" data-target="context-menu" id="<?php echo $npc['id']; ?>">
                                <div class="media-content" style="display: block"><?php echo $npc['content']; ?></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>

    <div class="context-menu">
        <ul class="dropdown-menu">
            <li><a href="/admin/stepNpc/top" ><i class="icon-move-up"></i>置顶</a></li>
            <li><a data-operate="ajax" href="/admin/stepNpc/copyUpateContent"><i class="icon-copy4"></i>复制并更新</a></li>
            <li><a data-operate="ajax" href="/admin/stepNpc/updateContent"><i class="icon-file-spreadsheet"></i>更新内容</a></li>
            <li><a href="/admin/stepNpc/update"><i class="icon-pencil7"></i>编辑</a></li>
            <li><a href="/admin/stepNpc/delete"><i class="icon-trash"></i>删除</a></li>
        </ul>
    </div>
</div>
<script>
    $('.rightmenu').contextmenu({
        target: '.context-menu',
        onItem: function (context, e) {
            //动态追加参数
            $(e.target).attr('href', $(e.target).context.href + "/id/" + context.context.id);

            if($(e.target).data('operate')=='ajax'){
                operate.ajaxModal($(e.target));return;
            }
            if ($(e.target).text() == '删除' && window.confirm('确认删除？')) {
                window.location.href = $(e.target).attr('href');
            }
            if ($(e.target).text() != '删除') {
                window.location.href = $(e.target).attr('href');
            }
        }
    });
</script>
