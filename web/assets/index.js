var A = {};
var mw_url = "http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/test?key=ee5e16f0-13f9-4750-b9e8-b4fa8a4f860d";

var mw_apikey = 'ee5e16f0-13f9-4750-b9e8-b4fa8a4f860d';

//var wordnik_url = "http://api.wordnik.com/v4/word.json/";
//var wordnik_apiKey = "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"; //demo key from developer.wordnik.com


function parseWebsterSyns (json_data, word) {
      var terms, html_str='';
      var num, def, syns_str, syns_arr;

      /* entry
          term
              hw ("magic")
          fl (part of speech)
          sens
              sn (#1)
              mc (definition 1)
              vi (example sentence)
              syn!
              */
      //var entries = $(xml).find('entry');
      //console.log('json_data',json_data);

      var entry_arr = json_data.entry_list[0].entry;

      console.log(word);

      if (entry_arr === undefined) {
          console.log('UNDEF');
          html_str = '<br><span class="opt-able"><strong>' + word + '</strong></span> (<em>no synonyms found</em>)  <br>';

      } else {

          for (var i = 0; i < entry_arr.length; i++) {
              word    = entry_arr[i].term[0].hw[0]['_text'];
              PoS     = entry_arr[i].fl[0]['_text'];

              //html_str += '<br><span class="opt-able" onclick="toggleOpts(\''+word+'\');"><strong>' + word + '</strong></span> (<em>'+ PoS +'</em>)  <br>';
              html_str += '<br><span class="opt-able"><strong>' + word + '</strong></span> (<em>'+ PoS +'</em>)  <br>';

              senses  = entry_arr[i].sens;
              for (var j = 0; j < senses.length; j++) {
                  num = senses[j].sn ? senses[j].sn[0]['_text'] + '. ' : '';
                  def = senses[j].mc ? senses[j].mc[0]['_text'] : '';

                  if (senses[j].syn) {
                      syns_str = senses[j].syn[0]['_text'];
                      syns_arr = syns_str.split(', ');
                      for (var k = 0; k < syns_arr.length; k++) {
                          syns_arr[k] = '<span class="opt-able">' + syns_arr[k] + '</span>';
                      };
                      syns_str = syns_arr.join(', ');

                      html_str += num + def + '<br>';
                      html_str += '&nbsp;&nbsp;&nbsp;&nbsp;' + syns_str + '<br>';
                  }
              };

          }
      }
      //console.log('html_str',html_str);

      $('#syns').html( html_str);

      $('.opt-able').click(function(event){
          var temp = $(this).text();
          toggleOpts(temp, event);
      })

      /*var entries = $(json_data).find('entry');

      for (var i = 0; i < entries.length; i++) {

        terms = $(entries[i]).find('term');
        for (var j = 0; j < terms.length; j++) {
          word = $(terms[j]).find('hw');
          PoS = $(terms[j]).find('fl');

          html_str += '<br><span class="opt-able" onclick="toggleOpts();"><strong>' + word + '</strong></span> (<em>'+ PoS +'</em>)  ';


          senses = $(terms[j]).find('sens');
          for (var k = 0; k < senses.length; k++) {
            html_str += senses[k].find('sn') + '. ' + senses[k].find('mc') + '<br>';
            html_str += senses[k].find('syn') + '<br>';
          }
        }

      }*/
}


function getWebsterSyns (word, ref, key) {
    uri = "http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/" +
          encodeURIComponent(word) + "?key=" + encodeURIComponent(mw_apikey) ; // + '&outputFormat=application/json';

    uri = 'server/proxy.php?url=' + uri;

    if (most_common_words.indexOf(word) == -1) {
        console.log(word);
        $.ajax({
          url: uri,
          type: "GET",
          //dataType: "jsonp",  //For external apis
          dataType: "xml",  //For external apis
          success: function(response) {
              //var xml = $( $.parseXML(response) );
              //FOO = response;
              //BAR = xmlToJSON.parseString(FOO);
              //BAR = xmlToJSON.parseXML(FOO);
              //alert("success");
              parseWebsterSyns( xmlToJSON.parseXML(response), word );
          },
          error: function (request, status, error) {
              console.log(request.responseText);
          },
          complete: function (foo) {
              //console.log(foo);
          }
        });
    } else {
        html_str = '<br><span class="opt-able"><strong>' + word + "</strong></span> (<em>C'mon.</em>)  <br>";
        $('#syns').html( html_str);
    }
}

function getWebsterDefinitionJSON (word, ref, key)
  { uri = "http://www.dictionaryapi.com/api/v1/references/" + encodeURIComponent(ref) + "/json/" +encodeURIComponent(word) + "?key=" + encodeURIComponent(key);
    //return file_get_contents(uri);
    $.getJSON(uri,function(data) {
      console.log(data);
    });
  }


var path;

var bht_url = "https://words.bighugelabs.com/api/2/";
var bht_apikey = "eb4e57bb2c34032da68dfeb3a0578b68";


var SCHEMAS = {};
/*SCHEMAS.definitions = array of objects
definition would be for i++ result[i].text*/

window.onload = function() {
    document.getElementById("your_word").focus();
    //initAutoThesaurus();
    $('#your_word').focus();

    //$(window).keypress(function(e) {
    $(document).on('keyup','#your_word', function(e) {

        var kcd = e.keyCode || e.which;
        if (kcd == 0 || kcd == 229) { //for android chrome keycode fix
            kcd = getKeyCode(this.value);
        }

      //if (e.keyCode == 0 || e.keyCode == 32 || e.keyCode == 13) {
      if (kcd == 0 || kcd == 32 || kcd == 13) {
        console.log('keypress', kcd);
        //console.log('Space pressed, or Enter pressed');
        var word = extractor( $('#your_word').val() );
        console.log('word', word);
        getWebsterSyns(word, 'foo', mw_apikey);
        //getLy(word, 'foo', mw_apikey);
      }
    });

    $('#demo').on('click', function(e) {
      console.log($("#your_word").val());
      simulateUse(e);
    });

    $('#lyrics-phrase-search').on('click', function(e) {

        $("#lyrics-modal").fadeIn(function(){});

        console.log($('#your_word').val());
        searchLyrics($('#your_word').val());

        $("#close-lyrics").click(function(){
            $("#lyrics-modal").fadeOut(function(){});
        });
    });

};

// keycode workaround needed for android
var getKeyCode = function (str) {
    return str.charCodeAt(str.length - 1);
}

function extractor(query) {
    query = query.trim();
    var result = /([^ ]+)$/.exec(query);
    if(result && result[1])
        return result[1].trim();
    return '';
}

$(document).on("click.tt", ".tt-suggestion", function(e) {
    /*console.log('click.tt, .tt-suggestion', $(this).html() );
    console.log('click.tt, .tt-suggestion', $(this) );
    console.log('.paper html', $('.paper').html() );
    *///$(this).show();
    e.stopPropagation();
    e.preventDefault();
});


// Changes XML to JSON
function xmlToJson(xml) {

  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};


var OPT_SHOWN = false;

function makeMeCloseable(el) {
    console.log('makeMeCloseable',el);
    $(document).mouseup(function (e) {
        var container = $(el);
        console.log(container);
        console.log(e.target);

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
        }
    });

}

function initSettingsEditor() {
    /*
    On click, pop out:
    (Delta council color widget customized)
        paper color: bc
        pen color: fc
        font face: ff
        font size: fs
    On each change, do change
    On page click, close / pop-in

    */

    $('#paper-div').removeClass('paper');

    $('#edit-background').on('change',function(){
        $('body').css('background',$(this).value());
        updateUrl();
    });
}

function readUrl() {
    /*
    wwww.tlex.me/#bc=ddd&fc=080&ff=serif&fs=18&w=effortless

    */
    A.url_params = {};

    // Get url params:
    var all_pairs = location.hash.substring(1).split('&');
    var a_pair;
    for (var i = 0; i < all_pairs.length; i++) {
        a_pair = all_pairs[i].split('=');
        A.url_params[ a_pair[0] ] = a_pair[1];
    }

    // Make page changes for params

    // Illustrate typing/writing

    // Set settings input controls to match

    /*d3.select('#selector_a').node().value = hash[0] || G.input_A;
    d3.select('#selector_b').node().value = hash[1] || G.input_B;
    */
}

function simulateUse(e) {
    console.log("simuse");
    // First add escape character where spaces are
    // Don't split to array (because each word overwrites previous


    var words_in_sample = getRandomLyric();
    words_in_sample = words_in_sample.replace(/ /g, '^200 ');
    //.split(' ');
    for (var i = 0; i < words_in_sample.length; i++) {
        // Need to
        //words_in_sample[i];
    }

    console.log(words_in_sample);

    // ? http://stackoverflow.com/questions/31598309/typed-js-how-to-call-function-onclick-multiple-times
    $(function(){
      console.log("anon in simuse");
      console.log($("#your_word").val());
      $("#your_word").typed({
        //strings: ["First sentence"],
        strings: [words_in_sample],
        //strings: ["First sentence.", "Second sentence."],
        showCursor: false,
        typeSpeed: 10, // ms? Inverse speed? Delays?
        callback: function() {
          console.log("CALLBACK");
          $("#demo").html("");
          //$("#your_word").focus();
        },
        preStringTyped: function() {
          console.log("preStringTyped");
        },
        onStringTyped: function() {
          console.log("STRINGTYPED");
          extractAndGetSyns();
        },
        resetCallback: function() {
          console.log("RESET");
        }
      });
    });

}

function extractAndGetSyns() {
    var word = extractor( $('#your_word').val() );
    //getAndParseBHT();
    getWebsterSyns(word, 'foo', mw_apikey);
}

function writeUrl() {
    var new_hash = '#' + d3.select('#selector_a').node().value +
        '/' + d3.select('#selector_b').node().value;
    window.location.hash  = new_hash;
}


function initSpectrum(drawn_obj) {

    var color = drawn_obj.options.color || drawn_obj.options.gin_color || '#000011';

    var outline_color = hex2rgba(color,0.8);
    var fill_color = hex2rgba(color,0.2);
    $("#colorPicker").css('border-color',outline_color);
    $("#colorPicker").css('background-color',fill_color);


    $("#colorPicker").spectrum({
        //color: "#000",
        color: color,
        showInitial: true,
        showInput: true,
        preferredFormat: 'hex',
        d_obj: drawn_obj,
        clickoutFiresChange: true, // defaults to cancelling/reverting color
        show: function(){
            //$("#colorPicker").css('background-color',drawn_obj.options.color);
        }
    });


    $("#colorPicker").on('move.spectrum,dragstop.spectrum', {d_obj: drawn_obj}, function(e, tinycolor) {
        //console.log('drag',tinycolor.toHexString());
        var outline_color = hex2rgba(tinycolor.toHexString(),0.8);
        var fill_color = hex2rgba(tinycolor.toHexString(),0.2);

        if ( e.data.d_obj.gin_type == 'marker' ) {
            customIcon.options.strokeColor = customIcon.options.markerColor = tinycolor.toHexString();
            e.data.d_obj.setIcon(customIcon);
            e.data.d_obj.options.gin_color = tinycolor.toHexString();
            //http://a.tiles.mapbox.com/v3/marker/pin-s+009900.png
        } else {
            e.data.d_obj.setStyle({color: tinycolor.toHexString()});
        }
        $("#colorPicker").css('border-color',outline_color);
        $("#colorPicker").css('background-color',fill_color);
    });


    $('#annotation').val(drawn_obj.options.anno);

    $('#custom_info_save').click( {d_obj: drawn_obj}, function(e, d_obj) {
        e.data.d_obj.options.anno = $('#annotation').val();
        a = $(".leaflet-popup-close-button")[0];
        $(a).click();
    });
}


function toggleOpts(clicked_word, event) {
    var top_y = event.pageY - 33;
    var left_x = event.pageX + 5;
    var css_obj = {position:"absolute" };
    // which edge is it closest to?
    console.log( $('body').width(), event.pageX );
    console.log( $('body').height(), event.pageY );
    if ( event.pageX < $('body').width() / 2 ) {
        console.log('left half');
        css_obj.left = event.pageX + 0;
    } else {
        console.log('right half');
        css_obj.right = $('body').width() - event.pageX - 0;
    }

    if ( event.pageY < $('body').height() / 2 ) {
        console.log('top half');
        css_obj.top = event.pageY + 0;
    } else {
        console.log('bottom half');
        css_obj.bottom = $('body').height() - event.pageY - 0;
    }


    //$("#word-opts").parent().css( {position:"absolute", top: top_y, left: left_x});
    $("#word-opts").parent().css( css_obj );

    $('#opt-word').html( clicked_word );

    $("#word-opts").fadeIn(function(){
        OPT_SHOWN=true;

        $("#opt-heart").click(function(){
            var url = "server/ode_endpoint.php?term=" + clicked_word;
            window.open(url, '_blank');
        });

        $("#opt-music").click(function(){
          $("#lyrics-modal").fadeIn(function(){});

          searchLyrics(clicked_word);

          $("#close-lyrics").click(function(){
              $("#lyrics-modal").fadeOut(function(){});
          });
        });

        makeMeCloseable(this);
    });

    $('#opt-close').click(function(){
        console.log('opt-close');
        $("#word-opts").fadeOut(function(){OPT_SHOWN=false});
    });
}
/*
1. search for songs which have lyrics which have the word/term in them
2.
3. get the actual lyrics and write a snip of them to the span
*/
// Good exact match, but no api? http://www.songlyrics.com/index.php?section=search&searchW=here+comes+the+future+and+you+can%27t+run+from+it&submit=Search&searchIn4=lyrics&searchIn5=phrase
// Comparisons: http://www.baykalhafizoglu.com/obtaining-song-lyrics-using-music-apis/
// https://pypi.python.org/pypi/songtext/0.1.4
// https://developer.musixmatch.com/documentation/api-reference/matcher-track-get

function searchLyrics(term) {
    //uri = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText=' + encodeURIComponent(term) ; // + '&outputFormat=application/json';
    //uri = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?' + encodeURIComponent('lyricText=' +term) ; // + '&outputFormat=application/json';
    //uri = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?' + encodeURIComponent('lyricText=' +term) ; // + '&outputFormat=application/json';

    //uri = 'server/proxy_params.php?url=' + uri;
    // YES: uri = 'server/proxy_params.php?search_encoded=' + encodeURIComponent(term);


    uri = 'server/proxy_params.php?endpoint=http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?';

    uri += '&params_encoded=' + encodeURIComponent('lyricText='+term);

    $.ajax({
      url: uri,
      type: "GET",
      //dataType: "jsonp",  //For external apis
      dataType: "xml",  //For external apis
      success: function(response) {
          console.log(response);
          parseLyricSearch(response, term);
      },
      complete: function() {
          /*$('.lyric-blurb').hover(function(){
              // console.log('blurb',term);
              var el = $(this);
              writeLyrics( el, term );
          });*/
      }
    });
}

function parseLyricSearch(xml, term) {
    var html_str = '';
    //console.log(xml);
    //foo
    var items = xml.getElementsByTagName('SearchLyricResult');
    //BAR = items;
    //debugger;
    var items_len = items.length;
    items_len = items_len < 20 ? items_len : 20;
    for (var i = 0; i < items_len - 1; i++) {
      //try {
        LyricChecksum = items[i].getElementsByTagName('LyricChecksum')[0].innerHTML;
        LyricId = items[i].getElementsByTagName('LyricId')[0].innerHTML;
        SongUrl = items[i].getElementsByTagName('SongUrl')[0].innerHTML;
        Artist = items[i].getElementsByTagName('Artist')[0].innerHTML;
        Song = items[i].getElementsByTagName('Song')[0].innerHTML;

        console.log(i,Song);

        //html_str += '<a class="song-title" data-corpusid="'+ LyricId +'" target="_blank" href="'+SongUrl+'">' + Song + '</a> by ' + Artist + ' <em><span class="lyric-blurb" data-artist="'+Artist+'" data-song="'+Song+'" data-id="'+LyricId+'" data-checksum="'+LyricChecksum+'"> </span></em><br>';

        html_str += '<a class="song-title" data-corpusid="'+ LyricId +'" target="_blank" href="'+SongUrl+'" data-artist="'+Artist+'" data-song="'+Song+'" data-id="'+LyricId+'" data-checksum="'+LyricChecksum+'">' + Song + '</a> by ' + Artist + ' <em><span class="lyric-blurb"> </span></em><br>';

      //} catch(e) {console.log(e, i)}
    }
    console.log(html_str);
    $('#songs').html(html_str);

    //$('.lyric-blurb').each(function(){
    $('.song-title').hover(function(){
      writeLyrics( $(this), term );
    });


}


//function getLyrics (a,b, term) {
function writeLyrics (el, term) {
    //var uri = 'http://api.chartlyrics.com/apiv1.asmx/GetLyric';

    //uri = 'http://developer.echonest.com/api/v4/song/search?api_key=FILDTEOIK2HBORODV&format=json&artist=radiohead&title=creep&bucket=id:lyricfind-US&limit=true&bucket=tracks';

    console.log($(el));

    var a = encodeURIComponent($(el).attr('data-id'));
    var b = encodeURIComponent($(el).attr('data-checksum'));
    //var a = encodeURIComponent($(el).attr('data-artist'));
    //var b = encodeURIComponent($(el).attr('data-song'));
    //jhnklly@gmail.com apikey
    //http://developer.echonest.com/api/v4/song/search?api_key=SQMIYFB8AOENSOG4T&format=json&artist=radiohead&title=creep&bucket=id:lyricfind-US&limit=true&bucket=tracks&results=10

    //uri = 'http://developer.echonest.com/api/v4/song/search?api_key=SQMIYFB8AOENSOG4T&format=json&artist='+a+'&title='+b+'&bucket=id:lyricfind-US&limit=true&bucket=tracks';

    uri = 'server/proxy_params.php?endpoint=http://api.chartlyrics.com/apiv1.asmx/GetLyric?';

    uri += '&params_encoded=' + encodeURIComponent("lyricId=" + a + "&lyricCheckSum=" + b);

    var blurb = '';

    //console.log('el',el);

    //var a = $(el).attr('data-id');
    //var b = $(el).attr('data-checksum');


    $.ajax({
      // http://api.chartlyrics.com/apiv1.asmx/GetLyric?lyricId=131299&lyricCheckSum=76a96b8a8622fa2ea168fa9e1890e296
      url: uri,
      type: "GET",
      //data: { 'lyricId': a, 'lyricCheckSum': b},
      //data: { 'artist': a, 'title': b, 'bucket': 'id:lyricfind-US', 'limit': 'true', 'bucket': 'tracks'},
      dataType: "xml",  //For external apis
      success: function(response) {
          var xml = response;
          var items = xml.getElementsByTagName('GetLyricResult');
          // one is enough
          lyric = xml.getElementsByTagName('GetLyricResult')[0].getElementsByTagName("Lyric")[0].innerHTML || '';
          songName = xml.getElementsByTagName('GetLyricResult')[0].getElementsByTagName("LyricSong")[0].innerHTML || '';
          artistName = xml.getElementsByTagName('GetLyricResult')[0].getElementsByTagName("LyricArtist")[0].innerHTML || '';
          //coverArt = xml.getElementsByTagName('GetLyricResult')[0].getElementsByTagName("LyricCoverArtUrl")[0].innerHTML || '';

          console.log(xml.getElementsByTagName('GetLyricResult')[0]);

          lyric = lyric.replace(RegExp(term, "g"), '<span class="highlight">' + term + '</span>');

          corpus = '';
          //corpus += '<div><img src=' + coverArt + '></div>';
          corpus += '<div class="emph"><span class="songName">' + songName + '</span>, by ';
          corpus += '<span class="artistName">' + artistName + '</span></div>';
          corpus += lyric;

          $('#blurb').html(corpus);

          //console.log('inner lyric', item);

          // only get the words near the term
          /*A.item = item;
          A.burps = item.split(term);
          burps = item.split("(?i)" + term); // case-INsensitive
          console.log('burps', burps);
          //debugger;

          //before = '...' + burps[0].slice(-29);
          // arr of the words before term
          before = burps[0].split(' ');
          // if len < 5 use the all of them: otherwise just 5 of them
          if (before.length < 5) {
              before = before.join(' ');
          } else {
              //z = Math.max(before.length - 5, 1);
              before = before.slice(5);
              before = before.join(' ');
          }
          before = '...' + before;

          after = burps[1].split(' ');
          // if len < 5 use the all of them: otherwise just 5 of them
          if (after.length < 5) {
              after = after.join(' ');
          } else {
              //z = Math.max(before.length - 5, 1);
              A.after = after;
              //after = after.shift(5);
              //afterslice = after.slice(5);
              afterslice = after.shift(5);
              afterjoin = afterslice.join(' ');
          }
          after = '...' + afterjoin;

          blurb = before + term + after;

          console.log('blurb', blurb);
          $('#blurb').html(blurb);
*/


      },
      error: function(err) {
          console.log('err',err.responseText);
      }
    });
}

/*function parseLyricGet(xml, term) {
    return blurb;
}*/


/*
<SearchLyricResult>
<TrackId>0</TrackId>
<LyricChecksum>76a96b8a8622fa2ea168fa9e1890e296</LyricChecksum>
<LyricId>131299</LyricId>
<SongUrl>
http://www.chartlyrics.com/SROGu_IlkE6rOL3iDvmEng/Our+Love.aspx
</SongUrl>
<ArtistUrl>
http://www.chartlyrics.com/SROGu_IlkE6rOL3iDvmEng.aspx
</ArtistUrl>
<Artist>Rhett Miller</Artist>
<Song>Our Love</Song>
<SongRank>3</SongRank>
</SearchLyricResult>

*/

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLyric() {
    var ret = A.lyrics_array[ randomInt(0,A.lyrics_array.length) ];
    console.log(ret);
    return ret;
}


/*
Easiest user sign up?
Easiest way to prove "not a robot"? https://www.google.com/recaptcha/intro/index.html "low friction"
Easiest way to leave comments?
"Guest"/Anonymous/Anon. (Just require "not a robot")
If email required, then username === email.
*/

var most_common_words = ['the','be','to','of','and','a','in','that','have','I','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us'];


A.lyrics_array = ["It may have been Camelot for Jack and Jacqueline",
"But on the Che Guevara highway filling up with gasoline",
"Fidel Castro's brother spies a rich lady who's crying",
"Over luxury's disappointment",
"So he walks over and he's trying",
"To sympathize with her but thinks that he should warn her",
"That the Third World is just around the corner",
"In the Soviet Union a scientist is blinded",
"By the resumption of nuclear testing and he is reminded",
"That Dr Robert Oppenheimer's optimism fell",
"At the first hurdle",
"In the Cheese Pavilion and the only noise I hear",
"Is the sound of people stacking chairs",
"And mopping up spilt beer",
"And someone asking questions and basking in the light",
"Of the fifteen fame filled minutes of the fanzine writer",
"Mixing Pop and Politics he asks me what the use is",
"I offer him embarrassment and my usual excuses",
"While looking down the corridor",
"Out to where the van is waiting",
"I'm looking for the Great Leap Forwards",
"Jumble sales are organized and pamphlets have been posted",
"Even after closing time there's still parties to be hosted",
"You can be active with the activists",
"Or sleep in with the sleepers",
"While you're waiting for the Great Leap Forwards",
"One leap forwards, two leaps back",
"Will politics get me the sack?",
"Here comes the future and you can't run from it",
"If you've got a blacklist I want to be on it",
"It's a mighty long way down rock 'n roll",
"From Top of the Pops to drawing the dole",
"If no one seems to understand",
"Start your own revolution, cut out the middleman",
"In a perfect world we'd all sing in tune",
"But this is reality so give me some room",
"So join the struggle while you may",
"The Revolution is just a t-shirt away"];

