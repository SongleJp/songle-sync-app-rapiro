// Rapiroを踊らせたい
var serialport = require('serialport')
    , port = new serialport('/dev/ttyS0', { baudRate: 57600 })
    , hostname = require('os-hostname')
    , isReady = false
    , host = null;
port.on('open', function() {
    console.log('Serial open.');
    isReady = true;
});

hostname(function(err, hname) {
    if (!err) host = hname;
    console.log('Host name:', host);
});

var SongleWidget = require("songle-widget");

// トークンの情報を取ってくる
var settings = require("./settings");

// ビート情報と基本情報をもらってくる
var player = new SongleWidget.Player({
    accessToken: settings.tokens.access
});
player.addPlugin(new SongleWidget.Plugin.Beat());
// player.addPlugin(new SongleWidget.Plugin.Chord());
// player.addPlugin(new SongleWidget.Plugin.Melody());
player.addPlugin(new SongleWidget.Plugin.Chorus());
player.addPlugin(new SongleWidget.Plugin.SongleSync());

// 何かあったらコンソールに書き出す
player.on("play", (ev) => {
    on = false;
    console.log("play");
});
player.on("seek", (ev) => {
    on = false;
    console.log("seek")
});

// 曲が止まったら腕を下す
player.on("pause", (ev) => {
    on = false;
    console.log("pause");
    write("#M0");
});

// 曲が止まったら腕を下す
player.on("finish", (ev) => {
    on = false;
    console.log("finish");
    write("#M0");
});

// 1拍子目ごとに腕を振る
var on = false, inChorus = false;
player.on("chorusSectionLeave", (ev) => {
    inChorus = false;
});
player.on("chorusSectionEnter", (ev) => {
    inChorus = true;
});
player.on("beatEnter", (ev) => {
    var beat = ev.data.beat.position;
    process.stdout.write("beat: " + beat);
    if (beat === 1) {
        process.stdout.write(", " + host + ": cycle=" + on);
        process.stdout.write(", in chorus?=" + inChorus);
        if (inChorus) {
            // center
            if (on) write("#M0");
            else write("#M5");
        } else if (host === 'rapiro-t') {
            // left
            if (on) write("#M6");
            else write("#M8");
        } else if (host === 'rapiro-p') {
            // right
            if (on) write("#M8");
            else write("#M6");
        } else {
            // center
            if (on) write("#M0");
            else write("#M5");
        }
        on = !on;
    }
    console.log();
});

// 死なないようにする
setInterval(() => { }, 1000);

process.on('SIGTERM', function() {
    write("#M0");
});

function write(data) {
    if (!isReady) return;
    port.write(data, function(err, results) {
        if (err) {
            console.log('Err: ' + err);
            console.log('Results: ' + results);
        } else {
            console.log('Wrote: ' + data);
        }
    });
}
