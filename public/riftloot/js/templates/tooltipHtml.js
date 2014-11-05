(function() {
    angular
        .module('tooltipHtml', [])
        .run(['$templateCache', unsafeTooltip]);

    function unsafeTooltip($templateCache) {
        $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html",
            '<span class="tooltip tip-{{placement}}" ng-class="{ in: isOpen(), fade: animation() }" style="width: auto"><span bind-html-unsafe="content"></span></span>');
    }
})();

