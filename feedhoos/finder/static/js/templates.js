feedhoos.run(["$rootScope", "$window", "$document", "fhSetter", "$templateCache",
function($rootScope, $window, $document,  fhSetter, $templateCache) {
$rootScope.feedhoos = {};
$window.addEventListener("resize", fhSetter.resize, false);
$document.bind("keyup", fhSetter.shortcut);  'use strict';

  $templateCache.put('feedhoos/finder/static/partials/finder.html',
    "<div class=\"row feedhoos-finder\">\n" +
    "    <div ng-show=\"state == 1\">\n" +
    "        <div class=\"col-lg-6\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"url\">\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" type=\"button\"\n" +
    "                        ng-click=\"search()\">Go!</button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"state == 2\">\n" +
    "        <div ng-show=\"feed_urls == null\">\n" +
    "            通信中\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover col-lg-6\" ng-if=\"feed_urls != null\">\n" +
    "                <tr data-ng-repeat=\"fu in feed_urls\">\n" +
    "                    <td>{{ fu }}</td> \n" +
    "                    <td class=\"col-lg-1 text-right\"><span class=\"glyphicon glyphicon-plus\" ng-click=\"add(fu)\"></span></td>\n" +
    "                </tr>\n" +
    "        </table>\n" +
    "        <button class=\"btn btn-sm btn-default\" ng-click=\"set_state(1)\">戻る</button>\n" +
    "    </div>\n" +
    "    <div ng-show=\"state == 3\">\n" +
    "        <div ng-show=\"result == null\">\n" +
    "            通信中\n" +
    "            <button class=\"btn btn-sm btn-default\" ng-click=\"set_state(1)\">戻る</button>\n" +
    "        </div>\n" +
    "        <span ng-if=\"result != null\">\n" +
    "            {{result.msg}}<br/>\n" +
    "            <button class=\"btn btn-sm btn-default\" ng-click=\"set_state(1)\">さらに登録</button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('feedhoos/finder/static/partials/folder.html',
    "<div class=\"row\">\n" +
    "    <div ng-show=\"!is_ready()\">通信中</div>\n" +
    "    <div id=\"content_bar\" class=\"col-lg-12 col-md-12\" ng-if=\"is_ready()\" fh-setter-resize>\n" +
    "        <table id=\"list_table\" class=\"table table-hover col-lg-12\">\n" +
    "            <tr data-ng-repeat=\"f in folders\">\n" +
    "                <td>{{ f.title }}</td> \n" +
    "                <td>\n" +
    "                    <fh-rating ng-if=\"f.id != 0\" target-id=\"{{f.id}}\" type=\"{{f.type}}\" ></fh-rating>\n" +
    "                </td>\n" +
    "                <td class=\"col-lg-1 text-right\"><fh-remove-feed target-id=\"{{f.id}}\" type=\"{{f.type}}\"></fh-remove-feed></td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('feedhoos/finder/static/partials/list.html',
    "<div ng-show=\"!is_ready()\">通信中</div>\n" +
    "<div class=\"row\" ng-show=\"is_ready()\" fh-setter-resize>\n" +
    "    <div id=\"feed_bar\" class=\"col-lg-2 visible-lg\">\n" +
    "        <ul id=\"list_bar\" class=\"list-group\">\n" +
    "            <li class=\"list-group-item feed text-left\" \n" +
    "                ng-click=\"select_folder(0)\"\n" +
    "                ng-class=\"{'list-group-item-info': (active_folder_id == 0)}\">\n" +
    "                登録しているすべてのfeed\n" +
    "            </li>\n" +
    "            <li class=\"list-group-item feed text-left\" \n" +
    "                data-ng-repeat=\"folder in folders\"\n" +
    "                ng-click=\"select_folder(folder.id)\"\n" +
    "                ng-class=\"{'list-group-item-info': (active_folder_id == folder.id)}\">\n" +
    "                {{ folder.title }} \n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div id=\"content_bar\" class=\"col-lg-10 col-md-12\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"is_add_folder = !is_add_folder\" ng-show=\"is_add_folder\">add folder</button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"is_add_folder = !is_add_folder\" ng-show=\"!is_add_folder\">cancel</button>\n" +
    "        <div collapse=\"is_add_folder\">\n" +
    "            <small>追加するフォルダーの名前を入力してください。</small>\n" +
    "            <fh-create-folder size=\"col-lg-4\"></fh-create-folder>\n" +
    "            <br/>\n" +
    "        </div>\n" +
    "        <table id=\"list_table\" class=\"table table-hover col-lg-12\" ng-if=\"bookmark && feeds\">\n" +
    "                <tr data-ng-repeat=\"f in feeds | orderBy:'-rating'\">\n" +
    "                    <td>{{ f.title }}</td> \n" +
    "                    <td>\n" +
    "                        <fh-select-folder feed-id=\"{{f.id}}\" type=\"{{f.type}}\"></fh-select-folder>\n" +
    "                    </td> \n" +
    "                    <td>\n" +
    "                        <fh-rating ng-if=\"f.id != 0\" target-id=\"{{f.id}}\" type=\"{{f.type}}\" ></fh-rating>\n" +
    "                    </td>\n" +
    "                    <td class=\"col-lg-1 text-right\"><fh-remove-feed target-id=\"{{f.id}}\" type=\"{{f.type}}\"></fh-remove-feed></td>\n" +
    "                </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('feedhoos/finder/static/partials/reader.html',
    "<div class=\"row\">\n" +
    "    <div id=\"feed_bar\" class=\"col-lg-2 visible-lg\" >\n" +
    "        <tabset justified=\"true\">\n" +
    "            <tab heading=\"Timeline\" active=\"timeline_tab\" ng-click=\"timeline_tab = true; feed_tab = false;\">\n" +
    "                <ul class=\"list-group\" fh-setter-resize>\n" +
    "                    <li class=\"list-group-item feed text-left\" data-ng-repeat=\"f in feeds | orderBy:'-rating'\" \n" +
    "                    ng-click=\"read_timeline(f.id, f.type)\"\n" +
    "                    ng-class=\"{'list-group-item-info': (active_timeline_id == f.id && type == 'timeline' && active_timeline_type == f.type)}\">\n" +
    "                        <span ng-if=\"f.type == 'folder'\">\n" +
    "                            <span class=\"glyphicon glyphicon-folder-close\"></span>\n" +
    "                            &nbsp;\n" +
    "                        </span>\n" +
    "                        {{ f.title }}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </tab>\n" +
    "            <tab heading=\"Feed\" active=\"feed_tab\" ng-click=\"timeline_tab = false; feed_tab = true;\">\n" +
    "                <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item feed text-left\" data-ng-repeat=\"r in readings | orderBy:'-rating'\" \n" +
    "                        ng-click=\"read_reading(r.id)\"\n" +
    "                        ng-class=\"{'list-group-item-info': (active_reading_id == r.id && type == 'feed')}\">\n" +
    "                        {{ r.title }}({{r.unread_count}})\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "    </div>\n" +
    "    <div id=\"content_bar\" class=\"col-lg-10 col-md-12\">\n" +
    "        <div class=\"panel panel-info entry\" ng-if=\"feed\">\n" +
    "            <div class=\"panel-heading\"  fh-scroll-top fh-justify-entry>\n" +
    "                <h3>{{ feed.title }}</h3>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-lg-11\">\n" +
    "                        <fh-rating ng-if=\"feed.id != 0\" type=\"{{feed.type}}\" target-id=\"{{feed.id}}\"></fh-rating>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-lg-1 text-right\">\n" +
    "                        <fh-remove-feed ng-if=\"feed.id != 0\" type=\"{{feed.type}}\" target-id=\"{{feed.id}}\"></fh-remove-feed>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"panel panel-default entry\" data-ng-repeat=\"e in entries\" ng-if=\"entries\" >\n" +
    "            <div class=\"panel-heading entry_heading\">\n" +
    "                <h5 class=\"entry_title\">{{ e.title }} <small>{{ e.updated}}</small></h5>\n" +
    "                <a href=\"{{ e.url }}\" target=\"_blank\">URL</a>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\" ng-bind-html=\"e.content\" ng-show=\"e.content\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );
}
]);
