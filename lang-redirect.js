/**
 * Early language routing: non-Chinese browser locales → index_en.html
 * Preference: localStorage 'astore-trip-lang' = 'zh' | 'en' (set by language menu)
 */
(function () {
  var STORAGE_KEY = 'astore-trip-lang';

  function isChineseLocale(tag) {
    if (!tag) return false;
    var primary = String(tag).toLowerCase().replace(/_/g, '-').split('-')[0];
    return primary === 'zh' || primary === 'yue';
  }

  function browserPrefersChinese() {
    var list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      if (isChineseLocale(list[i])) return true;
    }
    return false;
  }

  function pageIsEnglish() {
    return /index_en\.html$/i.test(location.pathname);
  }

  function pageIsChinese() {
    return !pageIsEnglish();
  }

  function goTo(file) {
    var u = new URL(file, location.href);
    u.search = location.search;
    u.hash = location.hash;
    location.replace(u.href);
  }

  var pref = localStorage.getItem(STORAGE_KEY);

  if (pref === 'zh') {
    if (pageIsEnglish()) goTo('index.html');
    return;
  }

  if (pref === 'en') {
    if (pageIsChinese()) goTo('index_en.html');
    return;
  }

  if (!browserPrefersChinese() && pageIsChinese()) {
    goTo('index_en.html');
  }
})();
