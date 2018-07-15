function theTimeOfTheEvent(showFullDate){
    var d = new Date();

    var day = d.getDate();
    if (day<10) day = "0"+day;

    var month = d.getMonth()+1;
    if (month<10) month = "0"+month;

	var year = d.getFullYear();

    var hour = d.getHours();
    if (hour<10) hour = "0"+hour;
    
    var minute = d.getMinutes();
    if (minute<10) minute = "0"+minute;
    
    var second = d.getSeconds();
    if (second<10) second = "0"+second;

    if(showFullDate){
        return day+"."+month+"."+year+" | "+hour+":"+minute+":"+second;
    } else{
        return hour+":"+minute+":"+second;
    }
}

function uniq(a) {
    return Array.from(new Set(a));
}
    
var title = document.title;
var count = 0;

function changeTitle() {
    count++;
    var newTitle = '(' + count + ') ' + title;
    document.title = newTitle;
}

var sound = new Howl({
    src: [config.notificationSound.path],
    autoplay: false,
    loop: false,
    volume: config.notificationSound.volume,
});

var artyom = new Artyom();

artyom.initialize({
    lang:"en-GB",
    listen:false,
    debug:false,
    volume: config.TTSReader.volume,
    speed: config.TTSReader.speed 
})

var livesTwitch = [];
var livesYT = [];

var notificationCount = 0;

if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
}

if(Notification.permission !== 'granted'){
    Notification.requestPermission(function (permission) {
        console.log(permission);
    });
}

setInterval(function(){
    //console.log("sprawdzam Twitch");
    var a = "?user_login=" + config.twitchCanals.join("&user_login=");
    if(config.twitchCanals.length){
        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/helix/streams" + a,
            beforeSend: function(xhr){
                xhr.setRequestHeader('Client-ID', config.twitchApiKey);
            },
            success: function (data) {
                //console.log(data);
                var str = "?id=";
                for(var i = 0; i<data.data.length; i++){
                    str += data.data[i].user_id + "&id=";
                }
                var userIDs = str.slice(0, -4);
                if(userIDs.length){
                    $.ajax({
                        type: "GET",
                        url: "https://api.twitch.tv/helix/users" + userIDs,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader('Client-ID', config.twitchApiKey);
                        },
                        success: function(data){
                            //console.log(data);
                            var tmpArrayTwitch = [];
                            for(var i = 0; i<data.data.length; i++){
                                tmpArrayTwitch.push(data.data[i].login);
                            }
                            data.data.forEach(function(item){
                                //console.log(item);
                                if(livesTwitch.includes(item.login)){
                                    //console.log("te kanały prowadzą już transmisje na Twitch");
                                    livesTwitch = uniq(livesTwitch);
                                    //console.log(livesTwitch);
                                    //console.log(tmpArrayTwitch);
                                } else{
                                    livesTwitch.push(item.login);
                                    $("#container").append('<div class="notif"><span class="time">[ ' + theTimeOfTheEvent(config.displayFullDate) + ' ] </span><span class="userName">' + item.display_name + '</span> nadaje na żywo w serwisie <span class="twitch">Twitch</span>: <a class="link" target="_blank" href="https://www.twitch.tv/' + item.login + '">https://www.twitch.tv/' + item.login + '</a></div>');
                                    var img = "twitch_logo.png";
                                    var text = item.display_name + ' nadaje na żywo';
                                    var notification = new Notification('Twitch', { body: text, icon: img });
                                    if(config.notificationSound.play){
                                        sound.play();
                                    }
                                    if(config.TTSReader.on){
                                        artyom.say(item.display_name + config.TTSReader.messageToSay + " Twitch", {
                                            lang: config.TTSReader.lang
                                        });
                                    }
                                    changeTitle();
                                    notificationCount++;
                                }
                            });
                            if(!(livesTwitch.length === tmpArrayTwitch.length && livesTwitch.every(function(v,i) { return v === tmpArrayTwitch[i]}))){
                                //console.log("tablice różne (twitch)");
                                livesTwitch = tmpArrayTwitch;
                            } else{
                                //console.log("tablice takie same (twitch)");
                            }
                        },
                        error: function(err){
                            console.error("error ajax (twitch users)");
                            console.error(err);
                        }
                    });
                } else{
                    //console.log("brak transmisji na Twitch");
                }
                
            },
            error: function(err){
                console.error("error ajax (twitch streams)");
                console.error(err);
            }
        });
    } else{
        console.log("pusta tablica kanałów Twitch w config.js");
    }
},config.checkTwitchTime);

setInterval(function(){
    //console.log("Sprawdzam You Tube");
    var tmpArrayYT = [];
    if(config.YTCanals.length){
        let requests = config.YTCanals.map(function(item){
            return new Promise(function(resolve){
                (function(item,resolve){
                    $.ajax({
                        type: "GET",
                        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + item + "&type=video&eventType=live&key=" + config.youTubeApiKey,
                        success: function(data){
                            if(data.items.length){
                                //console.log(data.items[0].snippet.liveBroadcastContent);
                                //console.log(data.items[0].snippet.channelTitle);
                                tmpArrayYT.push(data.items[0].snippet.channelTitle);
                                if(livesYT.includes(data.items[0].snippet.channelTitle)){
                                    //console.log("te kanały prowadzą już transmisje na You Tube");
                                    livesYT = uniq(livesYT);
                                    //console.log(livesYT);
                                    // console.log(tmpArrayYT);
                                } else{
                                    livesYT.push(data.items[0].snippet.channelTitle);
                                    $("#container").append('<div class="notif"><span class="time">[ ' + theTimeOfTheEvent(config.displayFullDate) + ' ] </span><span class="userName">' + data.items[0].snippet.channelTitle + '</span> nadaje na żywo w serwisie <span class="yt">YouTube</span>: <a class="link" target="_blank" href="https://www.youtube.com/channel/' + data.items[0].snippet.channelId + '">https://www.youtube.com/channel/' + data.items[0].snippet.channelId + '</a></div>');
                                    var img = "youtube_logo.png";
                                    var text = data.items[0].snippet.channelTitle + ' nadaje na żywo';
                                    var notification = new Notification('You Tube', { body: text, icon: img });
                                    if(config.notificationSound.play){
                                        sound.play();
                                    }
                                    if(config.TTSReader.on){
                                        artyom.say(data.items[0].snippet.channelTitle + config.TTSReader.messageToSay + " You Tube", {
                                            lang: config.TTSReader.lang
                                        });
                                    }
                                    changeTitle();
                                    notificationCount++;
                                }       
                            } else{
                                //console.log("brak Transmisji na YouTube");
                            }
                            resolve();
                        },
                        error: function(err){
                            console.error("ajax error (you tube)");
                            console.error(err);
                            resolve();
                        }
                    });
                })(item,resolve);
            });
        });
    
        Promise.all(requests).then(function(){
            if(!(livesYT.length === tmpArrayYT.length && livesYT.every(function(v,i) { return v === tmpArrayYT[i]}))){
                // console.log("tablice różne (You Tube)");
                // console.log(livesYT);
                // console.log(tmpArrayYT);
                livesYT = tmpArrayYT;
            } else{
                // console.log("tablice takie same (You Tube)");
                // console.log(livesYT);
                // console.log(tmpArrayYT);
            }
        });
    } else{
        console.log("pusta tablica kanałów You Tube w config.js");
    }  
},config.checkYTTime);

setInterval(function(){
    if(notificationCount > config.notificationCountLimit){
        location.reload();
    }
}, config.notificationCountLimitTime);

