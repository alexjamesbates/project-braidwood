/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  var Update;
  if (event.data == YT.PlayerState.PLAYING) {
    Update = setInterval(function() {
      UpdateMarkers()
    }, 100);
  } else {
    clearInterval(Update);
  }
}

// Sample Markers on Page
var MarkersInit = function(markers) {
  var elements = document.querySelectorAll('.youtube-marker');
  Array.prototype.forEach.call(elements, function(el, i) {
    var time_start = el.dataset.start;
    var time_end = el.dataset.end;
    var id = el.dataset.id;;
    if (id >= 1) {
      id = id - 1;
    } else {
      id = 0;
    }
    marker = {};
    marker.time_start = time_start;
    marker.time_end = time_end;
    marker.dom = el;
    if (typeof(markers[id]) === 'undefined') {
      markers[id] = [];
    }
    markers[id].push(marker);
  });
}

// On Ready
var markers = [];

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {

    // Init Markers
    MarkersInit(markers);

    // Register On Click Event Handler
    var elements = document.querySelectorAll('.youtube-marker');
    Array.prototype.forEach.call(elements, function(el, i) {
      el.onclick = function() {
        // Get Data Attribute
        var pos = el.dataset.start;
        // Seek
        player.seekTo(pos);
      }
    });

  } // Document Complete
}; // Document Ready State Change

function UpdateMarkers() {
  var current_time = player.getCurrentTime();
  var j = 0; // NOTE: to extend for several players
  markers[j].forEach(function(marker, i) {

    if (current_time >= marker.time_start && current_time <= marker.time_end) {
      marker.dom.classList.add("youtube-marker-current");
    } else {
      marker.dom.classList.remove("youtube-marker-current");
    }
  });
}
