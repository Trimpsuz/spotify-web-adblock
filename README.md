# Spotify Web Adblock

Basically [this](https://github.com/tomer8007/spotify-web-ads-remover) fixed and ported to firefox, with some changes

## TODO

When an injected ad is removed, the backend becomes desynced and still thinks you are playing the ad, among other things this causes the queue to break in the UI and external applications that query your currently playing track from the spotify API to not work
