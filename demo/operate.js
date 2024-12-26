var operate = function () {
    var request_handler = false;
    var request_handler_obj = [];
    return {
        init: function () {
        },

        /**   $('#baseModal').modal('hide'); 手动关闭
         * 异步请求弹出modal框,需要在该页面定义好Model
         * <div id="baseModal" class="modal fade">
         *    <div class="modal-dialog">
         *       <div class="modal-content">
         *       </div>
         *     </div>
         * </div>
         *
         */
        ajaxModal: function (obj) {
            var id = obj.data('id') ? obj.data('id') : "baseModal";
            var url = obj.data('url') ? obj.data('url') : obj.attr('href');
            if (!url) {
                operate.showMessage("参数传递有误", "#EF5350", "error");
                return false;
            }

            $('#' + id).modal({
                remote: url
            });
            //重复使用一个，在调用show方法后页面内容后重新加载
            $('#' + id).on("show.bs.modal", function () {
                $(this).find('.modal-content').empty();
            });

            $('#' + id).on("loaded.bs.modal", function () {
                app.resetModal();
            });
            //当调用 hide 实例方法时触发
            $('#' + id).on('hidden.bs.modal', function () {
                $(this).removeData("bs.modal");
            });
        },

        //删除
        deleteModal: function (obj) {
            var id = obj.data('id');
            var url = obj.data('url');
            var title = obj.data('title') ? obj.data('title') : '确认要删除此条记录吗?';
            if (!id || !url) {
                operate.showMessage("参数传递有误", "#EF5350", "error");
                return false;
            }
            swal({
                title: title,
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#FF7043",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        type: "POST",
                        cache: false,
                        dataType: 'json',
                        url: url,
                        data: {id: id},
                        success: function (result) {
                            var msg = result.status ? (result.info ? result.info : "操作成功") : (result.info ? result.info : "操作失败");
                            var status = result.status;
                            swal({
                                title: msg,
                                text: "",
                                type: status ? "success" : "error",
                                confirmButtonColor: status ? "#66BB6A" : "#EF5350",
                                timer: 3000,
                                closeOnConfirm: false,
                                closeOnCancel: false
                            }, function () {
                                if (status) {
                                    window.location.reload();
                                }
                            });
                        }
                    });
                } else {
                }
            });
        },

        ajaxSaveForm: function ($submit, $form, request_url, request_data, success_callback, failed_callback) {
            var _this = $submit;
            _this.attr('disabled', 'disabled');
            $form.block({
                message: '<i class="icon-spinner spinner"></i>',
                overlayCSS: {
                    backgroundColor: '#1B2024',
                    opacity: 0.85,
                    cursor: 'wait'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none',
                    color: '#fff'
                }
            });
            $form.find('.modal-body .alert').addClass('hide');
            //判断ajax是否执行完成
            if (request_handler === true) {
                return false;
            }
            request_handler = true;

            $.ajax({
                type: "POST",
                dataType: "json",
                url: request_url,
                data: request_data,
                success: function (result) {
                    request_handler = false;
                    $form.unblock();
                    var msg = result.status ? "操作成功" : (result.info ? result.info : "操作失败");
                    $form.find('.modal-body .alert .alert-content').text(msg);
                    if (result.status) {
                        $form.find('.modal-body .alert')
                            .removeClass('hide alert-danger')
                            .addClass('in alert-success');
                        if (typeof(success_callback) !== 'function') {
                            setTimeout(function () {
                                $('button[data-dismiss="modal"]').click();
                                window.location.reload();
                            }, 1000);
                        } else {
                            success_callback(msg);
                        }
                    } else {
                        _this.removeAttr('disabled');
                        $form.find('.modal-body .alert .alert-content').text(msg);
                        $form.find('.modal-body .alert')
                            .removeClass('hide alert-success')
                            .addClass('in alert-danger');
                        $form.find('input[name="_csrf_token"]').val(result._csrf_token);
                        if (typeof(failed_callback) == 'function') {
                            failed_callback(msg);
                        }
                    }

                },
                error: function (e) {
                    request_handler = false;
                    _this.removeAttr('disabled');
                    $form.unblock();
                    $form.find('.modal-body .alert .alert-content').text('请求异常');
                    $form.find('.modal-body .alert')
                        .removeClass('hide alert-success')
                        .addClass('in alert-danger');
                }
            })
        },

        simpleAjaxRequest: function (obj) {
            var request_type = obj.data('operate');
            var request_url = obj.data('url');
            var success_callback = obj.data('success');
            var failed_callback = obj.data('failed');
            var request_data = {};
            var prepare_function = obj.data('prepare'); //数据准备
            if (prepare_function) {
                try {
                    var fn = window[prepare_function];
                    fn();
                }
                catch (e) {
                    operate.showMessage(e.message, "#EF5350", "error");
                    return false;
                }
            }
            //获取post传递的参数
            $.each(obj[0].attributes, function (i, attr) {
                var attr_name = attr.name;
                var attr_value = attr.value;
                if (attr_name.indexOf('data-param-') != -1) {
                    attr_name = attr_name.replace(/data-param-/g, "");
                    request_data[attr_name] = attr_value;
                }
            });

            if (!request_url) {
                operate.showMessage("无效请求URL", "#EF5350", "error");
                return false;
            }

            //判断ajax是否执行完成
            if (request_handler === true) {
                return false;
            }
            request_handler = true;

            $.ajax({
                type: request_type,
                dataType: "json",
                url: request_url,
                data: request_data,
                success: function (result) {
                    request_handler = false;
                    var msg = result.status ? "操作成功" : (result.info ? result.info : "操作失败");
                    operate.showMessage(msg, result.status ? "#66BB6A" : "#FF7043", result.status ? "success" : "error");
                    if (result.status) {
                        if (success_callback) {
                            try {
                                var fn = window[success_callback];
                                fn(result.data);
                            }
                            catch (e) {
                                operate.showMessage(e.message, "#EF5350", "error");
                            }
                        }
                    } else {
                        if (failed_callback) {
                            try {
                                var fn = window[failed_callback];
                                fn(result.data);
                            }
                            catch (e) {
                                operate.showMessage(e.message, "#EF5350", "error");
                            }
                        }
                    }

                },
                error: function (e) {
                    operate.showMessage("请求异常:" + e.message, "#EF5350", "error");
                }
            })
        },

        //select下拉框联动操作
        selectLinkage: function (obj) {
            var linkage_id = obj.data('linkage_id'),
                selected_value = obj.val(),
                linkage_id_data_url = $('#' + linkage_id).data('url'),
                linkage_id_value = $('#' + linkage_id).data('value_name'),
                linkage_id_label = $('#' + linkage_id).data('label_name'),
                linkage_id_selected_value = $('#' + linkage_id).data('selected_value');

            if (linkage_id == '' || linkage_id_data_url == '') {
                operate.showMessage("联动下拉框参数有误", "#EF5350", "error");
                return false;
            }

            if (selected_value == '') {
                return false;
            }
            if (linkage_id_value == '') {
                linkage_id_value = 'id';
            }
            if (linkage_id_label == '') {
                linkage_id_label = 'name';
            }

            $('#' + linkage_id).empty();
            $('#' + linkage_id).append('<option value="">请选择</option>');

            //判断ajax是否执行完成
            if (request_handler_obj[linkage_id] === true) {
                return false;
            }
            request_handler_obj[linkage_id] = true;

            $.ajax({
                type: 'get',
                dataType: "json",
                url: linkage_id_data_url,
                data: {selected_value: selected_value},
                success: function (result) {
                    request_handler_obj[linkage_id] = false;
                    if (result.status) {
                        var selected_html = '';
                        $.each(result.data, function (k, v) {
                            if (linkage_id_selected_value && linkage_id_selected_value == v[linkage_id_value]) {
                                selected_html = 'selected';
                            } else {
                                selected_html = '';
                            }
                            var option = '<option value="' + v[linkage_id_value] + '" ' + selected_html + '>' + v[linkage_id_label] + '</option>';
                            $('#' + linkage_id).append(option);
                        });
                        if ($('#' + linkage_id).attr('multiple') == undefined) {
                            $('#' + linkage_id).select2();
                        }

                        //如果当前select有data-operate="linkage" ，且没有data-autoload=1，则触发当前对象的selectLinkage动作
                        var linkage = $('#' + linkage_id).data('operate'),
                            autoload = $('#' + linkage_id).data('autoload');
                        if (linkage == 'linkage' && autoload != 1) {
                            operate.selectLinkage($('#' + linkage_id));
                        }
                    } else {
                        operate.showMessage(result.info ? result.info : "联动菜单获取数据异常", "#EF5350", "error");
                    }

                },
                error: function (e) {
                    operate.showMessage("请求异常:" + e.message, "#EF5350", "error");
                }
            })
        },

        //选中行操作
        selectRow: function (obj) {
            if (obj.children("td:eq(0)").children(":checkbox").prop("disabled") == true) return false;
            var checked = obj.children("td:eq(0)").children(":checkbox").is(":checked");
            obj.children("td:eq(0)").children(":checkbox").prop("checked", !checked);
        },

        //checkbox选中
        checkBoxOpt: function (obj) {
            var checked = obj.is(":checked");
            obj.prop("checked", !checked);
        },

        checkBoxSetButton: function () {
            listchecked = !($("input:checked[name='" + app.config.checkbox_name + "']").length > 0);
            $("input[data-operate='batch']:submit").each(function () {
                $(this).attr('disabled', listchecked);
            });
        },

        //批量操作
        batchModel: function (obj) {
            listchecked = $("input:checked[name='" + app.config.checkbox_name + "']").length > 0;
            var title = obj.data('title') ? obj.data('title') : '您确认要批量删除吗?';
            var request_data = obj.data('attributes');
            var url = obj.data('url');
            var success_callback = obj.data('success');

            if (listchecked) {
                var data = new Array();
                $("input:checked[name='" + app.config.checkbox_name + "']").each(function () {
                    if ($(this).prop("checked") == true) {
                        if ($(this).prop("disabled") == true) return true;
                        if (request_data) {
                            var request_param = {};
                            request_data = request_data.toString().split(","); //字符分割
                            for (var i = 0; i < request_data.length; i++) {
                                if (request_data[i] == 'id') {
                                    request_param[request_data[i]] = $(this).val();
                                } else {
                                    request_param[request_data[i]] = $(this).data(request_data[i]) || '';
                                }
                            }
                        } else {
                            request_param = {"id": $(this).val()};
                        }
                        data.push(request_param);
                    }
                });
                var title = obj.data('title') ? obj.data('title') : '确认要删除此条记录吗?';
                swal({
                    title: title,
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#FF7043",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: true,
                    showLoaderOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        //判断ajax是否执行完成
                        if (request_handler === true) {
                            return false;
                        }
                        request_handler = true;

                        $.ajax({
                            type: "POST",
                            cache: false,
                            dataType: 'json',
                            url: url,
                            data: {data: data},
                            success: function (result) {
                                request_handler = false;

                                var msg = result.status ? "操作成功" : (result.info ? result.info : "操作失败");
                                var status = result.status;
                                swal({
                                    title: msg,
                                    text: "",
                                    type: status ? "success" : "error",
                                    confirmButtonColor: status ? "#66BB6A" : "#EF5350",
                                    timer: 3000,
                                    closeOnConfirm: false,
                                    closeOnCancel: false
                                }, function () {
                                    if (status) {
                                        if (success_callback) {
                                            try {
                                                var fn = window[success_callback];
                                                fn(result.data);
                                            }
                                            catch (e) {
                                                operate.showMessage(e.message, "#EF5350", "error");
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                operate.showMessage("请勾选后再操作", "#EF5350", "error");
            }
        },

        //上传文件
        uploaderFile: function (obj) {
            var dir = obj.data('dir') ? obj.data('dir') : "image";
            var fsize = obj.data('fsize') ? obj.data('fsize') : 2;
            var table = obj.data('table') ? obj.data('table') : '';
            var callback_input = obj.data('callback_inputid');
            var preview_image = obj.data('preview');
            var fileDefaultHtml = obj.data('default');
            file_option = {
                language: 'zh',
                uploadUrl: '/upload/uploadify', //上传后台操作的方法
                showPreview: false,
                showUpload: false,
                uploadExtraData: {dir: dir, size: fsize, table: table, input_name: callback_input},
                uploadAsync: true,
                maxFileCount: 1, //允许同时上传的最大文件个数
                autoReplace: true,
                browseLabel: '',
                browseClass: 'btn btn-primary btn-icon',
                browseIcon: '<i class="icon-plus22"></i> ',
                removeLabel: '',
                cancelLabel: '',
                uploadLabel: '',
                uploadClass: 'btn btn-default btn-icon',
                cancelClass: 'btn btn-danger btn-icon',
                removeClass: 'btn btn-danger btn-icon',
                fileActionSettings: {
                    showDrag: false,
                    showZoom: false
                },
                layoutTemplates: {
                    caption: '<div tabindex="-1" class="form-control file-caption {class}">\n' + '<span class="icon-file-plus kv-caption-icon" style="display: inline"></span><input style="margin:-20px 0 0 20px" class="file-caption-name"/>\n' + '</div>'
                },
                initialCaption: fileDefaultHtml
            };
            if (fileDefaultHtml) {
                file_option = $.extend(file_option, {initialPreview: [
                    "<img src='" + fileDefaultHtml + "' class='file-preview-image' alt=''>",
                ]});
            }
            obj.fileinput(file_option).on("fileclear",function (event, data, msg) { //删除
                $("#" + callback_input).val('');
                $(".fileinput-remove-button").css("display", ""); //删除按钮隐藏
                $("#" + preview_image).prop("src", location.protocol + '//' + window.location.host + '/statics/images/nopic.gif');
            }).on("filebatchselected",function (event, files) { //选择文件自动上传
//                console.log(files);
                obj.fileinput("upload");
            }).on('fileuploaded',function (event, data, previewId, index) { //成功后回调
                var form = data.form, files = data.files, extra = data.extra,
                    response = data.response, reader = data.reader;

                $(".kv-upload-progress").fadeOut(2000);
                $("#" + callback_input).val(response.initialPreviewThumbTags.url);
                $("#" + preview_image).prop("src", response.initialPreviewThumbTags.url);
            }).on('fileuploaderror',function (event, data, msg) {
                $(".kv-upload-progress").fadeOut(2000);
                $(".file-caption-name").val('');
                $(".fileinput-remove-button").css("display", ""); //删除按钮隐藏
                operate.showMessage(msg, "#EF5350", "error");
            }).on('filebatchuploaderror', function (event, data, msg) {
                $(".kv-upload-progress").fadeOut(2000);
                $(".file-caption-name").val('');
                $(".fileinput-remove-button").css("display", ""); //删除按钮隐藏
                operate.showMessage(msg, "#EF5350", "error");
            });
        },

        showMessage: function (msg, addclass, type) {
            swal({
                title: "",
                text: msg,
                type: type,
                confirmButtonColor: addclass,
                timer: 3000
            });
        }
    };

}();