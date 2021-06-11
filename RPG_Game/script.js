//jquery function
$.fn.extend({
    setsize: function (w, h) {
        this.find('img').css({
            'max-width': w,
            'max-height': h
        });
    },
    eachtext: function (text, speed) {
        $this = $(this);
        var i = 1;
        var text2;
        var itv = setInterval(function () {
            text2 = text.slice(0, i);
            $this.text(text2);
            if (i == text.length) {
                clearInterval(itv);
            }
            i++;
        }, speed);
    }
})

//text
function eachtext(text, speed) {
    var i = 1;
    var text2;
    var itv = setInterval(function () {
        text2 = text.slice(0, i);
        console.log(text2);
        if (i == text.length) {
            clearInterval(itv);
        }
        i++;
    }, speed);
}

//drag
window.ondragstart = function () {
    return false;
}
//overlaps
var overlaps = (function () {
    function getPositions(elem) {
        var pos, width, height;
        pos = $(elem).position();
        width = $(elem).width();
        height = $(elem).height();
        return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
    }

    function comparePositions(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function (a, b) {
        var pos1 = getPositions(a),
            pos2 = getPositions(b);
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
    };
})();
//cookie
function cookie(name, value) {
    $.cookie(name, value, {
        expires: window.day
    });
}
//save game
function save(path, value) {
    window.savevar = $.cookie('save');
    eval('savevar' + path + ' = value;');
    cookie('save', savevar);
}
function removeSave(path, value) {
    window.savevar = $.cookie('save');
    eval('delete window.savevar' + path);
    cookie('save', savevar);
}
function reloadSaveVar() {
    window.savevar = $.cookie('save');
}
function deleteAllSave() {
    $.removeCookie('save');
    $.removeCookie('name');
    $.removeCookie('story_animation');
    $.removeCookie('lang');
}
//cursor
function cursor(boolean) {
    console.log(!boolean);
    if (boolean) {
        $('body').css('cursor', 'default');
    } else if (!boolean) {
        $('body').css('cursor', 'none');
    }
}
//Audio
function playaudio(path, config) {
    $('body').append('<audio src=\'' + path + '\' onended=\'this.remove();\' autoplay ' + (config.loop ? 'loop' : '') + ' ></audio > ');
}
function stopaudio() {
    $('audio').remove();
}
//langtext
function setlangtext() {
    $.get('texts/' + $.cookie('lang') + '.lang', function (data) {
        var i;
        data = data.split('\n');
        window.langtext = {};
        for (i in data) {
            var dataisplit = data[i].split('=');
            if (dataisplit.length > 2) {
                var datasplice = dataisplit.splice(1, dataisplit.length - 1);
                dataisplit[1] = arrstick(datasplice, '=');
            }
            window.langtext[dataisplit[0]] = dataisplit[1] || window.langtext[dataisplit[0]] || '';
        }
        langtextinner();
    });
}
function langtextinner() {
    //$(document).attr('title', langtext['system.game.name']);
    $('title, *#title').eachtext(langtext['system.game.name'], 50);
    $('*#startbtn').text(langtext['ui.startbtn'], 50);
    $('*#settingbtn').text(langtext['ui.settingbtn']);
    $('*#backbtn').text(langtext['ui.backbtn']);
    $('*#choose_name_display').attr('placeholder', langtext['ui.choose_name_placeholder']);
    $('*#choose_name_finishbtn').text(langtext['ui.choose_name_finishbtn']);
    $('*#menu_startbtn').text(langtext['ui.startbtn']);
    $('*#fight_choice_fight').text(langtext['fight.btn.fight']);
}

//page
function changepage(page) {
    if (page == 'back') {
        page = $('.lastpage').attr('id');
    }
    $('.lastpage').removeClass('lastpage');
    $('page.show').addClass('lastpage');
    $('page.show').removeClass('show');
    $('page#' + page).addClass('show');
}

//start
function story_animation() {
    changepage('animation');
    $('#paracelsus, #earth').hide();
    var explode = function () {
        $('#explode_circle_svg').attr('width', $('body').width());
        $('#explode_circle_svg').attr('height', $('body').height());
        var itv1 = setInterval(function () {
            $('#explode_circle').attr('r', Number($('#explode_circle').attr('r')) + 25);
            if ($('#explode_circle').attr('r') >= 1000) {
                clearInterval(itv1);
                $('#explode_circle_svg').fadeOut(2000);
                $('#water, #fire').hide();
                $('#earth').show();
                earth_rotation();
            }
        });
    }
    var water_fire_combine = function () {
        $('#water').css({
            'top': '50%',
            'left': '45%',
            'transform': 'translate(-50%, -50%)'
        });
        $('#fire').css({
            'top': '50%',
            'left': '55%',
            'transform': 'translate(-50%, -50%)'
        });
        $('#water, #fire').show();
        $('#water, #fire').setsize(50, 50);
        var time = 0;
        var time2 = 0;
        var itv = setInterval(function () {
            if (time < 400) {
                $('#fire').css('top', Number($('#fire').css('top').substr(0, $('#fire').css('top').length - 2)) - 0.05);
                $('#water').css('top', Number($('#water').css('top').substr(0, $('#water').css('top').length - 2)) - 0.05);
            }
            if (time >= 400) {
                $('#fire').css('top', Number($('#fire').css('top').substr(0, $('#fire').css('top').length - 2)) + 0.05);
                $('#water').css('top', Number($('#water').css('top').substr(0, $('#water').css('top').length - 2)) + 0.05);
            }
            if (time >= 800) {
                time = 0;
                time2++;
            }
            time++;
            if (time2 == 3) {
                explode();
                clearInterval(itv);
            }
        });
    }
    var earth_rotation = function () {
        var degrees = 0;
        var time = 0;
        var itv1 = setInterval(function () {
            $('#earth').css('transform', 'translate(-50%, -50%) rotate(' + degrees + 'deg)');
            degrees += 0.1;
            time++;
            if (time >= 2000) {
                $('#earth').fadeOut(1000);
            }
            if ($('#earth').css('display') == 'none') {
                clearInterval(itv1);
                cookie('story_animation', true);
                gamestart();
            }
        });
    }
    water_fire_combine();
}
function gamestart() {
    if (typeof $.cookie('save') == 'undefined') {
        newgame();
    } else {
        changepage('menu');
        $('#menu_name_display').eachtext($.cookie('name'), 50);
    }
}
function newgame() {
    changepage('choose_name');
    var finish = function () {
        if ($('#choose_name_display').val().length != 0) {
            cookie('name', $('#choose_name_display').val());
            cookie('save', {});
            $(document).off('keydown.choose_name')
            playaudio('audio/cymbal.mp3');
            $('#fadewhite').fadeIn(5000);
            setTimeout(function () {
                playaudio('audio/bumbum.mp3');
                $('#fadewhite').hide();
                loadgame();
            }, 5000);
        }
    }
    $('#choose_name_finishbtn').click(finish);
    $(document).on('keydown.choose_name', function () {
        document.getElementById('choose_name_display').addEventListener('select', function () {
            this.selectionStart = this.selectionEnd;
        }, false);
        if (event.which >= 65 && event.which <= 90) {
            if ($('#choose_name_display').val().length < 10) {
                $('#choose_name_display').val($('#choose_name_display').val() + event.key);
            } else if ($('#choose_name_display').val().length == 10) {
                $('#choose_name_display').val($('#choose_name_display').val().substr(0, $('#choose_name_display').val().length - 1) + event.key);
            }
        } else if (event.which == 8) {
            $('#choose_name_display').val($('#choose_name_display').val().substr(0, $('#choose_name_display').val().length - 1));
        } else if (event.which == 13) {
            finish();
        }
    });
}

//load
function loadgame() {
    reloadSaveVar();
    stopaudio();
    if (typeof window.savevar['room'] == 'undefined') {
        save('["room"]', 'room_start');
        reloadSaveVar();
    }
    changepage('map');
    move();
    cursor(false);
    changeroom(window.savevar['room'], 'left');
    setTimeout(function () {
        tofight([
            {
                name: characterData.wrong_lock.name
            }
        ]);
    }, 2000);
}

//Map
function changeroom(room, direction) {
    $('room.show').removeClass('show');
    $('room#' + room).addClass('show');
    if (typeof direction == 'undefined') {
        direction = '';
    }
    $('#mainchr').css({
        'top': roomPos[room][direction].top + '%',
        'left': roomPos[room][direction].left || 0 + '%'
    });
}

//Control
function move() {
    var movespeed = 1;
    window.moveitv = setInterval(function () {
        // var playerleft = $('sprite#mainchr').position().left / $('body').width() * 100;
        // var playertop = $('sprite#mainchr').position().top / $('body').height() * 100;
        var playerleft = $('sprite#mainchr').position().left;
        var playertop = $('sprite#mainchr').position().top;
        if (window.keys[16]) {
            // movespeed = 0.2;
            movespeed = 2;
        }
        if (!window.keys[16]) {
            // movespeed = 0.1;
            movespeed = 1;
        }
        if (window.keys[68]) {
            if (!($('#mainchr').position().left >= $('body').width() - $('#mainchr').width())) {
                $('sprite#mainchr').css('left', playerleft + movespeed + '');
            }
        }
        if (window.keys[65]) {
            if (!($('#mainchr').position().left <= 0)) {
                $('sprite#mainchr').css('left', playerleft - movespeed + '');
            }
        }
        if (window.keys[87]) {
            if (!overlaps($('sprite#mainchr')[0], $('.2-1top')[0])) {
                $('sprite#mainchr').css('top', playertop - movespeed + '');
            }
        }
        if (window.keys[83]) {
            if (!overlaps($('sprite#mainchr')[0], $('.2-1bottom')[0])) {
                $('sprite#mainchr').css('top', playertop + movespeed + '');
            }
        }
    });
}

//Fight
function tofight(config) {
    $('#fight_overlay').width($('body').width()).height($('body').height());
    $('sprite#mainchr').hide();
    $('#fight_overlay').fadeIn(500);
    //Animation
    setTimeout(function () {
        $('#fight_box').animate({
            width: 150,
            height: 150,
            borderWidth: 5
        }, 1000);
        setTimeout(function () {
            $('#fight_box').stop();
            $('#fight_box').animate({
                width: 500,
                height: 125,
                borderWidth: 5
            }, 1000).animate({
                top: '70%'
            }, 1000, function () {
                $('#fight_choice_container').animate({
                    top: '90%'
                }, 1000, function () {
                    var text = window.langtext['fight.start.text1'];
                    text = text.replace('%c', config[0].name);
                    console.log(text);
                    $('#fight_box').eachtext(text, 50);
                    cursor(true);
                });
            });
        }, 500);
    }, 250);
}

$(function () {
    //Basic
    //  monitorsize
    //$(document).width() < 720 ? window.close() : undefined;
    //  variable
    window.keys = {};
    //  2:1
    setTimeout(function () {
        if ($('body').width()) { }
        $('body').width($('body').width()).height($('body').width() / 2).css({
            top: '50%',
            transform: 'translate(0%, -50%)',
            position: 'absolute'
        });
        $('body').append('<div class=\'2-1top\'></div><div class=\'2-1bottom\'></div>');
        $('.2-1top').width($(document).width()).height($('body').position().top - 1).css({
            position: 'absolute',
            top: -$('body').position().top,
            background: 'black',
            'z-index': 101,
            cursor: 'none'
        });
        $('.2-1bottom').width($(document).width()).height($('body').position().top - 1).css({
            position: 'absolute',
            bottom: -$('body').position().top,
            background: 'black',
            'z-index': 101,
            cursor: 'none'
        });
    });
    //  cookie
    $.cookie.json = true;
    window.day = 3652;
    if (typeof $.cookie('lang') == 'undefined') {
        cookie('lang', 'en');
    }
    $('#lang').val($.cookie('lang'));
    setlangtext();
    $('page#home').addClass('show');
    //  room
    //      roomspawnpositon
    window.roomPos = {
        'room_paracelsuslab': {
            'left': {
                'top': 77,
                'left': 1
            },
            'right': {
                'top': 77,
                'left': 93
            }
        },
        'room_start': {
            'left': {
                'top': 77,
                'left': 1
            },
            'right': {
                'top': 77,
                'left': 93
            }
        }
    };
    //      roomchangetrigger
    setInterval(function () {
        var posPer = {
            x: $('#mainchr').position().left / $('body').width() * 100,
            y: $('#mainchr').position().top / $('body').height() * 100
        };
        var roomChangeTri = {
            'room_paracelsuslab': [{
                'top': 77,
                'left': 0
            }]
        };
        var roomChangeTri2 = [
            {
                b: (roomChangeTri.room_paracelsuslab[0].top + 13 >= posPer.y && roomChangeTri.room_paracelsuslab[0].top - 13 <= posPer.y) && (roomChangeTri.room_paracelsuslab[0].left >= posPer.x),
                r: 'room_other',
                a: 'room_start'
            }
        ]
        //console.log(roomChangeTri.room_paracelsuslab[0].top);
        var i;
        for (i in roomChangeTri2) {
            if (roomChangeTri2[i].b) {
                if ($('room.show').attr('id') == roomChangeTri2[i].a) {
                    console.log(roomChangeTri2[i].r);
                }
            }
        }
    });
    //      roomcollision
    //      roomsize
    setTimeout(function () {
        $('room').setsize($('body').width(), $('body').height());
        $('room > img').addClass('center');
    });
    //      Character Data
    setTimeout(function () {
        window.characterData = {
            'wrong_lock': {
                name: langtext['chr.wrong_lock.name']
            }
        };
    });
    //      HomePageMusic
    playaudio('audio/mus_homepage.mp3', {
        loop: true
    });
    //Button
    $('*#startbtn').click(function () {
        if (!$.cookie('story_animation')) {
            story_animation();
        } else {
            gamestart();
        }
    });
    $('*#settingbtn').click(function () {
        changepage('setting');
    });
    $('*#backbtn').click(function () {
        changepage('back');
    });
    $('#menu_startbtn').click(function () {
        loadgame();
    });
    //Select
    $('#lang').change(function () {
        cookie('lang', $('#lang').val());
        setlangtext();
    });
    //EventListener
    $(document).keydown(function () {
        if (event.key == 'Alt') {
            event.preventDefault();
        }
        if (event.key == 'F11') {
            event.preventDefault();
        }
        window.keys[event.which] = true;
    });
    $(document).keyup(function () {
        delete window.keys[event.which];
    });
    $(document).blur(function () {
        window.keys = {};
    });
});
