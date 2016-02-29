// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers',
    'starter.services', 'ionic.ion.headerShrink', 'jett.ionic.scroll.sista'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.overlaysWebView(false);
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


    // $ionicConfigProvider.tabs.position('top');
    $ionicConfigProvider.tabs.position('bottom');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

})


//directiva
.directive('headerShrinkDos', function($document) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            var y = 0,
                prevY = 0,
                scrollDelay = 0.4,
                scrollTop,
                fadeAmt;

            var header = $document[0].body.querySelector('.bar-header');
            var tabs = $document[0].body.querySelector('div.tabs');
            var ionTabs = angular.element($document[0].body.querySelector('ion-tabs'));

            // var ionTabs = angular.element($document[0].body.querySelector('.bar-header'));

            var toTop = ionTabs.hasClass('tabs-top');
            console.log('toTop', toTop);
            var headerHeight = header.offsetHeight;

            setTimeout(function() {
                $element.removeClass('has-tabs-top');
            }, 500);

            function onScroll(e) {
                scrollTop = e.detail.scrollTop;
                y = (scrollTop >= 0) ? Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY)) : 0;
                ionic.requestAnimationFrame(function() {
                    fadeAmt = 1 - (-y / headerHeight);
                    tabs.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
                    for (var i = 0, j = header.children.length; i < j; i++) {
                        tabs.children[i].style.opacity = fadeAmt;
                    }
                });
                prevY = scrollTop;
            }

            $element.bind('scroll', onScroll);
        }
    }
})

.directive('headerShrinkTres', function($document) {
    var fadeAmt;

    var shrink = function(tabs, tabs_amt, subHeader, header, amt, dir) {
        ionic.requestAnimationFrame(function() {
            // Threshold is equal to bar-height
            var threshold = 44;
            // Scrolling down
            if (dir === 1) {
                var _amt = Math.min(threshold, amt - threshold);
            }
            // Scrolling up
            else if (dir === -1) {
                var _amt = Math.max(0, amt - threshold);
            }
            // The translation amounts should never be negative
            _amt = _amt < 0 ? 0 : _amt;
            amt = amt < 0 ? 0 : amt;
            tabs_amt = tabs_amt < 0 ? 0 : tabs_amt;
            // Re-position the header
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,-' + _amt + 'px, 0)';
            fadeAmt = 1 - _amt / threshold;
            for (var i = 0, j = header.children.length; i < j; i++) {
                header.children[i].style.opacity = fadeAmt;
            }
            // Re-position the sub-header
            if (subHeader)
                subHeader.style[ionic.CSS.TRANSFORM] = 'translate3d(0,-' + amt + 'px, 0)';
            // Re-position the tabs
            tabs.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + tabs_amt + 'px, 0)';
        });
    };

    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            var starty = 0;
            var shrinkAmt;
            var tabs_amt;
            // Threshold is equal to bar-height + create-post height;
            var threshold = 88;
            // header
            var header = $document[0].body.querySelector('.bar-header');
            // sub-header
            var subHeader = $document[0].body.querySelector('.bar-subheader');
            var headerHeight = header.offsetHeight;
            var subHeaderHeight = (subHeader) ? subHeaderHeight : 0;

            // tabs
            var tabs = $document[0].body.querySelector('.tabs');
            var tabsHeight = tabs.offsetHeight;

            var prev = 0
            var delta = 0
            var dir = 1
            var prevDir = 1
            var prevShrinkAmt = 0;
            var prevTabsShrinkAmt = 0;

            $element.bind('scroll', function(e) {
                // if negative scrolling (eg: pull to refresh don't do anything)
                if (e.detail.scrollTop < 0)
                    return false;
                // Scroll delta
                delta = e.detail.scrollTop - prev;
                // Claculate direction of scrolling
                dir = delta >= 0 ? 1 : -1;
                // Capture change of direction
                if (dir !== prevDir)
                    starty = e.detail.scrollTop;
                // If scrolling up
                if (dir === 1) {
                    // Calculate shrinking amount
                    shrinkAmt = headerHeight + subHeaderHeight - Math.max(0, (starty + headerHeight + subHeaderHeight) - e.detail.scrollTop);
                    // Calculate shrinking for tabs
                    tabs_amt = tabsHeight - Math.max(0, (starty + tabsHeight) - e.detail.scrollTop);
                    // Start shrink
                    console.log('tres');
                    shrink(tabs, tabs_amt, subHeader, header, Math.min(threshold, shrinkAmt), dir);
                    // Save prev shrink amount
                    prevShrinkAmt = Math.min(threshold, shrinkAmt);
                    prevTabsShrinkAmt = Math.min(tabsHeight, tabs_amt);
                }
                // If scrolling down
                else {
                    // Calculate expansion amount
                    shrinkAmt = prevShrinkAmt - Math.min(threshold, (starty - e.detail.scrollTop));
                    // Calculate shrinking for tabs
                    tabs_amt = prevTabsShrinkAmt - Math.min(tabsHeight, (starty - e.detail.scrollTop));
                    // Start shrink
                    shrink(tabs, tabs_amt, subHeader, header, shrinkAmt, dir);
                }
                // Save prev states for comparison 
                prevDir = dir;
                prev = e.detail.scrollTop;
            });
        }
    }
});
