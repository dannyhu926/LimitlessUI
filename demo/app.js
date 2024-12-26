/* ------------------------------------------------------------------------------
 *
 *  # Template JS core
 *
 *  Core JS file with default functionality configuration
 *
 *  Version: 1.0
 *  Latest update: 2016/12/20
 *
 * ---------------------------------------------------------------------------- */
var app = function () {
    var $this;
    var defaults = {
        checkbox_name: "ids[]",             //checkbox name
        checkbox_checkall_name: "checkall", //全选input name
        toggle_bgcolor: "#EEEEEE",          //隔行变色 色值
        highnight_bgcolor: "#B2E0FF"        //鼠标高亮 色值
    };
    return {
        init: function (option) {
            $this = this;
            $this.config = $.extend(defaults, option);
            $this.initLayout();
            $this.initDom();
            $this.initPlugins();
            $this.initOperate();
        },

        initDom: function () {
            //隔行变色
            $("tr:gt(0):even").css("background-color", $this.config.toggle_bgcolor);
            //鼠标经过变色
            $("table tbody tr:gt(0)").each(function () {
                var default_bgcolor = $(this).css("background-color");
                $(this).on('mouseover', function () {
                    $(this).css("background-color", $this.config.highnight_bgcolor);
                });
                $(this).on('mouseout', function () {
                    $(this).css("background-color", default_bgcolor);
                });
            });
            // Form
            $("form").each(function () {
                if (!$(this).find('input[name="_csrf_token"]').length) {
                    $(this).append('<input type="hidden" name="_csrf_token" value="' + app.config._csrf_token + '">');
                }
            });

            $('form a.btn-success').click(function (e) {
                if ($(this).text() == '重置条件') {
                    e.preventDefault();
                    location.reload();
                }
            });

            //处理表格中有下拉菜单导致出现纵向下拉框的情况,采取超过一半以上的行向上弹出
            $('.table-responsive table').each(function () {
                var n = parseInt($(this).find('tr').length / 2);

                $(this).find('tr:gt(' + n + ') .icons-list .dropdown').addClass('dropup');
            });

            //select下拉框联动操作
            $('select[data-operate="linkage"]').each(function () {
                if ($(this).data('autoload') == 1) {
                    operate.selectLinkage($(this));
                }
            });
        },

        initPlugins: function () {
            // Styled checkboxes and radios
            $(".styled, .multiselect-container input").uniform({
                radioClass: 'choice'
            });

            // 文件上传控件  data-show-caption="false"覆盖下面设置
            if ($this.isInclude('fileinput.min.js')) {
                $(".file-input").each(function () {
                    var obj = $(this);
                    operate.uploaderFile(obj);
                });
            }

            // Popover
            $('[data-popup="popover"]').popover();

            // data-html="true" 支持html标签 <br/>
            $('[data-popup="tooltip"]').tooltip();

            // Switch
            if ($this.isInclude('switch.min.js')) {
                $(".switch").bootstrapSwitch();
            }
            //字数统计
            if ($this.isInclude('maxlength.min.js')) {
                $('.maxlength').maxlength({
                    alwaysShow: true
                });
            }
            //标签
            if ($this.isInclude('tagsinput.min.js')) {
                $('.tag-input').tagsinput();
            }
            // Select2
            if ($this.isInclude('select2.min.js')) {
                $('.select2').each(function () {
                    var obj = $(this);
                    var with_icon = obj.data('icon') ? true : false;
                    var multiple = obj.prop('multiple') ? true : false;
                    var width = obj.data('width') ? obj.data('width') : "100%";

                    var option = {
                        formatNoMatches: function () {
                            return "没有找到匹配项";
                        },
                        formatInputTooShort: function (input, min) {
                            var n = min - input.length;
                            return "请再输入" + n + "个字符";
                        },
                        formatInputTooLong: function (input, max) {
                            var n = input.length - max;
                            return "请删掉" + n + "个字符";
                        },
                        formatSelectionTooBig: function (limit) {
                            return "你只能选择最多" + limit + "项";
                        },
                        formatLoadMore: function () {
                            return "加载结果中...";
                        },
                        formatSearching: function () {
                            return "搜索中...";
                        },
                        width: width
                    };
                    if (with_icon) {
                        option = $.extend(option, {
                            formatResult: function (state) {
                                var originalOption = state.element;

                                return "<i class='icon-" + $(originalOption).data('icon') + "'></i>" + state.text;
                            },
                            minimumResultsForSearch: "-1",
                            formatSelection: function (state) {
                                var originalOption = state.element;
                                return "<i class='icon-" + $(originalOption).data('icon') + "'></i>" + state.text;
                            },
                            escapeMarkup: function (m) {
                                return m;
                            }
                        });
                    }
                    if (multiple) {
                        option = $.extend(option, {formatSelectionCssClass: function (data, container) {
                            return "bg-primary";
                        }});
                    }

                    obj.select2(option);
                });
            }

            //datepicker
            $(".datepicker").each(function () {
                var obj = $(this);
                var dateFormat = obj.data('dateFormat') ? obj.attr('dateFormat') : 'yy-mm-dd';
                var maxDate = obj.data('maxDate');
                var minDate = obj.data('minDate');
                var defaultDate = obj.data('defaultDate');
                obj.datepicker({
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    monthNamesMin: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                    dayNamesMin: ['天', '一', '二', '三', '四', '五', '六'],
                    dayNamesShort: ['天', '一', '二', '三', '四', '五', '六'],
                    firstDay: 1,
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: dateFormat,
                    yearRange: '-50:+10',
                    defaultDate: defaultDate,
                    maxDate: maxDate,
                    minDate: minDate
                });
            });
            //取色器
            if ($this.isInclude('spectrum.js')) {
                $(".colorpicker").spectrum({
                    showInput: true,
                    allowEmpty:true,
                    togglePaletteOnly:true,
                    showPalette:true,
                    cancelText: "取消",
                    chooseText: "确定",
                    togglePaletteMoreText: "更多",
                    togglePaletteLessText: "折叠",
                    clearText: "清空所选颜色",
                    noColorSelectedText: "没有选择颜色",
                });
            }
            //TouchSpin 数字加减器
            if ($this.isInclude('touchspin.min.js')) {
                $(".touchspin-number").each(function () {
                    var obj = $(this);
                    var min = obj.data('min') ? obj.data('min') : 0;
                    var max = obj.data('max') ? obj.data('max') : 100;
                    var step = obj.data('step') ? obj.data('step') : 1;
                    var decimals = obj.data('decimals') ? obj.data('decimals') : 0;
                    var prefix = obj.data('prefix') ? obj.data('prefix') : "";
                    var postfix = obj.data('postfix') ? obj.data('postfix') : "";
                    obj.TouchSpin({
                        min: min,
                        max: max,
                        step: step,
                        decimals: decimals,
                        prefix: prefix,
                        postfix: postfix
                    });
                });
            }

            //wizard_stepy 多步
            if ($this.isInclude('form_wizard.min.js')) {
                $(".form-wizard").formwizard({
                    disableUIStyles: true,
                    disableInputFields: false,
                    inDuration: 150,
                    outDuration: 150
                });
            }
            // 1=>2=>3
            if ($this.isInclude('stepy.min.js')) {
                $.fn.stepy.defaults.legend = false;
                $.fn.stepy.defaults.transition = 'fade';
                $.fn.stepy.defaults.duration = 150;
                $.fn.stepy.defaults.backLabel = '<i class="icon-arrow-left13 position-left"></i> 返回';
                $.fn.stepy.defaults.nextLabel = '下一步 <i class="icon-arrow-right14 position-right"></i>';

                // stepy form
                $(".stepy-callbacks").stepy({
                    titleClick: true
                });
                $(".stepy-validation").stepy({
                    validate: true,
                    block: true,
                    next: function (index) {
                        if (!$(".stepy-validation").validate(validate)) {
                            return false
                        }
                    }
                });

                // Apply "Back" and "Next" button styling
                $('.stepy-step').find('.button-next').addClass('btn btn-primary');
                $('.stepy-step').find('.button-back').addClass('btn btn-default');
            }
        },

        initOperate: function () {

            //简单异步get操作
            $('a[data-operate="get"], button[data-operate="get"],a[data-operate="post"], button[data-operate="post"]').each(function () {
                $(this).on('click', function () {
                    operate.simpleAjaxRequest($(this));
                });
            });

            //添加编辑弹出层操作
            $('a[data-operate="add"], button[data-operate="add"],a[data-operate="edit"], button[data-operate="edit"], input[data-operate="edit"]').each(function () {
                $(this).on('click', function () {
                    operate.ajaxModal($(this));
                });
            });

            //删除操作弹出层操作
            $('a[data-operate="delete"], button[data-operate="delete"]').each(function () {
                $(this).on('click', function () {
                    operate.deleteModal($(this));
                });
            });

            //select下拉框联动操作
            $('select[data-operate="linkage"]').each(function () {
                $(this).on('change', function () {
                    operate.selectLinkage($(this));
                });
            });

            //checkbox全选
            $("input:checkbox[name='" + $this.config.checkbox_checkall_name + "']").click(function () {
                var checked = $(this).is(":checked");
                $("input:checkbox[name='" + $this.config.checkbox_name + "']").each(function () {
                    if ($(this).prop("disabled") == true) return false;
                    $(this).prop("checked", checked);
                });
                operate.checkBoxSetButton();
            });
            $("input[name='" + $this.config.checkbox_name + "']").change(function () {
                operate.checkBoxOpt($(this));
                operate.checkBoxSetButton();
            });

            //行操作
            $("table tr:gt(0) td").click(function () {
                operate.selectRow($(this));
                operate.checkBoxSetButton();
            });

            //批量操作
            $('a[data-operate="batch"], button[data-operate="batch"], input[data-operate="batch"]').click(function () {
                operate.batchModel($(this));
            });
        },

        initLayout: function () {
            // ========================================
            //
            // Heading elements
            //
            // ========================================


            // Heading elements toggler
            // -------------------------

            // Add control button toggler to page and panel headers if have heading elements
            $('.panel-heading, .page-header-content, .panel-body').has('> .heading-elements').append('<a class="heading-elements-toggle"><i class="icon-menu"></i></a>');


            // Toggle visible state of heading elements
            $('.heading-elements-toggle').on('click', function () {
                $(this).parent().children('.heading-elements').toggleClass('visible');
            });


            // Breadcrumb elements toggler
            // -------------------------

            // Add control button toggler to breadcrumbs if has elements
            $('.breadcrumb-line').has('.breadcrumb-elements').append('<a class="breadcrumb-elements-toggle"><i class="icon-menu-open"></i></a>');


            // Toggle visible state of breadcrumb elements
            $('.breadcrumb-elements-toggle').on('click', function () {
                $(this).parent().children('.breadcrumb-elements').toggleClass('visible');
            });


            // ========================================
            //
            // Navbar
            //
            // ========================================


            // Navbar navigation
            // -------------------------

            // Prevent dropdown from closing on click
            $(document).on('click', '.dropdown-content', function (e) {
                e.stopPropagation();
            });

            // Disabled links
            $('.navbar-nav .disabled a').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            // Show tabs inside dropdowns
            $('.dropdown-content a[data-toggle="tab"]').on('click', function (e) {
                $(this).tab('show')
            });


            // ========================================
            //
            // Element controls
            //
            // ========================================


            // Reload elements
            // -------------------------

            // Panels
            $('.panel [data-action=reload]').click(function (e) {
                e.preventDefault();
                var block = $(this).parent().parent().parent().parent().parent();
                $(block).block({
                    message: '<i class="icon-spinner2 spinner"></i>',
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.8,
                        cursor: 'wait',
                        'box-shadow': '0 0 0 1px #ddd'
                    },
                    css: {
                        border: 0,
                        padding: 0,
                        backgroundColor: 'none'
                    }
                });

                // For demo purposes
                window.setTimeout(function () {
                    $(block).unblock();
                }, 2000);
            });


            // Sidebar categories
            $('.category-title [data-action=reload]').click(function (e) {
                e.preventDefault();
                var block = $(this).parent().parent().parent().parent();
                $(block).block({
                    message: '<i class="icon-spinner2 spinner"></i>',
                    overlayCSS: {
                        backgroundColor: '#000',
                        opacity: 0.5,
                        cursor: 'wait',
                        'box-shadow': '0 0 0 1px #000'
                    },
                    css: {
                        border: 0,
                        padding: 0,
                        backgroundColor: 'none',
                        color: '#fff'
                    }
                });

                // For demo purposes
                window.setTimeout(function () {
                    $(block).unblock();
                }, 2000);
            });


            // Light sidebar categories
            $('.sidebar-default .category-title [data-action=reload]').click(function (e) {
                e.preventDefault();
                var block = $(this).parent().parent().parent().parent();
                $(block).block({
                    message: '<i class="icon-spinner2 spinner"></i>',
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.8,
                        cursor: 'wait',
                        'box-shadow': '0 0 0 1px #ddd'
                    },
                    css: {
                        border: 0,
                        padding: 0,
                        backgroundColor: 'none'
                    }
                });

                // For demo purposes
                window.setTimeout(function () {
                    $(block).unblock();
                }, 2000);
            });


            // Collapse elements
            // -------------------------

            //
            // Sidebar categories
            //

            // Hide if collapsed by default
            $('.category-collapsed').children('.category-content').hide();


            // Rotate icon if collapsed by default
            $('.category-collapsed').find('[data-action=collapse]').addClass('rotate-180');


            // Collapse on click
            $('.category-title [data-action=collapse]').click(function (e) {
                e.preventDefault();
                var $categoryCollapse = $(this).parent().parent().parent().nextAll();
                $(this).parents('.category-title').toggleClass('category-collapsed');
                $(this).toggleClass('rotate-180');

                $this.containerHeight(); // adjust page height

                $categoryCollapse.slideToggle(150);
            });


            //
            // Panels
            //

            // Hide if collapsed by default
            $('.panel-collapsed').children('.panel-heading').nextAll().hide();


            // Rotate icon if collapsed by default
            $('.panel-collapsed').find('[data-action=collapse]').children('i').addClass('rotate-180');


            // Collapse on click
            $('.panel [data-action=collapse]').click(function (e) {
                e.preventDefault();
                var $panelCollapse = $(this).parent().parent().parent().parent().nextAll();
                $(this).parents('.panel').toggleClass('panel-collapsed');
                $(this).toggleClass('rotate-180');

                $this.containerHeight(); // recalculate page height

                $panelCollapse.slideToggle(150);
            });


            // Remove elements
            // -------------------------

            // Panels
            $('.panel [data-action=close]').click(function (e) {
                e.preventDefault();
                var $panelClose = $(this).parent().parent().parent().parent().parent();

                $this.containerHeight(); // recalculate page height

                $panelClose.slideUp(150, function () {
                    $(this).remove();
                });
            });


            // Sidebar categories
            $('.category-title [data-action=close]').click(function (e) {
                e.preventDefault();
                var $categoryClose = $(this).parent().parent().parent().parent();

                $this.containerHeight(); // recalculate page height

                $categoryClose.slideUp(150, function () {
                    $(this).remove();
                });
            });


            // ========================================
            //
            // Main navigation
            //
            // ========================================


            // Main navigation
            // -------------------------

            // Add 'active' class to parent list item in all levels
            $('.navigation').find('li.active').parents('li').addClass('active');

            // Hide all nested lists
            $('.navigation').find('li').not('.active, .category-title').has('ul').children('ul').addClass('hidden-ul');

            // Highlight children links
            $('.navigation').find('li').has('ul').children('a').addClass('has-ul');

            // Add active state to all dropdown parent levels
            $('.dropdown-menu:not(.dropdown-content), .dropdown-menu:not(.dropdown-content) .dropdown-submenu').has('li.active').addClass('active').parents('.navbar-nav .dropdown, .navbar-nav .dropup').addClass('active');


            // Main navigation tooltips positioning
            // -------------------------

            // Left sidebar
            $('.navigation-main > .navigation-header > i').tooltip({
                placement: 'right',
                container: 'body'
            });


            // Collapsible functionality
            // -------------------------

            // Main navigation
            $('.navigation-main').find('li').has('ul').children('a').on('click', function (e) {
                e.preventDefault();

                // Collapsible
                $(this).parent('li').not('.disabled').not($('.sidebar-xs').not('.sidebar-xs-indicator').find('.navigation-main').children('li')).toggleClass('active').children('ul').slideToggle(250);

                // Accordion
                if ($('.navigation-main').hasClass('navigation-accordion')) {
                    $(this).parent('li').not('.disabled').not($('.sidebar-xs').not('.sidebar-xs-indicator').find('.navigation-main').children('li')).siblings(':has(.has-ul)').removeClass('active').children('ul').slideUp(250);
                }
            });


            // Alternate navigation
            $('.navigation-alt').find('li').has('ul').children('a').on('click', function (e) {
                e.preventDefault();

                // Collapsible
                $(this).parent('li').not('.disabled').toggleClass('active').children('ul').slideToggle(200);

                // Accordion
                if ($('.navigation-alt').hasClass('navigation-accordion')) {
                    $(this).parent('li').not('.disabled').siblings(':has(.has-ul)').removeClass('active').children('ul').slideUp(200);
                }
            });


            // ========================================
            //
            // Sidebars
            //
            // ========================================


            // Mini sidebar
            // -------------------------

            // Toggle mini sidebar
            $('.sidebar-main-toggle').on('click', function (e) {
                e.preventDefault();

                // Toggle min sidebar class
                $('body').toggleClass('sidebar-xs');

                $this.miniSidebar();
            });


            // Sidebar controls
            // -------------------------

            // Disable click in disabled navigation items
            $(document).on('click', '.navigation .disabled a', function (e) {
                e.preventDefault();
            });


            // Adjust page height on sidebar control button click
            $(document).on('click', '.sidebar-control', function (e) {
                $this.containerHeight();
            });


            // Hide main sidebar in Dual Sidebar
            $(document).on('click', '.sidebar-main-hide', function (e) {
                e.preventDefault();
                $('body').toggleClass('sidebar-main-hidden');
            });


            // Toggle second sidebar in Dual Sidebar
            $(document).on('click', '.sidebar-secondary-hide', function (e) {
                e.preventDefault();
                $('body').toggleClass('sidebar-secondary-hidden');
            });


            // Hide detached sidebar
            $(document).on('click', '.sidebar-detached-hide', function (e) {
                e.preventDefault();
                $('body').toggleClass('sidebar-detached-hidden');
            });


            // Hide all sidebars
            $(document).on('click', '.sidebar-all-hide', function (e) {
                e.preventDefault();

                $('body').toggleClass('sidebar-all-hidden');
            });


            //
            // Opposite sidebar
            //

            // Collapse main sidebar if opposite sidebar is visible
            $(document).on('click', '.sidebar-opposite-toggle', function (e) {
                e.preventDefault();

                // Opposite sidebar visibility
                $('body').toggleClass('sidebar-opposite-visible');

                // If visible
                if ($('body').hasClass('sidebar-opposite-visible')) {

                    // Make main sidebar mini
                    $('body').addClass('sidebar-xs');

                    // Hide children lists
                    $('.navigation-main').children('li').children('ul').css('display', '');
                }
                else {

                    // Make main sidebar default
                    $('body').removeClass('sidebar-xs');
                }
            });


            // Hide main sidebar if opposite sidebar is shown
            $(document).on('click', '.sidebar-opposite-main-hide', function (e) {
                e.preventDefault();

                // Opposite sidebar visibility
                $('body').toggleClass('sidebar-opposite-visible');

                // If visible
                if ($('body').hasClass('sidebar-opposite-visible')) {

                    // Hide main sidebar
                    $('body').addClass('sidebar-main-hidden');
                }
                else {

                    // Show main sidebar
                    $('body').removeClass('sidebar-main-hidden');
                }
            });


            // Hide secondary sidebar if opposite sidebar is shown
            $(document).on('click', '.sidebar-opposite-secondary-hide', function (e) {
                e.preventDefault();

                // Opposite sidebar visibility
                $('body').toggleClass('sidebar-opposite-visible');

                // If visible
                if ($('body').hasClass('sidebar-opposite-visible')) {

                    // Hide secondary
                    $('body').addClass('sidebar-secondary-hidden');

                }
                else {

                    // Show secondary
                    $('body').removeClass('sidebar-secondary-hidden');
                }
            });


            // Hide all sidebars if opposite sidebar is shown
            $(document).on('click', '.sidebar-opposite-hide', function (e) {
                e.preventDefault();

                // Toggle sidebars visibility
                $('body').toggleClass('sidebar-all-hidden');

                // If hidden
                if ($('body').hasClass('sidebar-all-hidden')) {

                    // Show opposite
                    $('body').addClass('sidebar-opposite-visible');

                    // Hide children lists
                    $('.navigation-main').children('li').children('ul').css('display', '');
                }
                else {

                    // Hide opposite
                    $('body').removeClass('sidebar-opposite-visible');
                }
            });


            // Keep the width of the main sidebar if opposite sidebar is visible
            $(document).on('click', '.sidebar-opposite-fix', function (e) {
                e.preventDefault();

                // Toggle opposite sidebar visibility
                $('body').toggleClass('sidebar-opposite-visible');
            });


            // Mobile sidebar controls
            // -------------------------

            // Toggle main sidebar
            $('.sidebar-mobile-main-toggle').on('click', function (e) {
                e.preventDefault();
                $('body').toggleClass('sidebar-mobile-main').removeClass('sidebar-mobile-secondary sidebar-mobile-opposite sidebar-mobile-detached');
            });


            // Toggle secondary sidebar
            $('.sidebar-mobile-secondary-toggle').on('click', function (e) {
                e.preventDefault();
                $('body').toggleClass('sidebar-mobile-secondary').removeClass('sidebar-mobile-main sidebar-mobile-opposite sidebar-mobile-detached');
            });


            // Toggle opposite sidebar
            $('.sidebar-mobile-opposite-toggle').on('click', function (e) {
                e.preventDefault();
                $('body').toggleClass('sidebar-mobile-opposite').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-detached');
            });


            // Toggle detached sidebar
            $('.sidebar-mobile-detached-toggle').on('click', function (e) {
                e.preventDefault();
                $('body').toggleClass('sidebar-mobile-detached').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-opposite');
            });

            $this.miniSidebar();
            $this.initScroll();

            // Mobile sidebar setup
            // -------------------------

            $(window).on('resize',function () {
                setTimeout(function () {
                    $this.containerHeight();
                    if ($(window).width() <= 768) {

                        // Add mini sidebar indicator
                        $('body').addClass('sidebar-xs-indicator');

                        // Place right sidebar before content
                        $('.sidebar-opposite').insertBefore('.content-wrapper');

                        // Place detached sidebar before content
                        $('.sidebar-detached').insertBefore('.content-wrapper');

                        $('.table-responsive').css('overflow', 'auto');
                        //$this.removeScroll();
                    }
                    else {

                        // Remove mini sidebar indicator
                        $('body').removeClass('sidebar-xs-indicator');

                        // Revert back right sidebar
                        $('.sidebar-opposite').insertAfter('.content-wrapper');

                        // Remove all mobile sidebar classes
                        $('body').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-detached sidebar-mobile-opposite');

                        // Revert left detached position
                        if ($('body').hasClass('has-detached-left')) {
                            $('.sidebar-detached').insertBefore('.container-detached');
                        }
                        // Revert right detached position
                        else if ($('body').hasClass('has-detached-right')) {
                            $('.sidebar-detached').insertAfter('.container-detached');
                        }

                        $('.table-responsive').css('overflow', 'visible');

                        //$this.initScroll();
                    }
                }, 100);
            }).resize();
        },

        containerHeight: function () {
            var availableHeight = $(window).height() - $('body > .navbar').outerHeight() - $('body > .navbar + .navbar').outerHeight() - $('body > .navbar + .navbar-collapse').outerHeight();

            $('.page-container').attr('style', 'min-height:' + availableHeight + 'px');
        },

        miniSidebar: function () {
            if ($('body').hasClass('sidebar-xs')) {
                $('.sidebar-main.sidebar-fixed .sidebar-content').on('mouseenter',function () {
                    if ($('body').hasClass('sidebar-xs')) {

                        // Expand fixed navbar
                        $('body').removeClass('sidebar-xs').addClass('sidebar-fixed-expanded');
                    }
                }).on('mouseleave', function () {
                    if ($('body').hasClass('sidebar-fixed-expanded')) {

                        // Collapse fixed navbar
                        $('body').removeClass('sidebar-fixed-expanded').addClass('sidebar-xs');
                    }
                });
            }
        },

        initScroll: function () {
            $(".sidebar-fixed .sidebar-content").niceScroll({
                mousescrollstep: 100,
                cursorcolor: '#ccc',
                cursorborder: '',
                cursorwidth: 3,
                hidecursordelay: 100,
                autohidemode: 'scroll',
                horizrailenabled: false,
                preservenativescrolling: false,
                railpadding: {
                    right: 0.5,
                    top: 1.5,
                    bottom: 1.5
                }
            });
        },

        // Remove
        removeScroll: function () {
            $(".sidebar-fixed .sidebar-content").getNiceScroll().remove();
            $(".sidebar-fixed .sidebar-content").removeAttr('style').removeAttr('tabindex');
        },

        resetModal: function () {
            $this.initDom();
            $this.initPlugins();
            $this.initOperate();
        },

        isInclude: function (name) {
            var js = /js$/.test(name);
            var es = document.getElementsByTagName(js ? 'script' : 'link');
            for (var i = 0; i < es.length; i++)
                if (es[i][js ? 'src' : 'href'].indexOf(name) != -1)return true;
            return false;
        }
    }
}();
