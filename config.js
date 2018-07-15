var config = {
    twitchApiKey: "", //klucz api do Twitch
    youTubeApiKey: "", //klucz api do YouTube
    displayFullDate: false,//czy wyświetalć pełną date (dzień miesiąc rok )
    notificationSound: {//ustawienia dźwięku powiadomień
        play: true, //czy dzwięk ma być odtwarzany
        volume: 1, //głośność, od 0 do 1
        path: "notification_sound.wav" //ścieżka do pliku z dźwiękiem (formaty: mp3,wav,ogg - zależy od obsługi przez przeglądarke)
    },
    TTSReader: {// ustawienia czytnika TTS
        on: true, // czy ma być włączony
        volume: 1, //głośność, od 0 do 1
        speed: 1, //szybkość od 0 do 2
        lang: "pl-PL", // język ( https://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/getlanguage )
        messageToSay: " nadaje na żywo w serwisie" //wiadomość do przeczytania
    },
    notificationCountLimit: 200, // po ilu powiadomieniach przeładować strone (po to aby nie zapychać ramu)
    notificationCountLimitTime: 30000,//co ile milisekund sprawdzać ten limit
    checkTwitchTime: 30000, //co ile milisekund sprawdzać twitch
    checkYTTime: 30000, // co ile milisekund sprawdzać You Tube
    /*kanały twitch (user login np. twitchpresents)*/
    twitchCanals: [
		
    ],
    /*kanały You Tube (Chanell ID np. UCBR8-60-B28hp2BmDPdntcQ)*/
    YTCanals: [
        
    ]
}